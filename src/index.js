import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './Components/App';
import ErrorBoundary from "./Components/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>    
          <App />     
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

