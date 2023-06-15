import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../style/card.css"
function HomeProduct() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);


  const products = data.filter((product) => product.rating === 5);
  const selectedProducts = products.slice(0, 4);

  return (
    <>
    <div className="our-product-title">

     <h2 >OUR POPULAR PRODUCT</h2>
    </div>
     <div class="container home">
     {selectedProducts.map((product) => (
  <div class="card home" key={product._id}>
    <div class="imgBx">
      <img src={product.img}  alt="card"/>
    </div>
    <div class="contentBx">
      <h2>{product.name}</h2>
      <div class="size">
        <h3>Price : ${product.price}</h3>
        

      </div>
      <div class="color">
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
