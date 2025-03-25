import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="items-center primary-background py-4 px-6 text-white border-b border-gray-800">
      <div className="max-w-5xl flex justify-between items-center mx-auto">
        <h1 className="text-xl font-bold">
          <Link to="/">Scry&Track</Link>
        </h1>
        <ul className="flex gap-4">
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
                <button onClick={handleLogout} className="link cursor-pointer">
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
    </nav>
  );
};

export default NavBar;
