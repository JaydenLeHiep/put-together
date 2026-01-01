import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
        console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
    </StrictMode>,
)
