import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./page/Home/Home";

// Punto de entrada de la aplicación React.
// Monta el componente principal <Home /> dentro del div#root de index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
