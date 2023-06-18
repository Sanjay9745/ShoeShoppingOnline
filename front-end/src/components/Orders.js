import React, { useEffect, useLayoutEffect, useState } from "react";
import "../style/orders.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "./Loading";
import { RiDeleteBin6Line } from "react-icons/ri";
function Orders() {
  const [orders, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  useLayoutEffect(() => {
    if (!token) {
      navigate("/register");
    }
  });
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };
    axios
      .get("/api/user/orders", { headers })
      .then((res) => {
        if (res.status === 200) {
          
          if (res.data.length === 0) {
            navigate("/products");
          }
          setIsLoading(false);
          setOrder(res.data);
        }
      })
      .catch(() => {
        console.log("error 2");
        localStorage.removeItem("token");
        navigate("/register");
      });
  }, [navigate, token]);

  function handleDeleteConfirmation(id) {
    confirmAlert({
      title: "Confirm Order Cancel",
      message: "Are you sure you want to Cancel the Order?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleCancel(id),
        },
        {
          label: "No",
          onClick: () => console.log("Account deletion canceled"),
        },
      ],
    });
  }

  function handleCancel(id) {

    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .delete("/api/order-cancel/" + id, { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/products");
          }
        })
        .catch((error) => {
          console.error("Error canceling order:", error);
          navigate("/products");
        });
    }
  }
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    ); // Render a loading message or spinner while isLoading is true
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Shipping Address</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Ordered On</th>
            <th>Delivery Day</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) =>
            order.items.map((item) => {
              // Create a new date by adding 5 days to the ordered date
              const deliveryDate = new Date(order.orderDate);
              deliveryDate.setDate(
                deliveryDate.getDate() + order.deliveryNumber
              );

              // Format the dates with the desired format
              const orderedDateFormatted = new Date(
                order.orderDate
              ).toLocaleDateString("en-GB");
              const deliveryDateFormatted =
                deliveryDate.toLocaleDateString("en-GB");

              return (
                <tr key={`${index}-${item.productId}`}>
                  <td>{index}</td>
                  <td>
                    <strong>Recipient Name:</strong> {order.recipientName}
                    <br />
                    <strong>Street Address:</strong> {order.streetAddress}
                    <br />
                    <strong>City:</strong> {order.city}
                    <br />
                    <strong>State:</strong> {order.state}
                    <br />
                    <strong>Country:</strong> {order.country}
                    <br />
                    {order.apartmentNumber !== "" && (
                      <>
                        <strong>ApartmentNumber:</strong>{" "}
                        {order.apartmentNumber}
                      </>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td className={order.status === "delivered" && "delivered"}>
                    {order.status}
                  </td>

                  <td>{orderedDateFormatted}</td>
                  <td>{deliveryDateFormatted}</td>
                  <td>
                    {order.status === "delivered" ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteConfirmation(order._id)}
                      >
                        <RiDeleteBin6Line />
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteConfirmation(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
