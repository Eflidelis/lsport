import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/normalize.css';
import './assets/css/main.scss';
import './assets/css/colors.scss';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
