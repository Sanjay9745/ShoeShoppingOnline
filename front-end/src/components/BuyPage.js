import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "./StarRating";
import "../style/buy-page.css";
import RatingCard from "./RatingCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function BuyPage() {
  const [item, setItem] = useState(null);
  const [user,setUser] = useState(false)
  const [state, setState] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [id]);
  useEffect(() => {
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
            setUser(true)
            axios
              .get("/api/user/orders", { headers })
              .then((ordersRes) => {
                if (ordersRes.status === 200) {
                  const orderedProduct = ordersRes.data.find((order) => {
                    return order.items.some((item) => item.productId === id);
                  });
                  if (orderedProduct) {
                    axios
                      .get("/api/already-rated/" + id, { headers })
                      .then((ratingRes) => {
                        setState(ratingRes.data);
                        console.log(state);
                      })
                      .catch((error) => {
                        console.log("Error while checking rating:", error);
                      });
                  }
                }
              })
              .catch((error) => {
                console.log("Error while fetching user orders:", error);
              });
          }
        })
        .catch((error) => {
          console.log("Error while accessing protected API:", error);
        });
    }
  }, [id, state]);

  if (!item) {
    return <div>Loading...</div>;
  }
  const handleAddToCart = ({name, price, img }) => {
    const item = { id, name, price, img };
    if (user) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post("/api/add-cart", item, { headers })
        .then((res) => {
          navigate("/carts")
        })
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch(addToCart(item));
  };

  return (
    <div className="container">
      <h1>{item.name}</h1>
      <div className="buy-img">
        <img src={item.img} alt="" />
        <img src={item.img2} alt="" />
        <img src={item.img3} alt="" />
      </div>
      <h3>{item.price}</h3>
      <p>{item.desc}</p>
      <div className="product-rating">
        <StarRating rating={item.rating} />
        <p>{item.numberOfReviews} Reviews</p>
      </div>
      <button className="buy-btn" onClick={()=> handleAddToCart(item)}>
        Buy Now
      </button>
      {state && <RatingCard productId={id} />}
    </div>
  );
}

export default BuyPage;
