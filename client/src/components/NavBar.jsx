import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="items-center bg-black py-4 px-6 mb-6 text-white border-b border-zinc-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1>
            <Link to="/">Scry&Track</Link>
          </h1>
          <ul className="flex gap-medium">
            {user ? (
              <>
                <li>
                  <Link to="/" className="link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="link">
                    Games
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="link cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="link">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
