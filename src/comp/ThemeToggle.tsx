import React from "react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <select
      value={theme}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value);
      }}
      className="rounded-md border border-slate-800 bg-white py-1 text-slate-800 focus:outline-none"
    >
      <option value={"system"}>System</option>
      <option value={"dark"}>Dark</option>
      <option value={"light"}>Light</option>
    </select>
  );
};

export default ThemeToggle;
