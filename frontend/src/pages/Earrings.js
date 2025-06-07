import React, { useState } from "react";
// import Navbar from "../components/Navbar";?
// import Footer from "../components/Footer"; // Assuming Footer component exists
import "./Earrings.css";

const Earrings = () => {
  const [sortOption, setSortOption] = useState("");

  const earringsData = [
    { id: 1, name: "Diamond Stud Earrings", price: 120, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Rose Gold Hoop Earrings", price: 90, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Pearl Drop Earrings", price: 75, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Silver Twist Earrings", price: 50, image: "https://via.placeholder.com/150" },
  ];

  const sortedEarrings = [...earringsData].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Banner Image */}
      <div className="banner-container">
        <img
          src="https://via.placeholder.com/1200x300"
          alt="Jewelry Banner"
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

      {/* Earrings Section */}
      <div className="earrings-container">
        <h1 className="earrings-title">Girl's Jewellery - Earrings</h1>
        <div className="earrings-grid">
          {sortedEarrings.map((earring) => (
            <div key={earring.id} className="earring-card">
              <img
                src={earring.image}
                alt={earring.name}
                className="earring-image"
              />
              <h3 className="earring-name">{earring.name}</h3>
              <p className="earring-price">${earring.price}</p>
              <button className="earring-button">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Earrings;
