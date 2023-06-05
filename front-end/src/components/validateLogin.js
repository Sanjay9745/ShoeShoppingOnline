import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const validate = ( email, password) => {
    let errors = [];

    if (!email) {
      errors.push('Please enter your email.');
    }
  
    if (!password) {
      errors.push('Please enter a password.');
    }
  
    if (errors.length > 0) {
      toast.error(errors.join(' '));
      return false;
    }
  
    return true;
  };
  