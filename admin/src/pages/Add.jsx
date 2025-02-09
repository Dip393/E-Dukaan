import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import {toast} from 'react-toastify'

const AddProductForm = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup memory from object URLs
  useEffect(() => {
    return () => {
      images.forEach((image) => image && URL.revokeObjectURL(image));
    };
  }, [images]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSizeToggle = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data.success){
        toast.success(response.data.message)
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
        setImages([null, null, null, null]);
        }else{
          toast.error(response.data.message)
        }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Upload Images */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <label key={index} className="cursor-pointer" htmlFor={`image${index}`}>
              <img
                className="w-20"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt={`Upload Preview ${index + 1}`}
              />
              <input
                type="file"
                id={`image${index}`}
                hidden
                onChange={(e) => handleImageChange(e, index)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Enter product name"
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write product description"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub-Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2"
            type="number"
            placeholder="Enter price"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Available Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes(size) ? "bg-gray-400" : "bg-gray-200"
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-28 py-3 mt-4 text-white ${
          isSubmitting ? "bg-gray-500" : "bg-black"
        } active:bg-gray-700`}
      >
        {isSubmitting ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
