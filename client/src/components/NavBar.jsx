import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="items-center primary-background py-4 px-6 text-white border-b border-gray-800">
      <div className="max-w-5xl flex justify-between items-center mx-auto">
        <h1 className="text-xl font-bold">Scry&Track</h1>
        <ul className="flex gap-4">
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
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
