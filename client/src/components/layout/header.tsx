import { Link } from "react-router-dom";
import ToggleTheme from "../toggle-theme";

function Header() {
  return (
    <div className="flex text-center justify-between">
      <Link to="/">
        <div className="text-2xl font-semibolds flex flex-col">
          <span className="text-3xl font-extrabold">Gebeya</span>

          <span>Go</span>
        </div>
      </Link>
      <ToggleTheme />
    </div>
  );
}

export default Header;
