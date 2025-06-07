import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ToeRings.css";
import toeBanner from '../components/categoryBanner/toeBanner1 (2).jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ToeRings = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); // Get cartCount from context
  const [sortOption, setSortOption] = useState("");
  const [toeRingsData, setToeRingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchToeRings = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/toerings");
        setToeRingsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching toe rings data:", err);
        setError("Failed to load toe rings. Please try again later.");
        setLoading(false);
      }
    };
    fetchToeRings();
  }, []);

  const sortedToeRings = [...toeRingsData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading toe rings...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="toe-rings-page">
      {/* Banner Image */}
      <div className="banner-container">
        <img src={toeBanner} alt="Toe Rings Banner" className="banner-image" />
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{toeRingsData.length} Results</div>
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
      <div className="toe-rings-grid">
        {sortedToeRings.map((toering) => (
          <div key={toering.id} className="toe-ring-card">
            <Link to={`/product/${toering.id}`} className="product-link">
              <div className="toe-ring-image-container">
                <img
                  src={toering.images[0] || "https://via.placeholder.com/300"}
                  alt={toering.name}
                  className="toe-ring-image"
                />
              </div>
            </Link>

            <div className="toe-ring-rating">
              {toering.rating || 4.8} ★ {toering.reviews || 144}
            </div>

            <Link to={`/product/${toering.id}`} className="product-link">
              <h3 className="toe-ring-name">{toering.name}</h3>
            </Link>

            <div className="toe-ring-price">
              ₹{toering.price.toLocaleString()}
            </div>

            <button
              className="toe-ring-button"
              onClick={() => {
                const productToAdd = {
                  id: toering.id,
                  name: toering.name,
                  price: toering.price,
                  image: toering.images[0],
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

export default ToeRings;