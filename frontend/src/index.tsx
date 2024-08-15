import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ConverterComponent from './components/ConverterComponent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConverterComponent />
  </React.StrictMode>
);

