import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../style/form.css";

import { useEffect} from "react";
import axios from "axios";

function ProductCard({ id, img, name, price,setProducts }) {
  const navigate = useNavigate();

 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("adminToken"),
  };
  useEffect(() => {
    let token = localStorage.getItem('adminToken');
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log("admin login success");
          }else{
      
            navigate("/")
          }
        })
        .catch(() =>{localStorage.removeItem("adminToken") 
      navigate("/")
      });
    }else{
      navigate("/")
    }
  }, [headers, navigate]);

  function handleRemove() {
    axios
      .delete(`/api/admin/remove-product/${id}`, { headers })
      .then((response) => {
        if (response.status === 200) {
          console.log("Product removed");

          // Update the client-side state by filtering out the deleted product
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
        <div className="small-product">
        
            <img src={img} className="product-image" alt={name} />
            <h3>{name}</h3>
            <p>{price}</p>
            <div className="btn" onClick={()=>navigate("/admin/product/"+id)}>Edit</div>
            <div className="item-icon" onClick={handleRemove}>
          {<MdDelete />}
        </div>
        </div>
        <hr/>
    </div>
  );
}

export default ProductCard;
