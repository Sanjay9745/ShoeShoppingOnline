import React, { useEffect, useState } from "react";
import "../style/form.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [btn, setBtn] = useState("Send OTP");
  const [verified, setVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };

  const navigate = useNavigate();

  function handleSubmit() {
    axios
      .post("/api/user/otp-verify", { otp: password, id: id })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          setVerified(true);
        }
      })
      .catch((error) => {
        toast.error("Failed to verify OTP", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      });
  }

  function handleVerify(e) {
    e.preventDefault();

    axios
      .post("/api/user/send-otp", { id: id })
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
      .catch((error) => {
        toast.error("Failed to send OTP", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      });
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

  function updateProfile(e) {
    e.preventDefault();
    axios
      .patch("/api/user/", { password: password }, { headers })
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
          toast.success("Password Updated", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to update password", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      });
  }

  return (
    <>
      <div className="container">
        <h1>Verify Account</h1>
        <div className="container-box">
          {!verified ? (
            <>
              <div className="form-signin">
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
                   value={password} 
                   autocomplete="off"
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
                <ToastContainer />
              </div>
            </>
          ) : (
            <>
              <form className="form-signin">
                <h1>Reset Password</h1>
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
              </form>
              <ToastContainer />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
