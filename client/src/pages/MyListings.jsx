import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/listings/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        My Listings
      </h1>

      {listings.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-xl p-5 shadow"
            >
              <h2 className="text-2xl font-semibold">
                {listing.title}
              </h2>

              <p className="text-green-600 font-bold">
                ₹{listing.price}
              </p>

              <div className="flex gap-4 mt-4">
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-blue-600"
                >
                  View
                </Link>

                <Link
                  to={`/edit/${listing._id}`}
                  className="text-yellow-600"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;