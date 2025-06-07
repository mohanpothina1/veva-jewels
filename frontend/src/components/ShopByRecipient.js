import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByRecipient.css';

const ShopByRecipient = () => {
  return (
    <div className="shop-by-recipient">
      <h2 className="section-title">Shop by Recipient</h2>
      <div className="recipient-cards">
        <Link to="/men-collection" className="recipient-card men-card">
          <div className="card-content">
            <h3>Men's Collection</h3>
            <p>Discover premium jewelry for him</p>
            <button className="shop-now-btn">Shop Now</button>
          </div>
        </Link>
        <Link to="/women-collection" className="recipient-card women-card">
          <div className="card-content">
            <h3>Women's Collection</h3>
            <p>Explore elegant jewelry for her</p>
            <button className="shop-now-btn">Shop Now</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ShopByRecipient;