import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart, reduceQuantity, removeFromCart } from "../redux/cartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function CartItem({ id, name, img, price, quantity }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios("/api/products")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const dispatch = useDispatch();
  const items = data.filter((item) => item._id === id);
  const stock = items[0]?.stock;

  const handleRemoveItem = () => {
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .post("/api/remove-cart", { id: id }, { headers })
        .then((res) => {
          if (res.status === 200) {
            dispatch(removeFromCart(id));
          } else {
            dispatch(removeFromCart(id));
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(removeFromCart(id));
        });
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleAddToCart = () => {
    const item = { id, name, price, img };
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .post("/api/add-cart", item, { headers })
        .then((res) => {
          if (res.status === 200) {
            dispatch(addToCart(item));
          } else {
            dispatch(addToCart(item));
          }
        })
        .catch(() => {
          dispatch(addToCart(item));
        });
    } else {
      dispatch(addToCart(item));
    }
  };

  const handleReduceQuantity = () => {
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .post("/api/reduce-cart", { id: id }, { headers })
        .then((res) => {
          if (res.status === 200) {
            dispatch(reduceQuantity(id));
          } else {
            dispatch(reduceQuantity(id));
          }
        })
        .catch(() => {
          dispatch(reduceQuantity(id));
        });
    } else {
      dispatch(reduceQuantity(id));
    }
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    ); // Render a loading message or spinner while isLoading is true
  }

  return (
    <>
      <div className="item">
        <img src={img} alt="product" onClick={() => navigate("/buy/" + id)} />
        <p className="product-name">{name}</p>
        <h3>{price}</h3>
        <span
          style={
            quantity < stock
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
          onClick={handleAddToCart}
        >
          +
        </span>
        <p>{quantity}</p>
        <span
          style={
            quantity <= 0 ? { visibility: "hidden" } : { visibility: "visible" }
          }
          onClick={handleReduceQuantity}
        >
          -
        </span>
        <div className="item-icon" onClick={handleRemoveItem}>
          <MdDelete />
        </div>
      </div>
      <hr />
    </>
  );
}

export default CartItem;
