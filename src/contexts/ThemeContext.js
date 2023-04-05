import { createContext } from "react";

export const themes = {
  light: "white-content",
  dark: "",
};

export const ThemeContext = createContext({
  themes: themes.light,
  changeTheme: () => {},
});
