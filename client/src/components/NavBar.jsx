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
        <h1 className="text-xl font-bold">Scry&Track</h1>
        <ul className="flex gap-4">
          {user ? (
            <>
              <li>
                <Link to="/" className="hover:text-gray-800">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-800">
                  Games
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-800 cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-800">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-gray-800">
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
