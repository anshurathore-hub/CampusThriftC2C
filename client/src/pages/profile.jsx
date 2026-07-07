import React from "react";
import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      "Type DELETE to permanently delete your account.",
    );

    if (confirmation !== "DELETE") {
      alert("Account deletion cancelled.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/delete-account",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-4xl font-bold mb-6">My Profile</h1>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-gray-500">Username</p>
            <p className="text-xl font-semibold">{user.username}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-xl">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/my-listings"
            className="bg-slate-900 text-white px-5 py-3 rounded-lg"
          >
            My Listings
          </Link>

          <Link
            to="/edit-profile"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Edit Profile
          </Link>

          <Link
            to="/settings"
            className="bg-gray-700 text-white px-5 py-3 rounded-lg"
          >
            Settings
          </Link>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-5 py-3 rounded-lg"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
