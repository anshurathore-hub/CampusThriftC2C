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
    campus: "Amity Noida Sec-125",
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateDescription = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      alert("Please enter Title, Category and Condition first.");
      return;
    }

    try {
      setLoadingAI(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            condition: formData.condition,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          ...formData,
          description: data.description,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("AI Error");
    } finally {
      setLoadingAI(false);
    }
  };

  const suggestPrice = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      alert("Please enter Title, Category and Condition first.");
      return;
    }

    try {
      setLoadingPrice(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/suggest-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            condition: formData.condition,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPriceSuggestion(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("AI Error");
    } finally {
      setLoadingPrice(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    try {
      setAnalyzingImage(true);

      const formDataImage = new FormData();
      formDataImage.append("image", image);

      const response = await fetch(
        "http://localhost:5000/api/ai/analyze-image",
        {
          method: "POST",
          body: formDataImage,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          category: data.category,
          condition: data.condition,
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Image analysis failed.");
    } finally {
      setAnalyzingImage(false);
    }
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
      submitData.append("campus", formData.campus);
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

        <button
          type="button"
          onClick={suggestPrice}
          disabled={loadingPrice}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loadingPrice ? "🤖 Thinking..." : "💰 Suggest Price"}
        </button>

        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Description</label>

          <button
            type="button"
            onClick={generateDescription}
            disabled={loadingAI}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loadingAI
              ? "Generating..."
              : formData.description
                ? "🔄 Generate Again"
                : "✨ Generate with AI"}
          </button>
        </div>

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

        <div>
          <label className="block mb-2 font-medium">Campus</label>

          <select
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option>Amity Noida Sec-125</option>
            <option disabled>More campuses coming soon...</option>
          </select>
        </div>

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
          type="button"
          onClick={analyzeImage}
          disabled={analyzingImage}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {analyzingImage ? "🤖 Analyzing..." : "🤖 Analyze Image"}
        </button>

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
