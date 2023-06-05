/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
                <li><a href="#">Our Services</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Affiliate Program </a></li>
                <li><a href="#">Payment Options</a></li>
            </ul>
        </div>
        <div className="get-help footer-card">
            <h3>Get Help</h3>
            <ul>
                <li><a href="">FAQ</a></li>
                <li><a href="">Shopping</a></li>
                <li><a href="">Returns</a></li>
                <li><a href="">Order Status</a></li>
                <li><a href="">Payment Options</a></li>
            </ul>
        </div>
        <div className="online-shop footer-card">
            <h3>Online Shop</h3>
            <ul>
                <li><a href="">Watch</a></li>
                <li><a href="">Sports wear</a></li>
                <li><a href="">Shoes</a></li>
                
            </ul>
        </div>
        <div className="follow footer-card">
            <h3>Follow us</h3>
            <ul>
                <li><a href=""><img src="/images/icons8-facebook-f-50.png" alt="facebook" /></a></li>
                <li><a href=""><img src="/images/icons8-linkedin.svg" alt="linkedin" /></a></li>
                <li><a href=""><img src="/images/icons8-instagram.svg" alt="instagram"/></a></li>
                <li><a href=""><img src="/images/icons8-twitter-30.png" alt="twitter"/></a></li>
              
            </ul>
        </div>
    </div>
     </footer>

    </>
  )
}

export default Footer
