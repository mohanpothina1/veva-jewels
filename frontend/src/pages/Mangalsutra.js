import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Mangalsutra.css";
import mangalsutraBanner from '../components/categoryBanner/mangalsutra.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Mangalsutra = () => {
    const navigate = useNavigate();
    const { addToCart, cartCount } = useCart();
  const [sortOption, setSortOption] = useState("");
  const [mangalsutrasData, setMangalsutrasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchMangalsutras = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/mangalsutra");
        setMangalsutrasData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching mangalsutras data:", err);
        setError("Failed to load mangalsutras. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchMangalsutras();
  }, []);

  const sortedMangalsutras = [...mangalsutrasData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading mangalsutras...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="mangalsutra-page">
      {/* Banner Image */}
      <div className="banner-container">
        <img src={mangalsutraBanner} alt="Mangalsutras Banner" className="banner-image" />
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{mangalsutrasData.length} Results</div>
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
      <div className="mangalsutras-grid">
        {sortedMangalsutras.map((mangalsutra) => (
            <div className="mangalsutra-card">
          <Link to={`/product/${mangalsutra.id}`} key={mangalsutra.id} className="product-link">
              <div className="mangalsutra-image-container">
                <img 
                  src={mangalsutra.images[0] || "https://via.placeholder.com/300"} 
                  alt={mangalsutra.name}
                  className="mangalsutra-image"
                />
              </div>
              </Link>
              <div className="mangalsutra-rating">
                {mangalsutra.rating || 4.8} ★ {mangalsutra.reviews || 144}
              </div>
              <Link to={`/product/${mangalsutra.id}`} className="product-link">
              <h3 className="mangalsutra-name">{mangalsutra.name}</h3>
              </Link>
              <div className="mangalsutra-price">
                ₹{mangalsutra.price.toLocaleString()}
              </div>
              <button className="mangalsutra-button" 
              
              onClick={() => {
                const productToAdd = {
                  id: mangalsutra.id,
                  name: mangalsutra.name,
                  price: mangalsutra.price,
                  image: mangalsutra.images[0],
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

export default Mangalsutra;