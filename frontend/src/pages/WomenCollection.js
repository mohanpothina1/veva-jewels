import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './WomenCollection.css';

const WomenCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8086/api/products/category/anklets');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching women's products:", err);
        setError("Failed to load women's collection. Please try again later.");
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, []);

  if (loading) return <div className="loading">Loading women's collection...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="women-collection">
      <div className="collection-header">
        <h1>Women's Collection</h1>
        <p>Elegant jewelry designed for her</p>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.images?.[0] || "https://via.placeholder.com/300"} 
                alt={product.name}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="price">₹{product.price.toLocaleString()}</div>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WomenCollection;