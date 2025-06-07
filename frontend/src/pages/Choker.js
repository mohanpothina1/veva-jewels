import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Choker.css";
import chokerBanner from '../components/categoryBanner/choker.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Choker = () => {
  const navigate = useNavigate();
    const { addToCart, cartCount } = useCart();
  const [sortOption, setSortOption] = useState("");
  const [chokersData, setChokersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [showModal, setShowModal] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);
  

  useEffect(() => {
    const fetchChokers = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/choker");
        setChokersData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chokers data:", err);
        setError("Failed to load chokers. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchChokers();
  }, []);

  const sortedChokers = [...chokersData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading chokers...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="choker-page">
      {/* Banner Image */}
      <div className="banner-container">
        <img src={chokerBanner} alt="Chokers Banner" className="banner-image" />
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{chokersData.length} Results</div>
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
      <div className="chokers-grid">
        {sortedChokers.map((choker) => (
            <div className="choker-card">
          <Link to={`/product/${choker.id}`} key={choker.id} className="product-link">
              <div className="choker-image-container">
                <img 
                  src={choker.images[0] || "https://via.placeholder.com/300"} 
                  alt={choker.name}
                  className="choker-image"
                />
              </div>
              </Link>
              <div className="choker-rating">
                {choker.rating || 4.8} ★ {choker.reviews || 144}
              </div>
          <Link to={`/product/${choker.id}`} className="choker-link">
              <h3 className="choker-name">{choker.name}</h3>
              </Link>
              <div className="choker-price">
                ₹{choker.price.toLocaleString()}
              </div>
              <button className="choker-button" 
              onClick={() => {
                const productToAdd = {
                  id: choker.id,
                  name: choker.name,
                  price: choker.price,
                  image: choker.images[0],
                };
                addToCart(productToAdd);
                setAddedProduct(productToAdd);
                setShowModal(true);
              }}
              
              >Add to Cart</button>
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

export default Choker;