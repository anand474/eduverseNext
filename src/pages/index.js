import React, { useState } from "react";
import WelcomePage from "./welcome";
import Login from "./login";

export default function Basic() {
  const [showLogin, setShowLogin] = useState(false);

  const navigateToLogin = () => {
    setShowLogin(true);
  };

  return (
    <>
      {showLogin ? (
        <Login />
      ) : (
        <WelcomePage onProceedToLogin={navigateToLogin} />
      )}
    </>
  );
}
