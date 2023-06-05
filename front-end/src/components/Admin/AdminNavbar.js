/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";

import { CgProfile } from "react-icons/cg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminNavbar() {
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
           navigate("/")
            }
          }
        })
        .catch(() =>localStorage.removeItem("adminToken"));
    }
  }, [headers]);

  const [state, setState] = useState(false);
  function handleAccountClick() {
    if (state) {
      document.querySelector(".account-option").classList.add("active");
    } else {
      document.querySelector(".account-option").classList.remove("active");
    }
    setState((prev) => !prev);
  }
  function handleLogOut() {
    localStorage.removeItem("adminToken");
    navigate("/");
  }
  return (
    <div>
      <nav>
        <h3>Admin</h3>
        <div className="hamburger-menu">
          <input id="menu__toggle" type="checkbox" />
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
              <div
                className="menu__item account-logo"
                onClick={handleAccountClick}
              >
                <CgProfile />
                <div className="account-option">
                  
                      <p onClick={handleLogOut}>Sign out</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AdminNavbar;
