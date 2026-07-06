import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/listings/${id}`,
        );

        const data = await response.json();

        setListing(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return <div className="p-8 text-center">Loading...</div>;
  }

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow p-6">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

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
        <Link
          to={`/listing/${listing._id}/edit`}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg ml-4 mr-4 inline-block"
        >
          Edit Listing
        </Link>
        <button
          onClick={handleDelete}
          className=" bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Delete Listing
        </button>
      </div>
    </div>
  );
}

export default ListingDetails;
