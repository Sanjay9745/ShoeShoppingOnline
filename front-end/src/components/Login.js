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
            navigate("/", { replace: true });
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
        email: email,
        password: password,
      });

      axios
        .post("/api/login", params, { headers })
        .then((res) => {
        
          if (res.status === 200) {
            if (res.data.requiresGoogleAuth) {
          navigate("/auth/google")
            } else {
              localStorage.setItem("token", res.data.token);
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
                  );
                }
              });

              toast.success("Sign In Successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });

              const redirectPath = localStorage.getItem("redirectPath");
              if (redirectPath) {
                localStorage.removeItem("redirectPath");
                navigate(redirectPath);
              } else {
                navigate("/");
              }
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
    }
  }

  function handleTogglePassword() {
    setShowPassword((prevState) => !prevState);
  }

  function handleForgotPassword() {
    if (!email) {
      toast.error("Enter Your Email");
    } else {
      axios
        .get("/api/user-exist/" + email)
        .then((res) => {
          if (res.status === 200) {
            navigate("/forgot-password/" + res.data.id);
          }
        })
        .catch((e) => console.log(e));
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="container-box">
        <h1>Sign In</h1>
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
              className="toggle-password-btn"
              role="button"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <img src="/images/show.png" alt="" />
              ) : (
                <img src="/images/hide.png" alt="" />
              )}
            </span>
          </div>
          <p className="forgot" onClick={handleForgotPassword}>
              Forgot Password
            </p>
          <button className="form-btn">Sign In</button>

          <div className="google-div">
            <a
              className="google-btn"
              href="/auth/google"
              aria-label="Login with Google"
            >
              <img src="images/google.png" alt="" /> Login with Google
            </a>
          </div>
          <div>
            Go to <Link to="/register">Sign Up</Link>
          </div>
         
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
