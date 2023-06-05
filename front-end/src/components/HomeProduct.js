import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <div className="cards">
        <h2>OUR POPULAR PRODUCT</h2>

        <div className="card">
          {selectedProducts.map((product) => (
            <div key={product._id} className="cardclass card1">
              <img src={product.img} alt="" />
              <p>{product.name}</p>
              <h3>${product.price}</h3>
              <button onClick={() => navigate(`/buy/${product._id}`)}>
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomeProduct;
