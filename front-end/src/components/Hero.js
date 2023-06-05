/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";

import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  return (
    <div>
      <section>
        <div className="hero-title">
          <h1>
            Buy Your
            <br /> Shoes Today
          </h1>
          <span></span>
          <p>
          Sole Haven: Your Gateway to Stylish Footwear for Every Occasion
          </p>
      
            <button onClick={()=>navigate("/products")}>Shop Now</button>
         
        </div >
        <div className="hero-image" >
          
          <img
            src="/images/27518-9-nike-shoes-file.png"
            alt="Image description"
          />
         
        </div>
      </section>
    </div>
  );
}

export default Hero;
