import React, { useEffect, useState } from "react";
import "../../style/orders.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewUserOrders() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

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
              .get("/api/admin/users", { headers })
              .then((res) => {
                if (res.status === 200) {
                  const filteredData = res.data.map((user) => ({
                    ...user,
                    orders: user.orders.filter((order) => order.status !== "delivered"),
                  }));
                  setData(filteredData);
                  
                console.log(filteredData);
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
  }, [navigate]);

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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) =>
            user.orders.map((order, index) =>
              order.items.map((item, itemIndex) => {
                // Create a new date by adding the delivery number to the ordered date
                const deliveryDate = new Date(order.orderDate);
                deliveryDate.setDate(
                  deliveryDate.getDate() + parseInt(order.deliveryNumber)
                );

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
                    <td>{item.status}</td>
                    <td>{orderedDateFormatted}</td>
                    <td>{deliveryDateFormatted}</td>
                    <td><button className="btn" onClick={()=>navigate("/admin/one-order/"+user._id+"/"+order._id)}>Edit</button></td>
                    
                  </tr>
                );
              })
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUserOrders;
