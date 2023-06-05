const validateCredentials = (email, password) => {
    if (!email || !password) {
      return false; // Return false if either email or password is null
    }
  
    if (email.trim().length === 0 || password.trim().length === 0) {
      return false; // Return false if either email or password contains only whitespace characters
    }
  
    if (email.includes(' ') || password.includes(' ')) {
      return false; // Return false if either email or password contains a space
    }
  
    return true; // Return true if both email and password pass all the checks
  };
module.exports = validateCredentials;  