import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch products.");
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
        console.log(`Deleting product with ID: ${id}`);
        const response = await axios.delete(`${backendUrl}/api/product/remove/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Delete response:", response.data);
        toast.success("Product deleted successfully!");
        setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
        console.error(
            "Error deleting product:",
            error.response ? error.response.data : error.message
        );
        toast.error(
            `Failed to delete product. ${
                error.response ? error.response.data.message : error.message
            }`
        );
    }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-6">Product List</h1>
      {isLoading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Images</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    {product.image && product.image.length > 0 ? (
                      product.image.slice(0, 4).map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl || "https://via.placeholder.com/100"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      <img
                        src="https://via.placeholder.com/100"
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2">₹{product.price}</td>
                <td className="border border-gray-300 px-4 py-2">
                
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default List;
