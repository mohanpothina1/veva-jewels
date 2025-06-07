import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-hero">
        <h1 className="about-us-title">About Us</h1>
        <p className="about-us-subtitle">
          Discover Our Journey, Values, and Passion for Excellence
        </p>
      </div>

      <div className="about-us-content">
        <div className="about-us-section">
          <img
            src="https://via.placeholder.com/500"
            alt="Our Story"
            className="about-us-image"
          />
          <div className="about-us-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2010, we have dedicated ourselves to crafting exquisite
              and timeless pieces of jewelry. Every piece tells a story of
              elegance and craftsmanship. Our journey started with a vision to
              blend tradition with modern designs.
            </p>
          </div>
        </div>

        <div className="about-us-section reverse">
          <div className="about-us-text">
            <h2>Our Values</h2>
            <p>
              Integrity, quality, and innovation form the core of our values.
              We are committed to delivering premium quality products while
              maintaining a sustainable and ethical business approach.
            </p>
          </div>
          <img
            src="https://via.placeholder.com/500"
            alt="Our Values"
            className="about-us-image"
          />
        </div>

        <div className="about-us-section">
          <img
            src="https://via.placeholder.com/500"
            alt="Our Mission"
            className="about-us-image"
          />
          <div className="about-us-text">
            <h2>Our Mission</h2>
            <p>
              To become a global leader in premium jewelry by combining
              exceptional craftsmanship, unique designs, and unparalleled
              customer service. We believe in making every moment special.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
