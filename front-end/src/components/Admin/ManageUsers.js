/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import "../../style/carts.css";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
function ManageUsers() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("adminToken"),
  };

  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            console.log("admin login success");
          } else {
            navigate("/");
          }
        })
        .catch(() => {
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    axios.get("/api/admin/users",{headers})
      .then((res) => {
        setData(res.data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteConfirmation = (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to Delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleRemove(id),
        },
        {
          label: "No",
          onClick: () => console.log("delete canceled"),
        },
      ],
    });
  };


  function handleRemove(id) {
    axios.delete(`/api/admin/user/${id}`, { headers })
      .then((res) => {
        console.log("user deleted");
        // Update the user list by removing the deleted user
        setData(data.filter(user => user._id !== id));
      
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="container order">
        <h1>Manage Products</h1>
        <div className="products-page">
          <Scrollbar>
            <div className="products-items order">
              {data.map((user) => (
                <div key={user._id}>
                  <div className="small-product order">
                    <p>Name:{user.name}</p>
                    <p>Email:{user.email}</p>
                    <div className="btn order" onClick={() => navigate(`/admin/single-user-order/${user._id}`)}>view Orders</div>
                    <div className="item-icon order" onClick={() => handleDeleteConfirmation(user._id)}>
                      <MdDelete />
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
