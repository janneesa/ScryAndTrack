import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="items-center border-b border-border bg-background px-6 py-4">
      <div className="max-w-5xl flex justify-between items-center mx-auto">
        <h1 className="text-xl font-semibold text-foreground">
          <Link to="/">Scry&Track</Link>
        </h1>
        <ul className="flex gap-4 text-sm text-foreground">
          {user ? (
            <>
              <li>
                <Link to="/" className="transition hover:text-muted">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-muted">
                  Games
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer transition hover:text-muted"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="transition hover:text-muted">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="transition hover:text-muted">
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
