import React from 'react';
import './Banner.css'; // Assuming you will style the component
import banner from './images/pendant_banner.jpg';
const Banner = () => {
  return (
    <div className="banner-container">
      <img
        src={banner}// Use your actual banner image URL
        alt="Promotional Banner"
        width="100vm"
        height="300"
        sizes="100vw" // The image will take 100% of the viewport width
        className="banner-image"
      />
    </div>
  );
};

export default Banner;
