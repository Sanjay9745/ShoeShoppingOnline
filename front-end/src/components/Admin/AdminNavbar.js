/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminNavbar() {
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
    "x-access-token": localStorage.getItem("adminToken"),
  };
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (!token) {
    } else {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            let token = localStorage.getItem("adminToken");
            if (!token) {
              navigate("/");
            }
          }
        })
        .catch(() => localStorage.removeItem("adminToken"));
    }
  }, [headers]);


  function handleLogOut() {
    localStorage.removeItem("adminToken");
    navigate("/");
  }
  return (
    <div>
      <nav>
        <h3>Admin</h3>
        <div
          className="hamburger-menu"
          onClick={() => setIsNavbarVisible((prev) => !prev)}
        >
          <input
            id="menu__toggle"
            type="checkbox"
            ref={navbarRef}
            className={`${isNavbarVisible ? "visible" : "hidden"}`}
          />
          <label className="menu__btn" htmlFor="menu__toggle">
            <span></span>
          </label>

          <ul className="menu__box">
            <li>
              <Link className="menu__item" to="/admin">
                Home
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/admin/add-product">
                Add Products
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/admin/manage-user">
                Manage Users
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/admin/all-orders">
                All Orders
              </Link>
            </li>

            <li>
              <Link className="menu__item" onClick={handleLogOut}>
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AdminNavbar;
