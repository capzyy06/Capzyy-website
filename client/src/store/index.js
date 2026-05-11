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

const rootReducer = combineReducers({
  cart: persistReducer({ key: 'capzyy-cart', storage }, cartReducer),
  auth: persistReducer({ key: 'capzyy-auth', storage }, authReducer),
  ui: uiReducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM({
    serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] }
  }).concat(productsApi.middleware, categoriesApi.middleware, ordersApi.middleware),
});

export const persistor = persistStore(store);
