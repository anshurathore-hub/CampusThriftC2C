import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Home() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.get("/listings");
        setListings(response.data);

        const token = localStorage.getItem("token");

        if (token) {
          const favResponse = await API.get("/favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setFavorites(favResponse.data.map((item) => item._id));
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  const toggleFavorite = async (listingId) => {
    if (!localStorage.getItem("token")) {
      const shouldLogin = window.confirm(
        "You need to login to save items to your wishlist.\n\nGo to Login page?",
      );

      if (shouldLogin) {
        navigate("/login");
      }

      return;
    }
    try {
      const isFavorite = favorites.includes(listingId);

      if (isFavorite) {
        await API.delete(`/favorites/${listingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFavorites(favorites.filter((id) => id !== listingId));
      } else {
        await API.post(
          `/favorites/${listingId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setFavorites([...favorites, listingId]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">CampusThrift Listings</h1>
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search calculators, books, tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-12 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
          {[
            "All",
            "Electronics",
            "Books",
            "Stationery",
            "Tickets",
            "Clothes",
            "Sports",
            "Others",
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-5 py-2 rounded-full border transition

      ${
        selectedCategory === category
          ? "bg-slate-900 text-white"
          : "bg-white hover:bg-gray-100"
      }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <label className="mr-3 font-medium">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...listings]
              .filter((listing) => {
                const matchesCategory =
                  selectedCategory === "All" ||
                  listing.category === selectedCategory;

                const matchesSearch =
                  listing.title.toLowerCase().includes(search.toLowerCase()) ||
                  listing.description
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  listing.category.toLowerCase().includes(search.toLowerCase());

                return matchesCategory && matchesSearch;
              })
              .sort((a, b) => {
                if (sortBy === "Newest") {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (sortBy === "Oldest") {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                }
                if (sortBy === "Price: Low to High") {
                  return a.price - b.price;
                }
                if (sortBy === "Price: High to Low") {
                  return b.price - a.price;
                }
                return 0;
              })
              .map((listing) => (
                <Link to={`/listing/${listing._id}`} key={listing._id}>
                  <div
                    key={listing._id}
                    className="mx-auto w-full max-w-sm rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(listing._id);
                        }}
                        className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-110 hover:bg-white"
                      >
                        {favorites.includes(listing._id) ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FaRegHeart className="text-gray-700 text-xl" />
                        )}
                      </button>
                      {listing.imageUrl && (
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-full h-52 object-cover rounded-t-2xl"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-2xl font-semibold line-clamp-1">
                        {listing.title}
                      </h2>

                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ₹{listing.price}
                      </p>

                      <p className="text-sm mt-2 line-clamp-2">
                        {listing.description}
                      </p>

                      <p className="text-sm text-gray-500">
                        Category: {listing.category}
                      </p>

                      <p className="text-sm text-gray-500">
                        Condition: {listing.condition}
                      </p>
                      <a
                        href={`https://wa.me/${listing.sellerPhone}?text=Hi, I am interested in your ${listing.title} listed on CampusThrift for ₹${listing.price}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Contact Seller
                      </a>
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

export default Home;
