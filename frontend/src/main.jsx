import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </AuthProvider>
  </React.StrictMode>
);
