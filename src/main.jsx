import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SelectionProvider } from './state/useSelectionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SelectionProvider>
      <App />
    </SelectionProvider>
  </React.StrictMode>,
)
