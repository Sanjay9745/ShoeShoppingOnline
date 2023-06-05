import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const validate = (name = '', email = '', password = '') => {
    let errors = [];
  
    if (!name) {
      errors.push('Please enter your name.');
    }
  
    if (!email) {
      errors.push('Please enter your email.');
    } else if (!email.includes('@gmail.com')) {
      errors.push('Email must be a valid Gmail address.');
    }
  
    if (!password) {
      errors.push('Please enter a password.');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    } else {
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
      const hasCharacter = /[a-zA-Z]/.test(password);
      
      if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character.');
      }
  
      if (!hasCharacter) {
        errors.push('Password must contain at least one letter.');
      }
    }
  
    if (errors.length > 0) {
      toast.error(errors.join(' '));
      return false;
    }
  
    return true;
  };
  