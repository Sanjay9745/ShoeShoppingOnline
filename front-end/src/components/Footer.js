/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link"

function Footer() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const firstSegment = pathSegments[1];
    const [state,setState] = useState(false)
    useEffect(()=>{
        switch(firstSegment){
            case "":setState(true);
            break;
            case "carts":setState(true);
            break;
            case "products":setState(true);
            break;
            case "buy":setState(true);
            break;
          default:setState(false);
          break;
        }
    },[firstSegment])

  return (
    <>
          <footer className={state?null:"shipping"}>
        <div className="footer">
        <div className="company footer-card">
            <h3>Company</h3>
            <ul>
                <li><HashLink smooth to="/#about">About US</HashLink></li>
                <li><HashLink smooth to="/#home-products">Our Services</HashLink></li>
                
            </ul>
        </div>
        <div className="get-help footer-card">
            <h3>Get Help</h3>
            <ul>
                <li><Link to="/">FAQ</Link></li>
                <li><Link to="/products">Shopping</Link></li>
                <li><Link to="/orders">Returns</Link></li>
                <li><Link to="/orders">Order Status</Link></li>
              
            </ul>
        </div>
        <div className="online-shop footer-card">
            <h3>Online Shop</h3>
            <ul>
                <li><Link to="/products">Sneaker</Link></li>
                <li><Link to="/products">Sports wear</Link></li>
                <li><Link to="/products">Shoes</Link></li>
                
            </ul>
        </div>
        <div className="follow footer-card">
            <h3>Follow us</h3>
            <ul>
                <li><Link to="/"><img src="/images/icons8-facebook-f-50.png" alt="facebook"/></Link></li>
                <li><a href="https://www.linkedin.com/in/sanjay-santhosh-31919026b/" target="__blank"><img src="/images/icons8-linkedin.svg" alt="linkedin" /></a></li>
                <li><a href="https://www.instagram.com/sanjaysanthosh__" target="__blank"><img src="/images/icons8-instagram.svg" alt="instagram"/></a></li>
                <li><Link to="/"><img src="/images/icons8-twitter-30.png" alt="twitter" /></Link></li>
              
            </ul>
        </div>
    </div>
     </footer>

    </>
  )
}

export default Footer
