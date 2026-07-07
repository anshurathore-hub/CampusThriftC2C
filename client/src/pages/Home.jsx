import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await API.get("/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">CampusThrift Listings</h1>
        <div className="flex flex-wrap gap-3 mb-8">
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
              className={`px-5 py-2 rounded-full border transition

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

        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <div className="grid gap-4">
            {listings
              .filter((listing) => {
                if (selectedCategory === "All") {
                  return true;
                }

                return listing.category === selectedCategory;
              })
              .map((listing) => (
                <Link to={`/listing/${listing._id}`} key={listing._id}>
                  <div
                    key={listing._id}
                    className="rounded-lg bg-white p-6 shadow"
                  >
                    {listing.imageUrl && (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-2xl font-bold">{listing.title}</h2>

                    <p className="text-green-600 font-semibold">
                      ₹{listing.price}
                    </p>

                    <p>{listing.description}</p>

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
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
