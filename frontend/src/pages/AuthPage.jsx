import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import ForgotPassword from '../components/ForgotPassword';
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const postId = queryParams.get('post');
  const redirectPath = queryParams.get('redirect');

  if (postId) {
    try {
      const decodedPostId = atob(postId);
      localStorage.setItem('pendingPost', decodedPostId);
    } catch (e) {
      // ignore decoding errors
    }
  }

  const handleLogin = async () => {
    // After successful login:
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || '/';
    if (success) {
      navigate(redirectPath || (user ? "/" : "/auth"));
    }
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