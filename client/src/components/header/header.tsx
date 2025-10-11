import { Link } from "react-router-dom";
import ToggleTheme from "../toggle-theme";
import NavBar from "./navBar";
import SearchBar from "./searchBar";
import UserAvatar from "./userAvatar";

function Header() {
  return (
    <div className="flex text-center justify-between items-center">
      <Link to="/">
        <div className="text-2xl font-semibolds flex flex-col">
          <span className="text-3xl font-extrabold">Gebeya</span>

          <span>Go</span>
        </div>
      </Link>
      <NavBar />
      <SearchBar />
      <div className="flex items-center gap-x-4">
        <UserAvatar />
        <ToggleTheme />
      </div>
    </div>
  );
}

export default Header;
