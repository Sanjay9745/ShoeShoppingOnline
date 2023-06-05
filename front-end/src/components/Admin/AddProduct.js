import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/form.css";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AddProduct() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const headers = {
      "x-access-token": localStorage.getItem("adminToken"),
    };
  const navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem('adminToken');
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log("admin verified");
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

  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");



  const handleSubmit = (event) => {
    event.preventDefault();
 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file2", file2);
    formData.append("file3", file3);

    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("desc", desc);
   
    axios
      .post("/api/admin/add-product", formData,{headers})
      .then((response) => {
        toast.success("Product added")
        console.log(response.data);
        setFile(null);
        setFile2(null)
        setFile3(null)
        setName("")
        setPrice("")
        setStock("")
        setDesc("")
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <>
      <div className="container">
        <div className="container-box">
        <form onSubmit={handleSubmit} className="form-signin">
          <label>Name : </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Price : </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Image 1</label>
          <input type="file"  onChange={(e)=>setFile(e.target.files[0])} />
          <label>Image 2</label>
          <input type="file" onChange={(e)=>setFile2(e.target.files[0])} />
          <label>Image 3</label>
          <input type="file"  onChange={(e)=>setFile3(e.target.files[0])} />
          <label>Stock : </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <label>Description : </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div>
            <button className="form-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
        <ToastContainer/>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
