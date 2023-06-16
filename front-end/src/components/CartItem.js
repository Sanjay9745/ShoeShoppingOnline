import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart, reduceQuantity, removeFromCart } from "../redux/cartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CartItem({ id, name, img, price, quantity }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios("/api/products")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const dispatch = useDispatch();
  const items = data.filter((item) => item._id === id);
  const stock = items[0]?.stock;

  const handleRemoveItem = () => {
    if (user) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post("/api/remove-cart", { id: id }, { headers })
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch(removeFromCart(id));
  };

  const handleAddToCart = () => {
    const item = { id, name, price, img };
    if (user) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post("/api/add-cart", item, { headers })
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch(addToCart(item));
  };

  const handleReduceQuantity = () => {
    if (user) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post("/api/reduce-cart", { id: id }, { headers })
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch(reduceQuantity(id));
  };

  return (
    <>
      <div className="item">
        <img src={img} alt="product" onClick={()=>navigate("/buy/"+id)} />
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
