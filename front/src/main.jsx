import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NFTMarketPlaceProvider } from '../Context/NFTMarketPlaceContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NFTMarketPlaceProvider>
      <App />
    </NFTMarketPlaceProvider>
  </StrictMode>,
)
