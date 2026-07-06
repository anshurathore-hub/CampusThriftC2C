import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);

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

        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
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
