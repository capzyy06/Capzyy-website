import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isCartOpen: false, isSearchOpen: false, isMobileMenuOpen: false },
  reducers: {
    toggleCart: (state) => { state.isCartOpen = !state.isCartOpen; },
    openCart: (state) => { state.isCartOpen = true; },
    closeCart: (state) => { state.isCartOpen = false; },
    toggleSearch: (state) => { state.isSearchOpen = !state.isSearchOpen; },
    closeSearch: (state) => { state.isSearchOpen = false; },
    toggleMobileMenu: (state) => { state.isMobileMenuOpen = !state.isMobileMenuOpen; },
    closeMobileMenu: (state) => { state.isMobileMenuOpen = false; },
  },
});

export const { toggleCart, openCart, closeCart, toggleSearch, closeSearch, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
