import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
      } else {
        state.cartItems.push({ ...item, quantity: 1 }); // Add new item with quantity 1
      }
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload); // Remove item by ID
    },
    clearCart(state) {
      state.cartItems = []; // Clear the cart
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
