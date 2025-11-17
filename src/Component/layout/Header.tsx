import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/RishtaHub__1.png";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Show success toast
      toast.success("Logged out successfully!");

      // Small delay to show the toast before navigating
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Error logging out:", err);

      // Show error toast
      toast.error("Failed to log out. Please try again.");
    }
  };

  const menuItems = [
    // { name: "Home", path: "/" },
    { name: "Browse Profiles", path: "/" },
    { name: "My Profile", path: "/my-profile" },
    { name: "Add Profile", path: "/add-profile" },
    { name: "Payment", path: "/payment" },
    { name: "Contact", path: "/contact-us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#d86c6c]  text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="RishtaHub"
            className="w-10 h-10 object-contain" // logo size control
          />
          <span className="text-white">RishtaHub</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `hover:text-yellow-300 ${
                  isActive ? "text-yellow-300 font-semibold" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded-md ml-4"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-500 p-4 space-y-4 text-center">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="block text-lg hover:text-yellow-300"
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
