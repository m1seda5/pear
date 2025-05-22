import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import ForgotPassword from '../components/ForgotPassword';
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  const navigate = useNavigate();

  const handleLogin = () => {
    // After successful login:
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || '/';
    navigate(redirectUrl);
  };

  return (
    <>
      {authScreenState === "login" && <LoginCard onLogin={handleLogin} />}
      {authScreenState === "signup" && <SignupCard />}
      {authScreenState === "forgot" && <ForgotPassword />}
    </>
  );
};

export default AuthPage;