import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Scrollbar } from 'react-scrollbars-custom';
import "../../style/carts.css"
import AdminProducts from './AdminProducts';
function Admin() {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    'Content-Type': 'application/json',
  'x-access-token': localStorage.getItem('adminToken'),
  };
  
  useEffect(() => {
    let token = localStorage.getItem('adminToken');
    if (token) {
      axios("/api/admin/protected", { headers })
        .then((res) => {
         
          if (res.status === 200) {
            console.log("admin login success");
          }else{
      
            navigate("/")
          }
        })
        .catch(() =>{
      navigate("/")
      });
    }else{
      navigate("/")
    }
  }, [headers, navigate]);


  useEffect(() => {
    axios.get("/api/products")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  return (
    <div>
      <div className='container'>
      <h1>Manage Products</h1>
        <div className='products-page'>
        <Scrollbar >
            <div className='products-items'>
  {data.map((product) => (
        <AdminProducts
            key={product._id}
            id={product._id}
            img={product.img}
            stock={product.stock}
            name={product.name}
            price={product.price}
            setProducts={setData}
          />
        ))}
            </div>
        </Scrollbar>

        </div>
        
      </div>
    </div>
  )
}

export default Admin
