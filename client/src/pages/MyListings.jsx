import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/listings/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setListings(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAsSold = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/listings/${id}/sold`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Listing marked as sold!");

        setListings(
          listings.map((listing) =>
            listing._id === id ? { ...listing, sold: true } : listing,
          ),
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const deleteListing = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Listing deleted successfully");

        setListings(listings.filter((listing) => listing._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Listings</h1>

      {listings.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded-xl p-5 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{listing.title}</h2>

                {listing.sold ? (
                  <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    🔴 SOLD
                  </span>
                ) : (
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    🟢 AVAILABLE
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-green-600">
                  ₹{listing.price}
                </p>

                <p className="text-sm text-gray-500">{listing.category}</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  to={`/listing/${listing._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  👁 View
                </Link>

                {!listing.sold && (
                  <Link
                    to={`/listing/${listing._id}/edit`}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    ✏ Edit
                  </Link>
                )}

                <button
                  onClick={() => deleteListing(listing._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  🗑 Delete
                </button>

                {!listing.sold && (
                  <button
                    onClick={() => markAsSold(listing._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    ✅ Mark as Sold
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
