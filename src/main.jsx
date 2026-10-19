import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import './index.css';
import App from './App';

const root = document.getElementById('root');
ReactModal.setAppElement(root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
