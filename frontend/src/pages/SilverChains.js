import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SilverChains.css";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SilverChains = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); // Get cartCount from context
  const [sortOption, setSortOption] = useState("");
  const [chainsData, setChainsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/chains");
        setChainsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chains data:", err);
        setError("Failed to load silver chains. Please try again later.");
        setLoading(false);
      }
    };
    fetchChains();
  }, []);

  const sortedChains = [...chainsData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading silver chains...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="kada-page">
      {/* Title Section */}
      <div className="kada-title-container">
        <h1 className="kada-title">Silver Chains</h1>
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{chainsData.length} Results</div>
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
        {sortedChains.map((chains) => (
          <div className="kada-card">
          <Link to={`/product/${chains.id}`} key={chains.id} className="product-link">
            <div className="kada-image-container">
              <img 
                src={chains.images[0] || "https://via.placeholder.com/300"} 
                alt={chains.name}
                className="kada-image"
              />
            </div>
            </Link>
            <div className="kada-rating">
              {chains.rating || 4.8} ★ {chains.reviews || 144}
            </div>
            <Link to={`/product/${chains.id}`} className="product-link">
            <h3 className="kada-name">{chains.name}</h3>
            </Link>
            <div className="kada-price">
              ₹{chains.price.toLocaleString()}
            </div>
            <button className="kada-button" onClick={() => {
                const productToAdd = {
                  id: chains.id,
                  name: chains.name,
                  price: chains.price,
                  image: chains.images[0],
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
export default SilverChains;