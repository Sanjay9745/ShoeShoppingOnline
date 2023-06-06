import React, { useEffect, useState } from 'react'
import "../style/orders.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Orders() {
  const [orders,setOrder] = useState([])

const navigate = useNavigate()
  useEffect(() => {
   
    let token = localStorage.getItem("token");
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };
      axios
        .get("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            axios
              .get("/api/user/orders", { headers })
              .then((res) => {
                if (res.status === 200) {
                  console.log(res.data);
                  if(res.data.length===0){
                    navigate("/products")
                  }
                  setOrder(res.data);
                }
              })
              .catch(() => {
                console.log("error 2");
                navigate("/products")
              });
          }else{
            navigate("/products")
          }
        })
        .catch(() => {
          console.log("error");
          navigate("/products")
        });
    }else{
      navigate("/products")
    }
  }, [navigate]);

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
    let token = localStorage.getItem("token");
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
        });
    }
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

  {
  orders.map((order, index) => (
    order.items.map((item) => {
      // Create a new date by adding 5 days to the ordered date
      const deliveryDate = new Date(order.orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + order.deliveryNumber);
    
      // Format the dates with the desired format
      const orderedDateFormatted = new Date(order.orderDate).toLocaleDateString('en-GB');
      const deliveryDateFormatted = deliveryDate.toLocaleDateString('en-GB');

      return (
        <tr key={`${index}-${item.productId}`}>
          <td>{index}</td>
          <td>
            <strong>Recipient Name:</strong> {order.recipientName}<br />
            <strong>Street Address:</strong> {order.streetAddress}<br />
            <strong>City:</strong> {order.city}<br />
            <strong>State:</strong> {order.state}<br />
            <strong>Country:</strong> {order.country}<br />
           {order.apartmentNumber!==""&& <><strong>ApartmentNumber:</strong> {order.apartmentNumber}</>}
          </td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.price}</td>
          <td>{order.status}</td>
          <td>{orderedDateFormatted}</td>
          <td>{deliveryDateFormatted}</td>
          <td><button className='btn' onClick={()=>handleDeleteConfirmation(order._id)}>Cancel</button></td>
        </tr>
      );
    })
  ))
}

   
  </tbody>
</table>

    </div>
  )
}

export default Orders
