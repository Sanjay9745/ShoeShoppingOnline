import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import "../style/carts.css";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function AllShipping() {
  const [data, setData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  };
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/protected', { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true);
          } else {
            setUser(false);
            navigate('/login');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/');
    }
  }, [navigate, headers]);

  useEffect(() => {
    if (user) {
      axios.get('/api/user/is-verified', { headers })
        .then((res) => {
          if (res.status === 401) {
            navigate('/account');
          }
        })
        .catch(() => navigate('/account'));
    }
  }, [headers, navigate, user]);

  useEffect(() => {
    if (user) {
      axios.get('/api/all-shipping', { headers })
        .then((res) => {
          if (res.status === 200) {

            setData(res.data);
           
            if(data.length===0){
              navigate("/add-shipping")
            }
          } else {
            toast.error("Something Went Wrong")
          }
        })
        .catch(() => navigate('/account'));
    }
  }, [data, headers, navigate, user]);
  function handleDeleteConfirmation(id) {
    confirmAlert({
      title: "Confirm Account Deletion",
      message: "Are you sure you want to delete the account?",
      buttons: [
        {
          label: "Yes",
          onClick:  handleRemove(id),
        },
        {
          label: "No",
          onClick: () => console.log("Account deletion canceled"),
        },
      ],
    });
  }

  function handleRemove(id) {
    axios.delete(`/api/remove-shipping/${id}`, { headers })
      .then((res) => {
        if (res.status === 200) {
          // Remove the deleted shipping address from the state
          setData(data.filter((address) => address._id !== id));
        } else {
          toast.error("Something went wrong")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  return (
    <div>
      <div className="container">
        <div className="shipping-address">
          <h1>All Shipping Address</h1>
          <div>
            <button className="btn" onClick={() => navigate("/add-shipping")}>
              Add Shipping Address
            </button>
          </div>
        </div>
        <div className="products-page">
          <Scrollbar>
            <div className="products-items order">
              {data.map((address) => (
                <div key={address._id}>
                  <div className="small-product order">
                    <p>Name : {address.recipientName}</p>
                    <p>Address : {address.streetAddress}</p>
                    <div>
                      <button className="btn order" onClick={() => navigate(`/edit-shipping/${address._id}`)}>Edit</button>
                    </div>
                    <div className="item-icon" onClick={() => handleDeleteConfirmation(address._id)}>
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
      <ToastContainer/>
    </div>
  );
}

export default AllShipping;
