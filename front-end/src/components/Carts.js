/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import "../style/carts.css";
import CartItem from "../components/CartItem";
import { Scrollbar } from "react-scrollbars-custom";
import {  useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

function Carts() {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart);
  const [user, setUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
useLayoutEffect(()=>{
  if(cartItems.length===0){
    navigate("/products")
   }
},[cartItems])
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
            setIsLoading(false)
          }
        })
        .catch(() => {
          setUser(false);
          setIsLoading(false)
          localStorage.removeItem("token");
        });
    }else{
      setIsLoading(false)
    }
  }, []);

  const totalPrice = parseFloat(cartItems.reduce((a, b) => a + b.quantity * b.price, 0));

  function orderNow() {
    
    if (user) {
      if (totalPrice!== 0) {
        navigate("/make-order");
      } else {
        navigate("/products");
      }
    } else {
      navigate("/register");
    }
  }
  if (isLoading) {
    return <><Loading/></>; // Render a loading message or spinner while isLoading is true
  }
  return (
    <>
      <div className="container cart">
        <h1>Cart Summary</h1>
        <div className="carts">
          <Scrollbar>
            <div className="cart-items">
              {cartItems.map((item,index) => {
                return (
                  <CartItem
                    key={index}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    img={item.img}
                    quantity={item.quantity}
                  />
                );
              })}
            </div>
          </Scrollbar>
        </div>
        <h1 className="cart-total">
          Total : {Math.floor(totalPrice * 1000) / 1000}
        </h1>
        <button className="btn processed" onClick={orderNow}>
          Processed to Checkout
        </button>
      </div>
    </>
  );
}

export default Carts;
