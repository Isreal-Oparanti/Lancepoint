import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginPage() {
  console.log("LoginPage component rendered");
  const navigate = useNavigate();
  const { authenticate, showWidgetModal } = useOkto();

  const [authToken, setAuthToken] = useState();
  const BASE_URL = "https://sandbox-api.okto.tech";
  const OKTO_CLIENT_API = "b9b928ee-9b60-4e34-bb2d-4398dfcb012c";

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  };

  const apiService = axios.create({
    baseURL: BASE_URL,
    headers: {
      "x-api-key": OKTO_CLIENT_API,
      "Content-Type": "application/json",
    },
  });
  const connectWallet = async () => {
    try {
      await connect(); // Initiates the wallet connection
      console.log("Wallet connected!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);

    const idToken = credentialResponse.credential;
    console.log(idToken);
    console.log("google idtoken: ", idToken);
    authenticate(
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4YTQyMWNhZmJlM2RkODg5MjcxZGY5MDBmNGJiZjE2ZGI1YzI0ZDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQzMjUyMTU1NjcxMDAyNTkwMDciLCJlbWFpbCI6Im5pZmVtaW9sYWl5YUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImI5OTVOekVhZGpOQWlwLXBfZzA0VXciLCJpYXQiOjE3MjgzOTI4ODksImV4cCI6MTcyODM5NjQ4OX0.HSTVbBweUnZcuMYzWPHxOM8N1UGfuViU0MjK0iB4aBTELN9jHlE4hSnzaVgxGqKK5A2t1bFt0lHuGUUEzdM_AxsBA3fgo4B0TyBKKN35Z4UjLrD2yrC1ep_onUKWkIxL1aN6MJfsZUM1AsGtkak36kbk15xIrtbbLMqcFeje-xLV9cVfxm_99nCCraDpAClAURIvBkL_GpR-QQQiLdAaAf8MQBtc9_4gak6S4fYzqMaF0vVoZwKmaTMNrOkCd2FzMZ6XIvcvOvJM0xByQ9PnQcmiELS2xbhFG_1NLx8JlwhtyXv1TOcedswMBFhxlFs0rC0YaM88Sj5iJGjq7f7NbQ",
      async (authResponse, error) => {
        if (authResponse) {
          console.log("auth token received", authToken);
          navigate("/profile");
        }
        if (error) {
          console.error("Authentication error:", error);
        }
      }
    );
  };

  return (
    <div style={containerStyle}>
      <h1>Login</h1>
      <button onClick={showWidgetModal()}>connectWallet</button>
      {!authToken ? (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(error) => {
            console.log("Login Failed", error);
          }}
          useOneTap
          promptMomentNotification={(notification) =>
            console.log("Prompt moment notification:", notification)
          }
        />
      ) : (
        <> Authenticated </>
      )}
    </div>
  );
}
export default LoginPage;
