import React, { useState } from "react";
import "../style/buy-page.css";
import axios from "axios";

const RatingCard = ({ productId ,setState}) => {
  const [rating, setRating] = useState(null);

  const handleRatingChange = (event) => {
    const selectedRating = parseInt(event.target.value);
    setRating(selectedRating);
  };

  function handleClick(value) {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .get("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            axios
              .post(
                "/api/set-rating",
                { productId: productId, rating: value },
                { headers }
              )
              .then((response) => {
                if (response.status === 200) {
                    console.log("rated");
                    setState(false)
                }
              })
              .catch((error) => {
                console.error("Error while setting rating.MAy be Already rated");
              });
          }
        })
        .catch((error) => {
          console.error("Error while accessing protected API:", error);
        });
    }
  }

  return (
    <div className="rating-card">
      <h2>Rate the Product</h2>
      <div className="rating-container">
        {[5, 4, 3, 2, 1].map((value) => (
          <React.Fragment key={value}>
            <input
              type="radio"
              id={`star${value}`}
              name="rating"
              value={value}
              checked={rating === value}
              onClick={() => handleClick(value)}
              onChange={handleRatingChange}
            />
            <label htmlFor={`star${value}`}></label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RatingCard;
