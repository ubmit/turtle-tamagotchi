import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

const ThemeProviderContext = createContext<string | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());

  useEffect(() => {
    // HTML element
    const root = window.document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    root.classList.add(systemTheme);

    function handleChange(event: MediaQueryListEvent) {
      const currentTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;
      root.classList.remove(THEMES.LIGHT, THEMES.DARK);
      root.classList.add(currentTheme);
      setSystemTheme(currentTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [systemTheme]);

  return (
    <ThemeProviderContext.Provider value={systemTheme}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
