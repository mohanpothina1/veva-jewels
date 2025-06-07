import React, { useState, useEffect } from 'react';
import './RecommendedForYou.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MostGifted = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostGifted = async () => {
      try {
        setLoading(true);
        const endpoints = [
          'http://localhost:8086/api/products/category/toerings',
          'http://localhost:8086/api/products/category/anklets',
          'http://localhost:8086/api/products/category/mangalsutra',
        ];

        const allResponses = await Promise.all(
          endpoints.map(endpoint => fetch(endpoint).then(res => res.json()))
        );

        const allProducts = allResponses.flat();
        const sortedByRating = [...allProducts].sort((a, b) =>
          (b.rating || 0) - (a.rating || 0)
        );

        setProducts(sortedByRating.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching most gifted products:", err);
        setError("Failed to load most gifted items. Please try again later.");
        setLoading(false);
      }
    };

    fetchMostGifted();
  }, []);

  const handleImageClick = (product) => {
    // Use product.id instead of slug or _id to match your ToeRings component
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="recommended-for-you">
      <h2 className="recommended-for-you__heading">Most Gifted</h2>
      <div className="recommended-for-you__grid">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="recommended-for-you__card">
              <div className="card__media" onClick={() => handleImageClick(product)}>
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  loading="lazy"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="card__content">
                <h3 className="card__heading">
                  <a href={`/product/${product.id}`} className="product-link">
                    {product.name}
                  </a>
                </h3>
                <div className="card__badge">
                  ⭐ {product.rating || 4.5} | {product.reviews || 120} reviews
                </div>
                <div className="price">
                  {product.discount ? (
                    <>
                      <span className="price--sale">₹{product.price}</span>
                      <span className="price--original">₹{product.originalPrice}</span>
                    </>
                  ) : (
                    <span className="price--regular">₹{product.price}</span>
                  )}
                </div>
                <button className="add-to-cart" onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  });
                  navigate('/cart');
                }}>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MostGifted;