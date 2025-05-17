import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
  loaderTheme: "light"
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  loaderStorageKey = "vite-ui-loader-theme",
  ...props
}) {
  // Initialize theme from localStorage
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  // Initialize a separate loaderTheme state
  const [loaderTheme, setLoaderThemeState] = useState(() => {
    return localStorage.getItem(loaderStorageKey) || "light";
  });

  // Track the previous pathname to detect navigation changes
  const [prevPathname, setPrevPathname] = useState(window.location.pathname);

  // Core function to apply a theme
  const applyTheme = (themeValue) => {
    const pathname = window.location.pathname.toLowerCase();

    // Define special routes that always use light theme
    const lightThemeRoutes = [
      "/",
      "/login",
      "/scheduleappointment",
      "/landingpage"
    ];

    const isLightThemePage = lightThemeRoutes.some(
      (route) => pathname === route.toLowerCase()
    );

    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    if (isLightThemePage) {
      // Force light theme on special pages
      root.classList.add("light");
      console.log("Applying forced light theme for special page:", pathname);
    } else {
      // Apply user's preferred theme on regular pages
      if (themeValue === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.add(systemPrefersDark ? "dark" : "light");
      } else {
        root.classList.add(themeValue);
      }
      console.log("Applied user theme on regular page:", themeValue, pathname);
    }
  };

  // Public method to set theme
  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);

    // Only immediately apply if not on a special page
    const pathname = window.location.pathname.toLowerCase();
    const lightThemeRoutes = [
      "/",
      "/login",
      "/scheduleappointment",
      "/landingpage"
    ];
    const isLightThemePage = lightThemeRoutes.some(
      (route) => pathname === route.toLowerCase()
    );

    if (!isLightThemePage) {
      applyTheme(newTheme);
    }

    console.log("ThemeProvider: Theme set to", newTheme);
  };

  // Handle logout event - preserve loader theme
  const handleLogout = () => {
    localStorage.setItem(loaderStorageKey, loaderTheme);
    console.log(
      "ThemeProvider: Preserved loader theme during logout:",
      loaderTheme
    );
  };

  // Function to explicitly set loader theme
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
    const handleNavigation = () => {
      const currentPathname = window.location.pathname;

      // Only reapply theme if we've actually changed pages
      if (currentPathname !== prevPathname) {
        console.log(
          `Navigation detected: ${prevPathname} -> ${currentPathname}`
        );
        setPrevPathname(currentPathname);

        // Always apply the theme on navigation
        // The applyTheme function will handle special pages internally
        applyTheme(theme);
      }
    };

    // Listen for navigation events
    window.addEventListener("popstate", handleNavigation);

    // Check for navigation on each render (for programmatic navigation)
    handleNavigation();

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [prevPathname, theme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = (event) => {
      if (event.detail.type === "logout") {
        handleLogout();
      }
    };

    window.addEventListener("authStateChange", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChange", handleAuthChange);
  }, [loaderTheme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
        loaderTheme,
        setLoaderTheme,
        handleLogout
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
