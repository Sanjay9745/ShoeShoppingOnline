import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../style/card.css"
import Loading from "./Loading";
function HomeProduct() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setData(res.data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);


  const products = data.filter((product) => product.rating === 5);
  const selectedProducts = products.slice(0, 4);
  if (isLoading) {
    return <><Loading/></>; // Render a loading message or spinner while isLoading is true
  }
  return (
    <>
    <div className="our-product-title">

     <h2 >OUR POPULAR PRODUCT</h2>
    </div>
     <div className="container home">
     {selectedProducts.map((product) => (
  <div className="card home" key={product._id}>
    <div className="imgBx">
      <img src={product.img}  alt="card"/>
    </div>
    <div className="contentBx">
      <h2>{product.name}</h2>
      <div className="size">
        <h3>Price : ${product.price}</h3>
        

      </div>
      <div className="color">
        <h3>Color :</h3>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p onClick={() => navigate(`/buy/${product._id}`)}>Buy Now</p>
    </div>
  </div>

))}

</div>
    </>
  );
}

export default HomeProduct;
