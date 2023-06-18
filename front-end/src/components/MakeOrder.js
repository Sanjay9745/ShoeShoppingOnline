import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import "../style/carts.css";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItems } from "../redux/cartSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";

function MakeOrder() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    let token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };
    if (!token) {
      navigate("/");
    } else {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            axios("/api/user/is-verified", { headers })
              .then((res) => {
                if (res.status === 200) {
                  axios
                    .get("/api/all-shipping", { headers })
                    .then((res) => {
                      if (res.status === 200) {
                        if (res.data.length === 0) {
                          navigate("/add-shipping");
                        }
                        setData(res.data);
                        setIsLoading(false);
                      }
                    })
                    .catch(() => navigate("/account"));
                } else {
                  localStorage.setItem("redirectPath", location.pathname);
                  navigate("/account");
                }
              })
              .catch(() => {
                localStorage.setItem("redirectPath", location.pathname);
                navigate("/account");
              });
          } else {
            localStorage.removeItem("token");
            navigate("/register");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/register");
        });
    }
  }, [location.pathname, navigate]);

  const handleOrderConfirmation = (address) => {
    confirmAlert({
      title: "Confirm Order",
      message: "Are you sure you want to place this order?",
      buttons: [
        {
          label: "Yes",
          onClick: () => orderNow(address),
        },
        {
          label: "No",
          onClick: () => console.log("Order canceled"),
        },
      ],
    });
  };

  const orderNow = ({
    _id,
    recipientName,
    streetAddress,
    phoneNumber,
    city,
    state,
    postalCode,
    country,
    apartmentNumber,
  }) => {
    if (cartItems.length !== 0) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post(
          "/api/order-now",
          {
            shippingId: _id,
            recipientName,
            streetAddress,
            phoneNumber,
            city,
            state,
            postalCode,
            country,
            apartmentNumber,
          },
          { headers }
        )
        .then((res) => {
          if (res.status === 200) {
            navigate("/orders");
            localStorage.removeItem("cart");
            dispatch(removeAllItems());
          }
        });
    } else {
      navigate("/products");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="container">
        <div className="shipping-address order">
          <h1>Select One Shipping Address</h1>
          <div>
            <button className="btn" onClick={() => navigate("/add-shipping")}>
              Add Shipping Address
            </button>
          </div>
        </div>
        <div className="products-page order">
          <Scrollbar>
            <div className="products-items order">
              {data.map((address) => (
                <div key={address._id}>
                  <div className="small-product order">
                    <p>Name: {address.recipientName}</p>
                    <p>Address: {address.streetAddress}</p>
                    <p>Phone: {address.phoneNumber}</p>
                    <button
                      className="btn order"
                      onClick={() => handleOrderConfirmation(address)}
                    >
                      Order Now
                    </button>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MakeOrder;
