import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const removeFavorite = async (listingId) => {
    try {
      await API.delete(`/favorites/${listingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFavorites((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove favorite.");
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await API.get("/favorites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFavorites(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <FaHeart className="text-red-500" />
          My Wishlist
        </h1>

        {favorites.length === 0 ? (
          <p>You haven't saved any items yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((listing) => (
              <Link key={listing._id} to={`/listing/${listing._id}`}>
                <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold">{listing.title}</h2>

                    <p
                      className={`text-2xl font-bold mt-2 ${
                        listing.sold
                          ? "text-gray-500 line-through"
                          : "text-green-600"
                      }`}
                    >
                      ₹{listing.price}
                    </p>

                    {listing.sold && (
                      <span className="inline-block mt-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        SOLD
                      </span>
                    )}

                    <p className="text-gray-600 mt-2">{listing.category}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(listing._id);
                      }}
                      className="mt-5 w-full rounded-lg border border-red-500 px-4 py-2 text-red-600 transition hover:bg-red-50"
                    >
                      <>
                        <FaHeart className="inline mr-2" />
                        Remove from Wishlist
                      </>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
