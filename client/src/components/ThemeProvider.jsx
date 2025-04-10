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
  // Get the stored theme, or default to "light"
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  // Function to apply theme on the document element
  const applyTheme = (themeValue) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // If theme is "system", use the system setting
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

  // Set the theme and store in localStorage
  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // On mount and whenever theme changes, apply the correct theme
  useEffect(() => {
    applyTheme(theme);

    // Handle system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
