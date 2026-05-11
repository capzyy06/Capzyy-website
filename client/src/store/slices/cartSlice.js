import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, itemCount: 0 },
  reducers: {
    addToCart: (state, { payload }) => {
      const key = `${payload.productId}-${payload.variant?.color || ''}-${payload.variant?.size || ''}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        existing.quantity += payload.quantity || 1;
      } else {
        state.items.push({ ...payload, key, quantity: payload.quantity || 1 });
      }
      state.itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
      state.total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter(i => i.key !== payload);
      state.itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
      state.total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    },
    updateQuantity: (state, { payload: { key, quantity } }) => {
      const item = state.items.find(i => i.key === key);
      if (item) item.quantity = Math.max(1, quantity);
      state.itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
      state.total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    },
    clearCart: (state) => { state.items = []; state.total = 0; state.itemCount = 0; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
