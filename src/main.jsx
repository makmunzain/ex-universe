import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FisheyeScene from './FisheyeScene.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <FisheyeScene />
    <img className="controlKeys" src="/models/controls.png" alt="control keys" />
  </StrictMode>,
)
