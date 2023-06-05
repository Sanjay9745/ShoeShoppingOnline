import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import StarRating from "./StarRating";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductCard({ id, img, name, price, rating, numberOfReviews, stock }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(false);
  const cartItems = useSelector((state) => state.cart);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true);
          }
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, [navigate, headers]);

  const dispatch = useDispatch();
  const cartItem = cartItems.filter((item) => item.id === id);
  let quantity = cartItem[0]?.quantity;
  const handleAddToCart = () => {
    const item = { id, name, price, img };
    if(stock!==quantity){
      if (user) {
        axios.post("/api/add-cart", item, { headers }).then((res) => {
      
        });
      } 
        dispatch(addToCart(item));
    }
    
    
  };

  return (
    <div>
      <div className="cardclass">
        <img src={img} alt="product" />
        <p>{name}</p>

        <h3>{price}</h3>
        <div className="product-rating">
          <StarRating rating={rating} />
          <p>{numberOfReviews} Reviews</p>
        </div>

        <div className="product-btn">
          {stock <= quantity ? (
            <button>Out of Stock</button>
          ) : (
            <>
              <button onClick={handleAddToCart}>Add Cart</button>
              <button onClick={() => navigate(`/buy/${id}`)}>Buy Now</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
