import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import ForgotPassword from '../components/ForgotPassword';
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  
  return (
    <>
      {authScreenState === "login" && <LoginCard />}
      {authScreenState === "signup" && <SignupCard />}
      {authScreenState === "forgot" && <ForgotPassword />}
    </>
  );
};

export default AuthPage;