/* eslint-disable react-hooks/exhaustive-deps */

import Router from "./Router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/Admin/AdminNavbar"
import { useLocation } from 'react-router-dom';


function App() {

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const firstSegment = pathSegments[1];

  return (
    <>
    {firstSegment==="admin"? <AdminNavbar/>:<Navbar/>}
      <Router />
      {firstSegment!=="admin"&&<Footer />}
      
    </>
  );
}

export default App;
