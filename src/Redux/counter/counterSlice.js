import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, type } = action.payload;
      const existingItem = state.cartItems.find((i) => i.item_id === item.item_id);

      if (existingItem) {
        if (type === 'increase') {
          // Ensure quantity doesn't exceed stock
          if (existingItem.quantity < item.Stock) {
            existingItem.quantity += 1;
          }
        } else if (type === 'decrease' && existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        }
      } else {
        // If the item is new, set quantity to 1
        state.cartItems.push({ ...item, quantity: 1 });
      }

      // Update total count
      state.totalCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.item_id !== action.payload);
      state.totalCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
