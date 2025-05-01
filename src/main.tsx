import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  const newRoot = document.createElement('div')
  newRoot.id = 'root'
  document.body.appendChild(newRoot)
  ReactDOM.createRoot(newRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
