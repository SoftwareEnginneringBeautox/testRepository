import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // Initialize theme from localStorage
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  // This is the core function to apply a theme
  const applyTheme = (themeValue) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Apply the appropriate theme
    if (themeValue === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = systemPrefersDark ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeValue);
    }
  };

  // Public method to set theme
  const setTheme = (newTheme) => {
    // Update localStorage
    localStorage.setItem(storageKey, newTheme);
    
    // Update state
    setThemeState(newTheme);
    
    // Apply immediately
    applyTheme(newTheme);
    
    console.log("ThemeProvider: Theme set to", newTheme);
    console.log("ThemeProvider: localStorage updated to", localStorage.getItem(storageKey));
  };

  // Apply theme when component mounts and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
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