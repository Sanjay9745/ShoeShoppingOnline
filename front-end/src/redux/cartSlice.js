
// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState:localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')): [],
  reducers: {

    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Increment the quantity if item exists
        existingItem.quantity += 1;
      } else {
        // Add the item to the cart if it doesn't exist
        state.push({ ...item, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state)); // Save cart to local storage for 5 minutes.  This will be removed in a near future
    },
    reduceQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.find((cartItem) => cartItem.id === itemId);
      if (item) {
        // Decrease the quantity by 1
        item.quantity -= 1;
      }
      localStorage.setItem('cart', JSON.stringify(state)); 
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      localStorage.setItem('cart', JSON.stringify(state.filter((item) => item.id !== itemId))); 
      return (state.filter((item) => item.id !== itemId))
  
    },
    removeAllItems:(state,action)=>{
      localStorage.setItem('cart', JSON.stringify([]));
      return [];
    },
    addAllItems: (state, action) => {
      state.push(...action.payload);
    }
    
  },
});

export const { addToCart,reduceQuantity , removeFromCart,removeAllItems, addAllItems} = cartSlice.actions;
export default cartSlice.reducer;
