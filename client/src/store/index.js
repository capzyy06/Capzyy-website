import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

import { productsApi } from './api/productsApi';
import { categoriesApi } from './api/categoriesApi';
import { ordersApi } from './api/ordersApi';
import { heroBannerApi } from './api/heroBannerApi';
import { paymentsApi } from './api/paymentsApi';  // ✅ Added paymentsApi import

// Root reducer
const rootReducer = combineReducers({
  cart: persistReducer({ key: 'capzyy-cart', storage }, cartReducer),
  auth: persistReducer({ key: 'capzyy-auth', storage }, authReducer),
  ui: uiReducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [heroBannerApi.reducerPath]: heroBannerApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,  // ✅ Added paymentsApi reducer
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(
      productsApi.middleware,
      categoriesApi.middleware,
      ordersApi.middleware,
      heroBannerApi.middleware,
      paymentsApi.middleware,  // ✅ Added paymentsApi middleware
    ),
});

// Persistor
export const persistor = persistStore(store);
