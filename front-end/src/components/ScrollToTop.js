import  { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();
    
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, [location]);

  return null;
}

export default ScrollToTop;
