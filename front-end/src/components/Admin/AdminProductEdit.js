import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminProductEdit() {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "x-access-token": localStorage.getItem("adminToken"),
  };
  const navigate = useNavigate();
  
  useEffect(() => {
    let token = localStorage.getItem("adminToken");
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            console.log("admin verified");
          } else {
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [headers, navigate]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");


  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setStock(item.stock);
      setDesc(item.desc);
      setImg(item.img);
      setImg2(item.img2);
      setImg3(item.img3);
   
    }
  }, [item]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("desc", desc);
    formData.append("img", img);
    formData.append("img2", img2);
    formData.append("img3", img3);
    formData.append("id", id);


    axios
      .patch(`/api/admin/edit-product`, formData, { headers })
      .then((response) => {
        if(response.status===200){
          navigate("/admin")
        }
        // Redirect to product details page or display a success message
      })
      .catch((error) => {
        console.error("Error editing product:", error);
      });
  };

  return (
    <div className="container">
      <div className="container-box">
        <form onSubmit={handleSubmit} className="form-signin">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="img">Image 1 URL:</label>
          <input
            type="text"
            id="img"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />

          <label htmlFor="img2">Image 2 URL:</label>
          <input
            type="text"
            id="img2"
            value={img2}
            onChange={(e) => setImg2(e.target.value)}
          />

          <label htmlFor="img3">Image 3 URL:</label>
          <input
            type="text"
            id="img3"
            value={img3}
            onChange={(e) => setImg3(e.target.value)}
          />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div>
            <button className="form-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductEdit;
