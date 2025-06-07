import React from 'react';
import './CustomerStories.css';

const CustomerStories = () => {
  const stories = [
    {
      id: '1',
      name: 'Virda',
      comment:
        "A big shout out to you guys for improving my hubby’s gifting tastes. Completely in love with my ring!",
      image: 'https://via.placeholder.com/80', // Replace with your image link
    },
    {
      id: '2',
      name: 'Harshika',
      comment:
        "Never thought buying jewellery would be this easy, thanks for helping make my mom’s birthday special.",
      image: 'https://via.placeholder.com/80', // Replace with your image link
    },
    {
      id: '3',
      name: 'Priya',
      comment:
        "Gifted these earrings to my sister on her wedding and she loved them! I am obsessed with buying gifts from here.",
      image: 'https://via.placeholder.com/80', // Replace with your image link
    },
  ];

  return (
    <div className="customer-stories">
      <h2 className="customer-stories-heading">Customer Stories</h2>
      <div className="customer-stories-container">
        {stories.map((story) => (
          <div key={story.id} className="customer-stories-card">
            <h3 className="customer-stories-name">{story.name}</h3>
            <p className="customer-stories-comment">{story.comment}</p>
            <img
              src={story.image}
              alt={story.name}
              className="customer-stories-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerStories;
