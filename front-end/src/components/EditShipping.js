/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditShipping() {
  const { id } = useParams();
  const [recipientName, setRecipientName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(false);
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  };
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      axios('/api/protected', { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true);
          } else {
            setUser(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/');
    }
  }, [navigate, headers]);

  useEffect(() => {
    if (user) {
      axios('/api/user/is-verified', { headers })
        .then((res) => {
          if (res.status === 401) {
            navigate('/account');
          }
        })
        .catch(() => navigate('/account'));
    }
  }, [headers]);

  useEffect(() => {
    if (user) {
      axios
        .get('/api/shipping/' + id, { headers })
        .then((res) => {
          if (res.status === 200) {
            setData(res.data);
          } else {
            setData([]);
          }
        })
        .catch(() => navigate('/account'));
    }
  }, [id, user]);

  useEffect(() => {
    if (user && data) {
      setRecipientName(data.recipientName);
      setStreetAddress(data.streetAddress);
      setApartmentNumber(data.apartmentNumber);
      setCity(data.city);
      setState(data.state);
      setPostalCode(data.postalCode);
      setCountry(data.country);
      setPhoneNumber(data.phoneNumber);
    }
  }, [user, data]);

  function handleSubmit(e) {
    e.preventDefault();

    const EditShippingData = {
      recipientName,
      streetAddress,
      apartmentNumber,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    };

    axios
      .patch('/api/edit-shipping', { id:id, updatedAddress: EditShippingData }, { headers })
      .then((response) => {
        if (response.status === 200) {
         navigate("/all-shipping")
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }

  return (
    <>
      <div className='container'>
        <h1>Shipping Address</h1>
        <div className='container-box'>
          <form className='form-signin' onSubmit={handleSubmit}>
            <label>Recipient's Name:</label>
            <input
              type='text'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />

            <label>Street Address:</label>
            <input
              type='text'
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />

            <label>Apartment, Suite, or Unit Number:</label>
            <input
              type='text'
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
              placeholder='Optional'
            />

            <label>City:</label>
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <label>State/Province/Region:</label>
            <input
              type='text'
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />

            <label>Postal Code/ZIP Code:</label>
            <input
              type='text'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />

            <label>Country:</label>
            <input
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            <label>Phone Number:</label>
            <input
              type='tel'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <div>
              <button className='form-btn' type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditShipping;
