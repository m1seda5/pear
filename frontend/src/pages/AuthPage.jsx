import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import ForgotPassword from '../components/ForgotPassword';
import authScreenAtom from "../atoms/authAtom";
import { useEffect } from "react";
import feather from 'feather-icons';
import '../styles/auth.css';

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  
  useEffect(() => {
    // Initialize Feather Icons
    feather.replace();
  }, [authScreenState]);

  return (
    <>
      {/* Fake navigation */}
      <div className="fake-nav">
        <a href="/" className="logo">
          <img
            className="light-image"
            src="/logo.png"
            width="112"
            height="28"
            alt="Pear Network"
          />
          <img
            className="dark-image"
            src="/logo-dark.png"
            width="112"
            height="28"
            alt="Pear Network"
          />
        </a>
      </div>

      <div className="auth-container">
        {authScreenState === "login" && <LoginCard />}
        {authScreenState === "signup" && <SignupCard />}
        {authScreenState === "forgot" && <ForgotPassword />}
      </div>
    </>
  );
};

export default AuthPage;