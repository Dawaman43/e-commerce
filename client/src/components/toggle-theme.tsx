import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

function ToggleTheme() {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      onClick={handleThemeChange}
      className="transition-transform duration-300"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

export default ToggleTheme;
