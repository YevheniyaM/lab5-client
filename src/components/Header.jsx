import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="mx-0 sm:mx-auto sm:max-w-8xl px-4 sm:px-6 lg:px-8 w-full font-jomhuria">
      <div className="flex justify-between items-center pt-4 pb-1 px-4 sm:px-6 lg:px-8 border-b border-white">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl">
          <Link to="/">My Travel</Link>
        </h1>
        <nav>
          <ul className="flex flex-wrap items-center gap-4 sm:gap-8 lg:gap-12 text-xl sm:text-2xl md:text-4xl">
            <li className="hover:text-[#b7c6d0] transition-colors duration-300 ease-in-out">
              <Link to="/publications">Articles</Link>
            </li>
            {user ? (
              <>
                <li className="hover:text-[#b7c6d0] transition-colors duration-300 ease-in-out">
                  <Link to="/profile">My Publications</Link>
                </li>
                <li className="hover:text-[#b7c6d0] transition-colors duration-300 ease-in-out">
                  <Link to="/likes">Likes</Link>
                </li>
                <li className="hover:text-[#b7c6d0] transition-colors duration-300 ease-in-out">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="hover:text-[#b7c6d0] transition-colors duration-300 ease-in-out">
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;