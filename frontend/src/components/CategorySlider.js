import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "./CategorySlider.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, name: "Anklets", image: "anklet.jpg", link: "/womens/anklets" },
  { id: 2, name: "Toe Rings", image: "toerings.jpg", link: "/womens/toerings" },
  { id: 6, name: "Chokers", image: "chokers.jpg", link: "/womens/choker" }, 
  { id: 7, name: "Mangalsutra", image: "mangalsutra.jpg", link: "/womens/mangalsutra" }, 
  { id: 3, name: "Men's Punjabi Kada", image: "kada.jpg", link: "/mens-punjabi-kada" },
  { id: 4, name: "Silver Chains", image: "silverchain.jpg", link: "/silver-chains" },
  { id: 5, name: "Kumkum Box", image: "kumkum.jpg", link: "/kumkum-box" },
];

const CategorySlider = () => {
  const navigate = useNavigate();

  return (
    <div className="category-slider-wrapper">
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <div
              className="category-link"
              onClick={() => navigate(category.link)}
            >
              <div className="category-card">
                <img
                  src={require(`./images/${category.image}`)}
                  alt={category.name}
                  className="category-image"
                />
                <p className="category-name">{category.name}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;