import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import "../style/orders.css"
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function Products() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setData(res.data);
        setIsLoading(false)
      })
      .catch(() => {
        navigate("/")
      });
  }, [navigate]);

  if (isLoading) {
    return <><Loading/></>; // Render a loading message or spinner while isLoading is true
  }
  return (
    <>
      <div className={`search-bar ${isScrolled ? "scrolled" : ""}`}>
      <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value) } />
    </div>
      <div className="products">
        {search.length > 0 &&
          data
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((filteredProduct) => (
              <ProductCard
                key={filteredProduct._id}
                id={filteredProduct._id}
                img={filteredProduct.img}
                stock={filteredProduct.stock}
                name={filteredProduct.name}
                price={filteredProduct.price}
                rating={filteredProduct.rating}
                numberOfReviews={filteredProduct.numberOfReviews}
              />
            ))}

        {search.length === 0 &&
          data.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              img={product.img}
              stock={product.stock}
              name={product.name}
              price={product.price}
              rating={product.rating}
              numberOfReviews={product.numberOfReviews}
            />
          ))}
      </div>
    </>
  );
}

export default Products;
