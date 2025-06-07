import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SilverJewellery.css";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SilverJewellery = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); // Get cartCount from context
  const [sortOption, setSortOption] = useState("");
  const [jewelleryData, setJewelleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchJewellery = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/babykada");
        setJewelleryData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jewellery data:", err);
        setError("Failed to load silver jewellery. Please try again later.");
        setLoading(false);
      }
    };
    fetchJewellery();
  }, []);

  const sortedJewellery = [...jewelleryData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div className="loading">Loading silver jewellery...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="kada-page">
      {/* Title Section */}
      <div className="kada-title-container">
        <h1 className="kada-title">Baby Kada Collection</h1>
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{jewelleryData.length} Results</div>
        <div className="sort-container">
          <label htmlFor="sort" className="sort-label">Sort by:</label>
          <select
            id="sort"
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="kada-grid">
        {sortedJewellery.map((babykada) => (
          <div className="kada-card">
            <Link to={`/product/${babykada.id}`} key={babykada.id} className="product-link">
            <div className="kada-image-container">
              <img 
                src={babykada.images[0] || "https://via.placeholder.com/300"} 
                alt={babykada.name}
                className="kada-image"
              />
            </div>
            </Link>
            <div className="kada-rating">
              {babykada.rating || 4.8} ★ {babykada.reviews || 144}
            </div>
            <Link to={`/product/${babykada.id}`} className="product-link">
            <h3 className="kada-name">{babykada.name}</h3>
            </Link>
            <div className="kada-price">
              ₹{babykada.price.toLocaleString()}
            </div>
            <button className="kada-button" onClick={() => {
                const productToAdd = {
                  id: babykada.id,
                  name: babykada.name,
                  price: babykada.price,
                  image: babykada.images[0],
                };
                addToCart(productToAdd);
                setAddedProduct(productToAdd);
                setShowModal(true);
              }}>Add to Cart</button>
          </div>
        ))}
      </div>
      {/* Modal Popup */}
      {showModal && addedProduct && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <p>✓ Item added to your cart</p>
            <div className="cart-modal-content">
              <img src={addedProduct.image} alt={addedProduct.name} />
              <div>
                <p>{addedProduct.name}</p>
                <strong>₹{addedProduct.price.toLocaleString()}</strong>
              </div>
            </div>
            <button className="view-cart-button" onClick={() => navigate("/cart")}>
              View cart ({cartCount})
            </button>
            <button className="checkout-button" onClick={() => navigate("/cart")}>
              Checkout securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SilverJewellery;