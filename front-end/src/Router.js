import React, { useLayoutEffect, useState, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./components/Hero";
import HomeProduct from "./components/HomeProduct";
import About from "./components/About";
import Products from "./components/Products";
import Carts from "./components/Carts";
import BuyPage from "./components/BuyPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Admin from "./components/Admin/Admin";
import AddProduct from "./components/Admin/AddProduct";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminRegister from "./components/Admin/AdminRegister";
import ManageUsers from "./components/Admin/ManageUsers";
import AdminProductEdit from "./components/Admin/AdminProductEdit";
import ShippingAddress from "./components/ShippingAddress";
import AllShipping from "./components/AllShipping";
import EditShipping from "./components/EditShipping";
import MakeOrder from "./components/MakeOrder";
import Orders from "./components/Orders";
import AdminSingleOrder from "./components/Admin/AdminSingleOrder";
import ViewUserOrders from "./components/Admin/ViewUserOrders";
import OneOrder from "./components/Admin/OneOrder";
import ForgotPassword from "./components/ForgotPassword";
import StoreToken from "./components/StoreToken";

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useLayoutEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    handleLoad(); // Call the handler immediately since we're already in a synchronous phase
  }, []);

  useLayoutEffect(() => {
    scroll.scrollToTop({ smooth: true }); // Scroll to top on route change with smooth animation
  }, [location]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {isLoading ? (
          <Loading />
        ) : (
          <Routes>
            <Route element={<ScrollToTop />} />
            <Route
              exact
              path="/"
              element={
                <>
                  <Hero />
                  <HomeProduct />
                  <About />
                </>
              }
            />

        
            <Route path="/storeToken" element={<StoreToken/>} />
            <Route path="/products" element={<Products />} />
            <Route path="/carts" element={<Carts />} />
            <Route path="/buy/:id" element={<BuyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password/:id" element={<ForgotPassword />} />
            <Route path="/account" element={<Account />} />
            <Route path="/add-shipping" element={<ShippingAddress />} />
            <Route path="/all-shipping" element={<AllShipping />} />
            <Route path="/edit-shipping/:id" element={<EditShipping />} />
            <Route path="/make-order" element={<MakeOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/product/:id" element={<AdminProductEdit />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/manage-user" element={<ManageUsers />} />
            <Route
              path="/admin/single-user-order/:id"
              element={<AdminSingleOrder />}
            />
            <Route path="/admin/all-orders" element={<ViewUserOrders />} />
            <Route
              path="/admin/one-order/:userId/:orderId"
              element={<OneOrder />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Suspense>
    </>
  );
}

export default Router;
