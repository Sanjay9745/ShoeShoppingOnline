import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { removeAllItems } from "../redux/cartSlice";

function Navbar() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [user, setUser] = useState(false);
  const [cartCount, setCartCount] = useState("");
  const navbarRef = useRef(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    // Function to handle click outside the navbar
    const handleClickOutsideNavbar = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !event.target.classList.contains("account-icon")
      ) {
        setIsNavbarVisible(false);
      }
    };

    // Add event listener to listen for click events on the document
    document.addEventListener("click", handleClickOutsideNavbar);

    // Cleanup by removing the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideNavbar);
    };
  }, [isNavbarVisible]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  useEffect(() => {
    setCartCount(cartItems.reduce((a, b) => a + b.quantity, 0));
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true);
          } else {
            setUser(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(false);
        });
    }
  }, [cartItems, headers]);

  const navigate = useNavigate();

  function handleLogOut() {
    setUser(false);
    dispatch(removeAllItems());
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/");
  }

  return (
    <div>
      <nav>
        <h3>Logo</h3>
        <div className="hamburger-menu"  onClick={() => setIsNavbarVisible((prev) => !prev)}>
          <input
            id="menu__toggle"
            ref={navbarRef}
            className={`${isNavbarVisible ? "visible" : "hidden"}`}
            type="checkbox"
           
          />
          <label className="menu__btn" htmlFor="menu__toggle">
            <span></span>
          </label>

          <ul className="menu__box">
            <li>
              <Link className="menu__item" to="/">
                Home
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/products">
                Products
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/carts">
                Cart{" "}
                {cartCount !== 0 && (
                  <>
                    <span>{cartCount}</span>
                  </>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li className="authenticated">
                  <Link className="menu__item" to="/account">
                    My Account
                  </Link>
                </li>
                <li className="authenticated">
                 <Link className="menu__item" onClick={handleLogOut}>Sign Out</Link>
                </li>
              </>
            ) : (
              <>
                <li className="not-authenticated">
                  <Link className="menu__item" to="/login">
                    Sign In
                  </Link>
                </li>
                <li className="not-authenticated">
                  <Link className="menu__item" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
