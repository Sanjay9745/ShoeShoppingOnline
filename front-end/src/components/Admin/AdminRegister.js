import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/form.css";
import axios from "axios";
import { validate } from "../validate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("adminToken"),
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Admin verified");
          } else {
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [headers, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (validate(name, email, password)) {
      const params = JSON.stringify({
        name: name,
        email: email,
        password: password,
      });

      axios
        .post("/api/admin/register", params, { headers })
        .then((res) => {
          navigate("/admin");
          toast.success("Registration successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Registration failed", {
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
      <h1>Admin Register</h1>
      <div className="container-box">
        <form className="form-signin" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="name"
            name="name"
            id="name"
            placeholder="Enter Your Name"
            required
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            required
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
            <button className="form-btn">Sign Up</button>
          </div>
          <div>
            Go to <Link to="/admin/login">Sign In</Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminRegister;
