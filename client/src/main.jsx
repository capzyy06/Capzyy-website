import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store, persistor } from './store/index';
import App from './App';
import './index.css';

setupListeners(store.dispatch);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);