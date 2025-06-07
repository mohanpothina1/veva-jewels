import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "slick-carousel/slick/slick-theme.css";
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await axios.delete(`http://localhost:8086/api/wishlist/${product.id}`);
      } else {
        await axios.post(`http://localhost:8086/api/wishlist`, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:8086/api/products/${id}`);
        setProduct(productResponse.data);
        
        if (productResponse.data.images?.length > 0) {
          setMainImage(productResponse.data.images[0]);
        }

        const wishlistResponse = await axios.get(`http://localhost:8086/api/wishlist/check/${id}`);
        setIsWishlisted(wishlistResponse.data.isWishlisted);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/products`);
        const filtered = response.data.filter(p => p.id !== id);
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setRecommendedProducts(shuffled.slice(0, 8));
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      }
    };

    fetchProductData();
    fetchRecommendedProducts();
  }, [id]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <p className="loading-text">Loading product details...</p>;
  if (!product) return <p className="loading-text">Product not found.</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Image Section */}
        <div className="product-image-section">
          <div className="main-image-container">
            <img src={mainImage} alt={product.name} className="main-product-image" />
            <button 
              className={`wishlist-button ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className="wishlist-icon"
              >
                <path
                  fill={isWishlisted ? "#E9718B" : "none"}
                  stroke="#E9718B"
                  strokeWidth="1.5"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>
          <div className="thumbnail-list">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`thumbnail ${img === mainImage ? 'selected' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="product-info-section">
          <div className="price-section">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            <span className="mrp">
              <span className="line-through">MRP ₹{(product.price + 1200).toLocaleString()}</span>
              <span className="incl-taxes">Incl. of all taxes</span>
            </span>
          </div>

          <h2 className="product-name">{product.name}</h2>
          <h2 className="silver-tagline">
            Made With Pure <span>925 Silver</span>
          </h2>

          <div className="rating-section">
            <span>⭐ 4.3</span> <span className="reviews-count">(3 reviews)</span>
          </div>

          <div id="promise_tag" className="promise_tags silver_tags">
            <div className="product__policies">
              <img src="//www.giva.co/cdn/shop/t/160/assets/30-days-return.png" alt="Easy 30 Day Return" height="30" width="40" />
              <div className="tag">Easy 30 Day Return</div>
            </div>
            <div className="product__policies">
              <img src="//www.giva.co/cdn/shop/t/160/assets/warranty.png" alt="6-Month Warranty" height="30" width="40" />
              <div className="tag">6-Month Warranty</div>
            </div>
            <div className="product__policies">
              <img src="//www.giva.co/cdn/shop/t/160/assets/925.png" alt="Fine 925 Silver" height="30" width="40" />
              <div className="tag">Fine 925 Silver</div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="buy-now-btn" onClick={() => navigate("/payment")}>Buy Now</button>
            <button className="add-to-cart-btn" onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
              });
              navigate('/cart');
            }}>Add To Cart</button>
          </div>

          <div className="accordions-custom">
            <div className="accordion" onClick={() => toggleAccordion(0)}>
              <div className="accordion__header">
                <h3 className="accordion__title">Product Description</h3>
                <span className={`accordion__icon ${openIndex === 0 ? 'rotate' : ''}`}>&#9662;</span>
              </div>
              {openIndex === 0 && (
                <div className="accordion__content">
                  <p><strong>The Design:</strong><br />
                    {product.description}
                  </p>
                  <ul>
                    {product.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="accordion" onClick={() => toggleAccordion(1)}>
              <div className="accordion__header">
                <h3 className="accordion__title">Shipping Details</h3>
                <span className={`accordion__icon ${openIndex === 1 ? 'rotate' : ''}`}>&#9662;</span>
              </div>
              {openIndex === 1 && (
                <div className="accordion__content">
                  <ul>
                    <li>Free express shipping</li>
                    <li>No questions asked 30 days return policy</li>
                    <li>6 month warranty</li>
                    <li>Shipping internationally to 20+ countries</li>
                    <li>
                      Brand: Indiejewel Fashions Pvt Ltd<br />
                      3rd Floor, Magnum Vista, Bangalore, Karnataka - 560062
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="you-may-also-like-section">
        <h3 className="section-title">You May Also Like</h3>
        <div className="recommended-products-grid">
          {recommendedProducts.map(item => (
            <div key={item.id} className="recommended-product-card">
              <div className="product-badge">5.0 ⭐</div>
              <div className="product-image-container" onClick={() => navigate(`/products/${item.id}`)}>
                <img src={item.images[0]} alt={item.name} className="recommended-product-image"/>
              </div>
              <div className="product-price">₹{item.price.toLocaleString()}</div>
              <h4 className="recommended-product-name">{item.name}</h4>
              <button className="add-to-cart-btn" >Add To Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;