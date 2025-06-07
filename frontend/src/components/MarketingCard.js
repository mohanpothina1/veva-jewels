import React from "react";
import "./MarketingCard.css";
import card from './marketingImages/card1.jpg'
import coins from './marketingImages/card2.jpg';

const MarketingCard = () => {
  return (
    <div className="marketing-card">
      <h2 className="marketing-heading">Veva Jewels Essentials</h2>
      <div className="marketing-content">
        <div className="card">
          <a href="/silver-jewellery">
            <img
              src={card}
              alt="Silver Jewellery"
              className="card-image"
            />
          </a>
          <p className="card-title">Silver Jewellery</p>
        </div>
        <div className="card">
          <a href="/coins">
            <img
              src={coins}
              alt="Silver & Gold Coins"
              className="card-image"
            />
          </a>
          <p className="card-title">Silver Coins</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingCard;
