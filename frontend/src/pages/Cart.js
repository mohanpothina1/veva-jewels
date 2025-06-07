import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();
  const [randomProducts, setRandomProducts] = useState([]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge = 0;
  const giftWrapCharge = 50;
  const orderTotal = totalAmount + deliveryCharge + giftWrapCharge;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8086/api/products");
        const data = await response.json();

        const filtered = data.filter(p => !cartItems.find(c => c.id === p.id));
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [cartItems]);

  return (
    <div className="cart-page" style={{ marginTop: "120px" }}>
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        // Empty Cart Section
        <div className="empty-cart-container">
  <img
    className="empty-cart-image"
    src="https://www.giva.co/cdn/shop/t/162/assets/empty-cart.jpg?v=2867468997513044031748262164"
    alt="Empty Cart"
  />
  <h3 className="empty-cart-heading">Your cart is empty.</h3>
  <h3 className="empty-cart-subtext">Let's fill it up with some amazing jewellery!</h3>
  
  <a href="/collections/bestsellers" className="explore-now-btn">
  Explore Now
</a>

</div>

      ) : (
        // Cart Items + Order Summary + Don't Miss Out
        <>
          <div className="cart-content">
            <div className="cart-left">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <button
                    className="remove-btn-x"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>

                    <div className="price-quantity-container">
                      <div className="price-section">
                        <span className="current-price">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="mrp">
                          <span className="line-through">
                            ₹{(item.price + 1200).toLocaleString()}
                          </span>
                        </span>
                      </div>

                      <div className="quantity-controls">
                        <button
                          className="quantity-btn minus-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn plus-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="delivery-info">Free Delivery</p>

                    <div className="warranty-section">
                      <p>6-Month Warranty</p>
                      <p>30-Day Easy Returns</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-right">
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span className="free-delivery">FREE</span>
                </div>

                <div className="summary-row">
                  <span>Gift Wrap</span>
                  <span>₹50</span>
                </div>

                <div className="summary-total">
                  <span>Order Total</span>
                  <span>₹{orderTotal.toLocaleString()}</span>
                </div>

                <button className="checkout-btn">PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>

          {/* Don't Miss Out Section */}
          {randomProducts.length > 0 && (
            <div className="you-may-also-like-section">
              <h3 className="section-title">Don't Miss Out</h3>
              <div className="recommended-products-grid">
                {randomProducts.map(product => (
                  <div key={product.id} className="recommended-product-card">
                    <div className="product-badge">5.0 ⭐</div>
                    <div
                      className="product-image-container"
                      onClick={() =>
                        (window.location.href = `/products/${product.id}`)
                      }
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="recommended-product-image"
                      />
                    </div>
                    <div className="product-price">
                      ₹{product.price.toLocaleString()}
                    </div>
                    <h4 className="recommended-product-name">
                      {product.name}
                    </h4>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
