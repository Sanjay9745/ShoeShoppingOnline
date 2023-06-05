import React, { useEffect, useState } from "react";
import "../../style/orders.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

function AdminSingleOrder() {
  const [orders, setOrders] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [drop, setDrop] = useState(false);
  const [deliveryNumber, setDeliveryNumber] = useState(20);
  const [selectedOption, setSelectedOption] = useState("ordered");

  const navigate = useNavigate();
  const { userId, orderId } = useParams();

  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .get("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            axios
              .get("/api/admin/order/" + userId, { headers })
              .then((res) => {
                if (res.status === 200) {
                  let filteredOrder = res.data.find(
                    (order) => order._id === orderId
                  );
                  setOrders(filteredOrder);
                  console.log(filteredOrder);
                }
              })
              .catch(() => {
                console.log("error 2");
              });
          }
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [navigate, orderId, userId]);

  const handleOptionChange = (orderId) => {
    let token = localStorage.getItem("adminToken");
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    axios
      .post(
        "/api/admin/order",
        {
          id: userId,
          orderId: orderId,
          status: selectedOption,
          deliveryNumber: deliveryNumber,
        },
        { headers }
      )
      .then((res) => {
        const updatedOrders = { ...orders };
        updatedOrders.status = selectedOption;
        updatedOrders.deliveryNumber = deliveryNumber;
        setOrders(updatedOrders);
        console.log(res.data);
      });
  };

  const toggleDropdown = (orderId) => {
    setSelectedOrderId(orderId);
    setDrop((prev) => !prev);
  };

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
          </tr>
        </thead>
        <tbody>
          {orders.items &&
            orders.items.map((item, index) => {
              // Create a new date by adding 5 days to the ordered date
              const deliveryDate = new Date(orders.orderDate);
              deliveryDate.setDate(
                deliveryDate.getDate() + orders.deliveryNumber
              );

              // Format the dates with the desired format
              const orderedDateFormatted = new Date(
                orders.orderDate
              ).toLocaleDateString("en-GB");
              const deliveryDateFormatted = deliveryDate.toLocaleDateString(
                "en-GB"
              );

              return (
                <tr key={`${index}-${item.productId}`}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>Recipient Name:</strong> {orders.recipientName}
                    <br />
                    <strong>Street Address:</strong> {orders.streetAddress}
                    <br />
                    <strong>City:</strong> {orders.city}
                    <br />
                    <strong>State:</strong> {orders.state}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>
                    <p onClick={() => toggleDropdown(orders._id)}>
                      {orders.status}
                      <FiEdit2 />
                    </p>
                    {drop && selectedOrderId === orders._id && (
                      <>
                        <p>
                          Delivered on:{" "}
                          <input
                            type="number"
                            className="delivery"
                            value={deliveryNumber}
                            onChange={(e) => {
                              setDeliveryNumber(e.target.value);
                              handleOptionChange(orders._id);
                            }}
                          />
                        </p>
                        <p>Select the Status:</p>
                        <select
                          className="selection-dropdown"
                          value={selectedOption}
                          onChange={(e) => {
                            setSelectedOption(e.target.value);
                            handleOptionChange(orders._id);
                          }}
                        >
                          <option value="ordered">Ordered</option>
                          <option value="shipped">Shipped</option>
                          <option value="out-for-delivery">
                            Out for Delivery
                          </option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </>
                    )}
                  </td>
                  <td>{orderedDateFormatted}</td>
                  <td>{deliveryDateFormatted}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminSingleOrder;
