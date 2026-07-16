import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    campus: user?.campus || "Amity Noida Sec-125",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    if (formData.bio.length > 200) {
      alert("Bio cannot exceed 200 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      alert(
        "Username must be 3–20 characters and can contain only letters, numbers and underscores.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Profile updated successfully!");

        navigate("/profile");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-2">Username</label>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">WhatsApp Number</label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Campus</label>

            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Amity Noida Sec-125</option>
              <option disabled>More campuses coming soon...</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Bio</label>

            <textarea
              rows="4"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell other students about yourself..."
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
