import React, { useEffect, useState } from "react";
import "../../style/orders.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

function AdminSingleOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [drop, setDrop] = useState(false);
  const [deliveryNumber, setDeliveryNumber] = useState(20);
  const [selectedOption, setSelectedOption] = useState("ordered");

  const navigate = useNavigate();
  const { id } = useParams();

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
              .get("/api/admin/order/" + id, { headers })
              .then((res) => {
                if (res.status === 200) {
                  setOrders(res.data);
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
  }, [id, navigate]);

  const handleOptionChange = (orderId) => {
    let token = localStorage.getItem("adminToken");
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    axios
      .post(
        "/api/admin/order",
        { id: id, orderId: orderId, status: selectedOption ,deliveryNumber:deliveryNumber},
        { headers }
      )
      .then((res) => {
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
          {orders.map((order, index) =>
            order.items.map((item, itemIndex) => {
              // Create a new date by adding 5 days to the ordered date
              const deliveryDate = new Date(order.orderDate);
              deliveryDate.setDate(deliveryDate.getDate() + order.deliveryNumber);

              // Format the dates with the desired format
              const orderedDateFormatted = new Date(
                order.orderDate
              ).toLocaleDateString("en-GB");
              const deliveryDateFormatted = deliveryDate.toLocaleDateString(
                "en-GB"
              );

              return (
                <tr key={`${index}-${item.productId}`}>
                  <td>{itemIndex + 1}</td>
                  <td>
                    <strong>Recipient Name:</strong> {order.recipientName}
                    <br />
                    <strong>Street Address:</strong> {order.streetAddress}
                    <br />
                    <strong>City:</strong> {order.city}
                    <br />
                    <strong>State:</strong> {order.state}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>
                    <p onClick={() => toggleDropdown(order._id)}>
                      {order.status}
                      <FiEdit2 />
                    </p>
                    {drop && selectedOrderId === order._id && (
                      <>
                        <p>
                          Delivered on:{" "}
                          <input
                            type="number"
                            className="delivery"
                            value={deliveryNumber}
                            onChange={(e) => {setDeliveryNumber(e.target.value);handleOptionChange(order._id)}}
                          />
                        </p>
                        <p>Select the Status:</p>
                        <select
                          className="selection-dropdown"
                          value={selectedOption}
                          onChange={(e) =>{ setSelectedOption(e.target.value)
                            handleOptionChange(order._id)}
                          }
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminSingleOrder;
