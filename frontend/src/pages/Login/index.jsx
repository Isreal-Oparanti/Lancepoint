import React from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";

import { GoogleLogin } from "@react-oauth/google";
// import Transaction from "./transaction"
const LoginPage = ({ setAuthToken, authToken, handleLogout }) => {
  const { getUserDetails, getPortfolio, createWallet, logOut } = useOkto();
console.log(authToken)
  console.log("LoginPage component rendered: ", authToken);
  const navigate = useNavigate();
  const { authenticate } = useOkto();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const fetchWallets = async () => {
    try {
      const walletsData = await createWallet();
      console.log(walletsData);
      setWallets(walletsData);
      setActiveSection("wallets");
    } catch (error) {
      console.log(`Failed to fetch wallets: ${error.message}`);
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("Authentication check: ", authResponse);
        setAuthToken(authResponse.auth_token);
        console.log("auth token received", authToken);
        // navigate("/home");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  const onLogoutClick = () => {
    handleLogout(); // Clear the authToken
    navigate('/'); // Navigate back to the login page
  };

  return (
    <div style={containerStyle}>
       <button  onClick={fetchWallets}>
          View Wallets
        </button>
      <h1>Login</h1>
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
        <button onClick={onLogoutClick}>Authenticated, Logout</button>
      )}

    </div>
  );
}
export default LoginPage;
