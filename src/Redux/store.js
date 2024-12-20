import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../Redux/counter/counterSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
