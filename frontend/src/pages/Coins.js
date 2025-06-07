import React, { useState } from "react";
import "./Coins.css";

const Coins = () => {
  const [sortOption, setSortOption] = useState("");

  const coinsData = [
    { id: 1, name: "Gold Plated Coin", price: 100, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Silver Lakshmi Coin", price: 150, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Traditional Coin Set", price: 200, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Antique Pooja Coin", price: 250, image: "https://via.placeholder.com/150" },
  ];

  const sortedCoins = [...coinsData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      {/* Banner Image */}
      <div className="banner-container">
        <img
          src="https://via.placeholder.com/1200x300"
          alt="Coins Banner"
          className="banner-image"
        />
      </div>

      {/* Sort By Dropdown */}
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

      {/* Coins Section */}
      <div className="coins-container">
        <h1 className="coins-title">Pooja Essentials - Coins</h1>
        <div className="coins-grid">
          {sortedCoins.map((coin) => (
            <div key={coin.id} className="coin-card">
              <img
                src={coin.image}
                alt={coin.name}
                className="coin-image"
              />
              <h3 className="coin-name">{coin.name}</h3>
              <p className="coin-price">${coin.price}</p>
              <button className="coin-button">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coins;
