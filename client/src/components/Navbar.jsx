import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaHeart, FaUser, FaPlus, FaClipboardList } from "react-icons/fa";
function Navbar() {
  const storedUser = localStorage.getItem("user");

  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition"
          >
            CampusThrift
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-slate-100 px-4 py-3 font-semibold hover:bg-slate-200"
                >
                  <FaUser className="inline mr-2" />
                  {user.username}
                </Link>

                <Link
                  to="/sell"
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg whitespace-nowrap"
                >
                  <>
                    <FaPlus className="inline mr-2" />
                    Sell an Item
                  </>
                </Link>

                <Link
                  to="/my-listings"
                  className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <>
                    <FaClipboardList className="inline mr-2" />
                    My Listings
                  </>
                </Link>

                <Link
                  to="/favorites"
                  className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <>
                    <FaHeart className="inline mr-2 text-red-500" />
                    Wishlist
                  </>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-slate-900 text-white px-5 py-3 rounded-lg"
                >
                  Login
                </Link>

                <Link to="/register" className="border px-5 py-3 rounded-lg">
                  Register
                </Link>
              </>
            )}
          </div>
          {menuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-slate-100 px-4 py-3 font-semibold hover:bg-slate-200"
                  >
                    <FaUser className="inline mr-2" />
                    {user.username}
                  </Link>

                  <Link
                    to="/sell"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-slate-900 text-white px-4 py-3 rounded-lg text-center"
                  >
                    <>
                      <FaPlus className="inline mr-2" />
                      Sell an Item
                    </>
                  </Link>

                  <Link
                    to="/my-listings"
                    onClick={() => setMenuOpen(false)}
                    className="block border px-4 py-3 rounded-lg text-center hover:bg-gray-100"
                  >
                    <>
                      <FaClipboardList className="inline mr-2" />
                      My Listings
                    </>
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className="block border px-4 py-3 rounded-lg text-center hover:bg-gray-100"
                  >
                    <>
                      <FaHeart className="inline mr-2 text-red-500" />
                      Wishlist
                    </>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-slate-900 text-white px-4 py-3 rounded-lg text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block border px-4 py-3 rounded-lg text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
