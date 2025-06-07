import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Anklets.css";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Anklets = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); 
  const [sortOption, setSortOption] = useState("");
  const [ankletsData, setAnkletsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  

  useEffect(() => {
    const fetchAnklets = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/anklets");
        setAnkletsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching anklets data:", err);
        setError("Failed to load anklets. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchAnklets();
  }, []);

  const sortedAnklets = [...ankletsData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading anklets...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="anklets-page">
    
      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{ankletsData.length} Results</div>
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
      <div className="anklets-grid">
        {sortedAnklets.map((anklet) => (
  <div className="anklet-card">
                <Link to={`/product/${anklet.id}`} key={anklet.id} className="product-link">
    <div className="anklet-image-container">
      <img 
        src={anklet.images[0] || "https://via.placeholder.com/300"} 
        alt={anklet.name}
        className="anklet-image"
      />
    </div>
    </Link>
    <div className="anklet-rating">
      {anklet.rating || 4.8} ★ {anklet.reviews || 144}
    </div>

    <Link to={`/product/${anklet.id}`} className="anklet-link">
    <h3 className="anklet-name">{anklet.name}</h3>
    </Link>
    
    <div className="anklet-price">
      ₹{anklet.price.toLocaleString()}
    </div>
    <button
      className="anklet-button"
       onClick={() => {
                const productToAdd = {
                  id: anklet.id,
                  name: anklet.name,
                  price: anklet.price,
                  image: anklet.images[0],
                };
                addToCart(productToAdd);
                setAddedProduct(productToAdd);
                setShowModal(true);
              }}
    >
      Add to Cart
    </button>
  </div>

        ))}
        
      </div>
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

export default Anklets;