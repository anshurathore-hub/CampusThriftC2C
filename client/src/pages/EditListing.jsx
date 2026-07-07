import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    sellerPhone: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`http://localhost:5000/api/listings/${id}`);

      const data = await response.json();

      setFormData({
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        condition: data.condition,
        sellerPhone: data.sellerPhone,
      });
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Listing updated successfully");
        navigate(`/listing/${id}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Stationery">Stationery</option>
          <option value="Clothes">Clothes</option>
          <option value="Tickets">Tickets</option>
          <option value="Sports">Sports</option>
          <option value="Others">Others</option>
        </select>

        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Condition</option>
          <option value="Like New">Like New</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>

        <input
          type="text"
          name="sellerPhone"
          placeholder="WhatsApp Number"
          value={formData.sellerPhone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
}

export default EditListing;
