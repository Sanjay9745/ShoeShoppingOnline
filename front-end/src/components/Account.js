/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../style/form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { removeAllItems } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validate } from "./validate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Account() {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verified, setVerified] = useState(false);
  const [btn, setBtn] = useState("Send OTP");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };

  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      axios("/api/protected", { headers })
        .then((res) => {
          console.log(res.status);
          if (res.status === 403 || res.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  }, [headers, navigate]);

  useEffect(() => {
    axios
      .get("/api/user/is-verified", { headers })
      .then((res) => {
        if (res.status === 200) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      })
      .catch((e) => console.log(e));
  }, [verified]);

  function handleDeleteConfirmation() {
    confirmAlert({
      title: "Confirm Account Deletion",
      message: "Are you sure you want to delete the account?",
      buttons: [
        {
          label: "Yes",
          onClick: handleDelete,
        },
        {
          label: "No",
          onClick: () => console.log("Account deletion canceled"),
        },
      ],
    });
  }

  function handleDelete() {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    toast
      .promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete the account?"
            );
            if (confirmDelete) {
              axios
                .delete("/api/user", { headers })
                .then((res) => {
                  console.log(res);
                  dispatch(removeAllItems());
                  localStorage.removeItem("cart");
                  localStorage.removeItem("token");
                  resolve();
                  navigate("/");
                })
                .catch((e) => {
                  console.log(e);
                  reject();
                });
            } else {
              reject();
            }
          }, 2000);
        }),
        {
          pending: "Deleting...",
          success: "Account deleted successfully.",
          error: "Failed to delete account.",
        }
      )
      .catch(() => {
        toast.error("Failed to delete account.", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }

  function handleVerify(e) {
    e.preventDefault();

    axios
      .get("/api/user/verify", { headers })
      .then((res) => {
        if (res.status === 200) {
          if (!isButtonDisabled) {
            setIsButtonDisabled(true);
            setTimer(30);
          }
          setBtn("Resend OTP");
          toast.success("OTP sent to your registered email id", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    if (isButtonDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else if (timer === 0) {
      setIsButtonDisabled(false);
    }
  }, [isButtonDisabled, timer]);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("/api/user/otp", { otp: password }, { headers })
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        }
      })
      .catch((e) => console.log(e));
  }

  function updateProfile(e) {
    e.preventDefault();
    let email = "hello@gmail.com";
    if (validate(name, email, password)) {
      axios
        .patch("/api/user", { name: name, password: password }, { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/");
          }
        })
        .catch((e) => console.log(e));
    }
  }

  return (
    <>
      <div className="container">
        <h1>Profile</h1>
        <div className="container-box">
          {!verified ? (
            <>
              <form className="form-signin">
                <h1>Verify Account</h1>
                {isButtonDisabled && (
                  <>
                    <p>Resend OTP in: {timer} seconds</p>
                    <p>Check Your Email</p>
                  </>
                )}
                <label htmlFor="otp">OTP: </label>
                <input
                  type="number"
                  name="password"
                  id="password"
                  placeholder="Enter Your OTP"
                  required
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="form-btn" onClick={handleSubmit}>
                  Submit
                </button>
                <button
                  className="form-btn"
                  onClick={handleVerify}
                  disabled={isButtonDisabled}
                >
                  {btn}
                </button>
              </form>
              <div className="form-div">
                <button className="form-btn" onClick={handleDeleteConfirmation}>
                  Delete my account
                </button>
              </div>
            </>
          ) : (
            <>
              <form className="form-signin">
                <h1>Update Profile</h1>
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter the Name to Update"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="form-btn" onClick={updateProfile}>
                  Update My Account
                </button>
                <button
                  className="form-btn"
                  onClick={() => navigate("/all-shipping")}
                >
                  Edit Shipping Address
                </button>
              </form>
              <div className="form-div">
                <button className="form-btn" onClick={handleDeleteConfirmation}>
                  Delete my account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Account;
