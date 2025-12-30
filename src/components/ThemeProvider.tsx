import { createContext, useEffect, useState, type ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

const THEMES = {
  DARK: "dark",
  LIGHT: "light",
} as const;

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

const ThemeProviderContext = createContext<string>("");

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(systemTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      const currentTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;
      root.classList.remove("light", "dark");
      root.classList.add(currentTheme);
      setSystemTheme(currentTheme);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [systemTheme]);

  return (
    <ThemeProviderContext.Provider value={systemTheme}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
