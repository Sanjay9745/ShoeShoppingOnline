/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../style/form.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addAllItems } from "../redux/cartSlice";
import { validate } from "./validateLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
function Login() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatch = useDispatch();
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/");
          }
        })
        .catch((res) => {
          localStorage.removeItem("token");
          setIsLoading(false);
          toast.error("Fake Token");
        });
    } else {
      setIsLoading(false);
    }
  }, [navigate, headers]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (validate(email, password)) {
      const params = JSON.stringify({
        //string or number or object or array or boolean or null or undefined. 	Can also be a function or other custom data
        email: email,
        password: password,
      });

      axios
        .post("/api/login", params, { headers })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token); //token is the key to store the token in the storage.  localStorage is a built in JavaScript storage.  localStorage.token is the key to store the token in the storage.  token is what we store in the storage.  localStorage.token is what we get from the storage.  token is what we store in the local storage.  localStorage.token is what we get from the storage.  So, we set the token in the storage to the token we get from the storage.  So, we can now use the token
            axios("/api/cart-items", {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": res.data.token,
              },
            }).then((res) => {
              if (res.status === 200) {
                dispatch(addAllItems(res.data.cartItems));
                localStorage.setItem(
                  "cart",
                  JSON.stringify(res.data.cartItems)
                ); //cart is the key to store the cart in the storage.  localStorage is a built in JavaScript
              }
            });
            toast.success("Sign In Successfully", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
            const redirectPath = localStorage.getItem("redirectPath");
            if (redirectPath) {
              localStorage.removeItem("redirectPath"); // Remove the stored redirect path
              navigate(redirectPath);
            } else {
              navigate("/"); // If no redirect path is found, navigate to the default path
            }
          } else if (res.status === 401) {
            toast.error("Incorrect Password");
          } else if (res.status === 409) {
            toast.error(res.data.message);
          } else {
            toast.error("Something Went Wrong");
          }
        })
        .catch((res) => {
          toast.error("Login Failed Please Check Your Email or password");
        });
      //console log the data from the server
    }
  }
  function ForgotPassword() {
    axios
      .get("/api/user-exist/" + email)
      .then((res) => {
        if (res.status === 200) {
          navigate("/forgot-password/" + res.data.id);
        }
      })
      .catch((e) => console.log(e));
  }
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    ); // Render a loading message or spinner while isLoading is true
  }
  return (
    <>
      <div className="container">
        <h1>Sign In</h1>
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
            <p className="forgot" onClick={ForgotPassword}>
              Forgot Password
            </p>
            <div>
              <button className="form-btn">Sign In</button>
            </div>
            <div>
              Go to <Link to="/register">Sign Up</Link>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Login;
