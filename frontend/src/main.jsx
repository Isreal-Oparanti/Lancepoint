import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OktoProvider, BuildType } from "okto-sdk-react";

const GOOGLE_CLIENT_ID =
  "223799229324-6ue35s4ggqsdj7bct08qefaqbr280fig.apps.googleusercontent.com";
// const OKTO_CLIENT_API = "b9b928ee-9b60-4e34-bb2d-4398dfcb012c";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThirdwebProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThirdwebProvider>
    </AuthProvider>
  </React.StrictMode>
);
