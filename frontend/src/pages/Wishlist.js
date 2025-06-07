import React, { useState } from "react";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: "Silver Earrings", price: 150, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Gold Pendant", price: 800, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Diamond Ring", price: 1200, image: "https://via.placeholder.com/150" },
  ]);

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (id) => {
    alert("Moved to Cart!");
    handleRemoveFromWishlist(id);
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img src={item.image} alt={item.name} className="wishlist-image" />
              <div className="wishlist-details">
                <h2 className="wishlist-item-name">{item.name}</h2>
                <p className="wishlist-item-price">${item.price}</p>
                <div className="wishlist-buttons">
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                  <button
                    className="wishlist-cart-btn"
                    onClick={() => handleMoveToCart(item.id)}
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
