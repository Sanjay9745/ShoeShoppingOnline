import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // Render a filled star
      stars.push(<span key={i} className="star filled">&#9733;</span>);
    } else {
      // Render an empty star
      stars.push(<span key={i} className="star empty" >&#9734;</span>);
    }
  }
  
  return <div>{stars}</div>;
};

export default StarRating;
