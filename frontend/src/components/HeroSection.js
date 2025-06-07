import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSection.css"; // Custom CSS for styling the slider

const HeroSection = () => {
  const sliderImages = [
    {
      id: 1,
      src: require("./bannerImages/Banner1.jpg"),
      alt: "Lab Diamond Studded Gold Jewellery",
    },
    {
      id: 2,
      src: require("./bannerImages/Banner2.jpg"),
      alt: "Silver Jewellery Sale",
    },
    // {
    //   id: 3,
    //   src: require("./bannerImages/Banner3.jpg"),
    //   alt: "Diamond Collection",
    // },
    // {
    //   id: 4,
    //   // src: require("./bannerImages/festive_collection.jpg"),
    //   alt: "Festive Collection",
    // },
  ];

  const settings = {
    dots: true, // Enable navigation dots
    infinite: true, // Infinite looping
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 1700, // Speed of autoplay in ms
    arrows: false, // Disable navigation arrows
  };

  return (
    <div className="hero-section">
      <Slider {...settings}>
        {sliderImages.map((image) => (
          <div key={image.id} className="slide">
            <img src={image.src} alt={image.alt} className="slide-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
