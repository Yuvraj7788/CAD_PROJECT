import React from "react";
import { useEffect } from "react";
import GoogleButton from "react-google-button";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import pageBG from "../assets/app-bg.jpg";
import logo from "../assets/cad-logo.png";
import { useNavigate } from "react-router-dom";
import "../App.css";
export default function Auth() {
  let auth = getAuth();
  let googleProvider = new GoogleAuthProvider();
  let navigate = useNavigate();
  const signUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        navigate("/drive");
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url(${pageBG})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <img className="app-logo" src={logo} alt="APP-LOGO" />
      </div>
      <h1 className="heading" style={{ color: "white" }}>
        Welcome to Fire<strong>Drive</strong>
      </h1>
      <div className="auth-btn">
        <h1 style={{ color: "white" }}>Sign In with Google</h1>
        <GoogleButton
          type="dark" // can be light or dark
          onClick={signUp}
        />
      </div>
    </div>
  );
}
