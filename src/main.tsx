import React from 'react'
// import ReactDOM from 'react-dom/client'
import ReactDOM from './react-dom/client'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'


const { render, unmount } = ReactDOM.createRoot(document.getElementById('root')!)
render(
 //<React.StrictMode>
    //  <App /> 
    <button onClick={unmount} >unmount</button>
  //</React.StrictMode>,
)
