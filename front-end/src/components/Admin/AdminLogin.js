import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/form.css";
import axios from "axios";
import { validate } from "../validateLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("adminToken"),
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/admin");
          }
        })
        .catch(() => localStorage.removeItem("adminToken"));
    }
  }, [navigate, headers]);

  function handleSubmit(e) {
    e.preventDefault();
    if (validate(email, password)) {
      const params = JSON.stringify({
        email: email,
        password: password,
      });

      axios
        .post("/api/admin/login", params, { headers })
        .then((res) => {
          console.log(res.data.token);
          localStorage.setItem("adminToken", res.data.token);
          navigate("/admin");
          toast.success("Login successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Login failed", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
        });
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>
      <div className="container-box">
        <form className="form-signin" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            required
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              name="password"
              placeholder="Enter Your Password"
              required
              autoComplete="false"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              type="button"
              className="toggle-password-btn"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <img src="/images/show.png" alt="" />
              ) : (
                <img src="/images/hide.png" alt="" />
              )}
            </span>
          </div>
          <div>
            <button className="form-btn">Sign In</button>
          </div>
          <div>
            Go to <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
