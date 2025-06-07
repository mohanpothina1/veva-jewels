import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KumkumBox.css";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const KumkumBox = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); // Get cartCount from context
  const [sortOption, setSortOption] = useState("");
  const [kumkumBoxData, setKumkumBoxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchKumkumBoxes = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/kumkum-box");
        setKumkumBoxData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching kumkum boxes data:", err);
        setError("Failed to load kumkum boxes. Please try again later.");
        setLoading(false);
      }
    };
    fetchKumkumBoxes();
  }, []);

  const sortedBoxes = [...kumkumBoxData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading kumkum boxes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="kumkum-page">
      {/* Sort and Results Count - Moved to top */}
      <div className="results-header">
        <h1 className="page-title">Pooja Essentials - Kumkum Boxes</h1>
        <div className="sort-container">
          <div className="results-count">{kumkumBoxData.length} Results</div>
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
      <div className="products-grid">
        {sortedBoxes.map((kumkum) => (
          <div className="product-card">
          <Link to={`/product/${kumkum.id}`}  className="product-link">
            <div className="product-image-container">
              <img 
                src={kumkum.images[0] || "https://via.placeholder.com/300"} 
                alt={kumkum.name}
                className="product-image"
              />
            </div>
            </Link>
            <div className="product-rating">
              {kumkum.rating || 4.8} ★ {kumkum.reviews || 144}
            </div>
            <Link to={`/product/${kumkum.id}`} className="product-link">
            <h3 className="product-name">{kumkum.name}</h3>
            </Link>
            <div className="product-price">
              ₹{kumkum.price.toLocaleString()}
            </div>
            <button className="add-to-cart-btn" onClick={() => {
                const productToAdd = {
                  id: kumkum.id,
                  name: kumkum.name,
                  price: kumkum.price,
                  image: kumkum.images[0],
                };
                addToCart(productToAdd);
                setAddedProduct(productToAdd);
                setShowModal(true);
              }}>Add to Cart</button>
          </div>
        
        ))}
      </div>
    </div>
  );
};

export default KumkumBox;