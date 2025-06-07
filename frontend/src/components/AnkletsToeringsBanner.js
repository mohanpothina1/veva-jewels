import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnkletsToeringsBanner.css';

const AnkletsToeringsBanner = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate('/newarrivals');
  };

  return (
    <div className="anklets-banner">
      <div className="banner-image-container">
        <img 
          src="https://www.truesilver.co.in/cdn/shop/articles/Banner_Image_-_Reasons_Why_Silver_Jewellery_Is_A_Worthwhile_Investment.jpg?v=1695630545" 
          alt="Anklets and Toerings Collection"
          className="banner-image"
        />
        <div className="banner-overlay">
          <div className="banner-content">
            <h2 className="banner-title">Anklets & Toerings</h2>
            <p className="banner-subtitle">Discover our exquisite collection of handcrafted jewelry</p>
            <button className="shop-now-button" onClick={handleShopNowClick}>
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnkletsToeringsBanner;
