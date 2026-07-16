import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Fake Listing");
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/listings/${id}`,
        );

        const data = await response.json();

        setListing(data);
        const token = localStorage.getItem("token");

        if (token) {
          const favResponse = await fetch(
            "http://localhost:5000/api/favorites",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const favorites = await favResponse.json();

          setIsFavorite(favorites.some((item) => item._id === data._id));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (isFavorite) {
        await fetch(`http://localhost:5000/api/favorites/${listing._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsFavorite(false);
      } else {
        await fetch(`http://localhost:5000/api/favorites/${listing._id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
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
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const submitReport = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing._id,
          reason: reportReason,
          message: reportMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report submitted successfully.");

        setShowReportModal(false);

        setReportMessage("");

        setReportReason("Fake Listing");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="relative">
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-700 text-xl" />
            )}
          </button>

          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>

        <p className="text-3xl text-green-600 font-bold mb-4">
          ₹{listing.price}
        </p>

        <p className="text-lg text-gray-700 mb-6">{listing.description}</p>

        <div className="space-y-2 text-gray-600">
          <p>
            <strong>Category:</strong> {listing.category}
          </p>

          <p>
            <strong>Condition:</strong> {listing.condition}
          </p>

          <p className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              📍 {listing.campus}
            </span>
          </p>

          <p>
            <strong>Posted:</strong>{" "}
            {new Date(listing.createdAt).toLocaleDateString()}
          </p>
        </div>

        <a
          href={`https://wa.me/91${listing.sellerPhone}?text=Hi, is your ${listing.title} still available?`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Contact Seller
        </a>

        <button
          onClick={() => setShowReportModal(true)}
          className="block mt-4 text-red-600 hover:underline"
        >
          🚩 Report Listing
        </button>
      </div>
      
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-5">Report Listing</h2>

            <label className="font-medium">Reason</label>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2 mb-4"
            >
              <option>Fake Listing</option>
              <option>Scam / Fraud</option>
              <option>Inappropriate Content</option>
              <option>Item Already Sold</option>
              <option>Wrong Images</option>
              <option>Other</option>
            </select>

            <label className="font-medium">Additional Details (Optional)</label>

            <textarea
              rows="4"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Tell us more..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={submitReport}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;
