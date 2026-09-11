import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,HashRouter } from "react-router-dom";
import App from "./App";
// import "./index.css";
// import "../globle.css"
// import './styles/global1.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  
    <App />
  </BrowserRouter>
);
