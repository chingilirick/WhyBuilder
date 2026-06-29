export const themeColors = {
  dark: {
    bg: "var(--color-dark-bg)",
    surface: "var(--color-dark-surface)",
  },
  light: {
    bg: "var(--bg-body)",
    card: "var(--bg-card)",
  },
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
};

export function getThemeClass(theme: "dark" | "light" = "light"): string {
  return theme === "dark" ? "dark" : "";
}
