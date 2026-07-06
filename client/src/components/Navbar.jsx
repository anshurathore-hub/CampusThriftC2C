import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">CampusThrift</h2>
        <Link
          to="/sell"
          className="bg-slate-900 text-white px-5 py-3 rounded-lg"
        >
          Sell an item
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
