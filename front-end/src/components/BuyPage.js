import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "./StarRating";
import "../style/buy-page.css";
import RatingCard from "./RatingCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
function BuyPage() {
  const [item, setItem] = useState(null);
  const [user,setUser] = useState(false)
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch(() => {
        toast.error("Server Error");
        navigate("/products")
      });
  }, [id, navigate]);
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
                        setIsLoading(false)
                      })
                      .catch((error) => {
                        console.log("Error while checking rating:", error);
                      });
                  }
                }else{
                  toast.warning("No orders found")
                  navigate("/products")
                }
              })
              .catch((error) => {
                console.log("Error while fetching user orders:", error);
              });
          }else{
            setUser(false)
          }
        })
        .catch((error) => {
          console.log("Error while accessing protected API:", error);
        });
    }
  }, [id, navigate, state]);

  if (isLoading) {
    return <><Loading/></>; // Render a loading message or spinner while isLoading is true
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
          dispatch(addToCart(item));
          navigate("/carts")
        })
        .catch((error) => {
          console.log(error);
          dispatch(addToCart(item));
        });
      }else{
      dispatch(addToCart(item));
      navigate("/login")
    }
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
      <ToastContainer/>
    </div>
  );
}

export default BuyPage;
