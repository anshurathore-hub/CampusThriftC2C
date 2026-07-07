import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      submitData.append("title", formData.title);
      submitData.append("price", formData.price);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("condition", formData.condition);
      submitData.append("sellerPhone", formData.sellerPhone);

      if (image) {
        submitData.append("image", image);
      }

      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Listing created successfully!");
        console.log(data);

        setFormData({
          title: "",
          price: "",
          description: "",
          category: "",
          condition: "",
          imageUrl: "",
          sellerPhone: "",
        });

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
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Sell an Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
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
          className="w-full p-4 border rounded-lg"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          type="submit"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
