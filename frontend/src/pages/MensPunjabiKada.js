import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MensPunjabiKada.css";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MensPunjabiKada = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart(); 
  const [sortOption, setSortOption] = useState("");
  const [kadaData, setKadaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const fetchKadas = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/products/category/menskada");
        setKadaData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching kada data:", err);
        setError("Failed to load kadas. Please try again later.");
        setLoading(false);
      }
    };
    fetchKadas();
  }, []);

  const sortedKadas = [...kadaData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div>Loading kadas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="kada-page">
      {/* Title Section */}
      <div className="kada-title-container">
        <h1 className="kada-title">Men's Punjabi Kada</h1>
      </div>

      {/* Sort and Results Count */}
      <div className="results-header">
        <div className="results-count">{kadaData.length} Results</div>
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
        {sortedKadas.map((menskada) => (
          <div className="kada-card">
          <Link to={`/product/${menskada.id}`} key={menskada.id} className="product-link">
            <div className="kada-image-container">
              <img 
                src={menskada.images[0] || "https://via.placeholder.com/300"} 
                alt={menskada.name}
                className="kada-image"
              />
            </div>
            </Link>
            <div className="kada-rating">
              {menskada.rating || 4.8} ★ {menskada.reviews || 144}
            </div>
            <Link to={`/product/${menskada.id}`} className="product-link">
            <h3 className="kada-name">{menskada.name}</h3>
            </Link>
            <div className="kada-price">
              ₹{menskada.price.toLocaleString()}
            </div>
            <button className="kada-button" onClick={() => {
                const productToAdd = {
                  id: menskada.id,
                  name: menskada.name,
                  price: menskada.price,
                  image: menskada.images[0],
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
export default MensPunjabiKada;