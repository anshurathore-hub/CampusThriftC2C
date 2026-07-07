import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  const storedUser = localStorage.getItem("user");

  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-800">CampusThrift</h2>
        <div className="flex items-center gap-4 flex-wrap">
          {user ? (
            <>
              <Link to="/profile" className="font-semibold hover:text-blue-600">
                {user.username}
              </Link>

              <Link
                to="/sell"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg whitespace-nowrap"
              >
                Sell an item
              </Link>

              <Link
                to="/my-listings"
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                My Listings
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
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
      </div>
    </nav>
  );
}

export default Navbar;
