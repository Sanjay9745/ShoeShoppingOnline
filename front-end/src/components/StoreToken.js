import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StoreToken = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jwtToken = queryParams.get("token");

    if (jwtToken) {
      // Store the token in the local storage
      localStorage.setItem("token", jwtToken);

      // Redirect to the home route ("/")
      navigate("/");
    }
  }, [location, navigate]);

  // Use the token for authentication and authorization as needed

  return (
    <div>
      {/* Your app content */}
    </div>
  );
};

export default StoreToken;
