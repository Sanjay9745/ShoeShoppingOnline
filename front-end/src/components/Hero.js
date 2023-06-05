/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { Link } from "react-router-dom";

function Hero() {
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse fugiat
            voluptatibus molestiae assumenda magni sapiente beatae delectus
            dignissimos aspernatur quis?
          </p>
          <Link href="/products">
            {" "}
            <button>Shop Now</button>
          </Link>
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
