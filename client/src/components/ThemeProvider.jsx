import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
  loaderTheme: "light" // Add loaderTheme to context
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  loaderStorageKey = "vite-ui-loader-theme", // New storage key for loader theme
  ...props
}) {
  // Initialize theme from localStorage
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  // Initialize a separate loaderTheme state
  // This will always be "light" unless explicitly set otherwise
  const [loaderTheme, setLoaderThemeState] = useState(() => {
    return localStorage.getItem(loaderStorageKey) || "light";
  });

  // Core function to apply a theme
  const applyTheme = (themeValue) => {
    // Get current pathname to check if we're on a special page
    const pathname = window.location.pathname.toLowerCase();
    const isSpecialPage = pathname === "/login" ||
      pathname === "/" ||
      pathname === "/scheduleappointment";

    // Don't apply theme on special pages - they manage their own theme
    if (isSpecialPage) {
      console.log("On special page, not applying theme:", pathname);
      return;
    }

    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Apply the appropriate theme
    if (themeValue === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = systemPrefersDark ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeValue);
    }
  };

  // Public method to set theme
  const setTheme = (newTheme) => {
    // Always update localStorage regardless of page
    localStorage.setItem(storageKey, newTheme);

    // Update state
    setThemeState(newTheme);

    // Apply theme only if not on special pages
    applyTheme(newTheme);

    console.log("ThemeProvider: Theme set to", newTheme);
    console.log("ThemeProvider: localStorage updated to", localStorage.getItem(storageKey));
  };

  // Handle logout event - preserve loader theme
  const handleLogout = () => {
    // When user logs out, make sure we preserve the current loader theme
    // This will be called from your logout handler
    localStorage.setItem(loaderStorageKey, loaderTheme);
    console.log("ThemeProvider: Preserved loader theme during logout:", loaderTheme);
  };

  // Function to explicitly set loader theme independent of main theme
  const setLoaderTheme = (newLoaderTheme) => {
    localStorage.setItem(loaderStorageKey, newLoaderTheme);
    setLoaderThemeState(newLoaderTheme);
    console.log("ThemeProvider: Loader theme set to", newLoaderTheme);
  };

  // Apply theme when component mounts and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply theme when navigating between pages
  useEffect(() => {
    // Listen for navigation events (using popstate as a proxy)
    const handleNavigation = () => {
      const currentTheme = localStorage.getItem(storageKey) || defaultTheme;
      applyTheme(currentTheme);
    };

    window.addEventListener('popstate', handleNavigation);

    // Initial application
    applyTheme(theme);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Listen for auth state changes (logout events)
  useEffect(() => {
    // This is a placeholder - you'll need to integrate with your actual auth system
    // Example if using a custom event:
    const handleAuthChange = (event) => {
      if (event.detail.type === 'logout') {
        handleLogout();
      }
    };

    window.addEventListener('authStateChange', handleAuthChange);
    return () => window.removeEventListener('authStateChange', handleAuthChange);

    // Alternative: if using an auth library, subscribe to its state changes here
  }, [loaderTheme, handleLogout]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
        loaderTheme,
        setLoaderTheme,
        handleLogout // Expose logout handler for direct use
      }}
      {...props}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};