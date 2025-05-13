// // version 1
// import { Box, Container } from "@chakra-ui/react";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import UserPage from "./pages/UserPage";
// import PostPage from "./pages/PostPage";
// import Header from "./components/Header";
// import HomePage from "./pages/HomePage";
// import AuthPage from "./pages/AuthPage";
// import { useRecoilValue } from "recoil";
// import userAtom from "./atoms/userAtom";
// import UpdateProfilePage from "./pages/UpdateProfilePage";
// import CreatePost from "./components/CreatePost";
// import ChatPage from "./pages/ChatPage";
// import { SettingsPage } from "./pages/SettingsPage";
// function App() {
// 	const user = useRecoilValue(userAtom);
// 	const { pathname } = useLocation();
// 	return (
// 		<Box position={"relative"} w='full'>
// 			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
// 				<Header />
// 				<Routes>
// 					<Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
// 					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
// 					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

// 					<Route
// 						path='/:username'
// 						element={
// 							user ? (
// 								<>
// 									<UserPage />
// 									<CreatePost />
// 								</>
// 							) : (
// 								<UserPage />
// 							)
// 						}
// 					/>
// 					<Route path='/:username/post/:pid' element={<PostPage />} />
// 					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
// 					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
// 				</Routes>
// 			</Container>
// 		</Box>
// 	);
// }

// export default App;




// // version 2 working 
//  import { Box, Container } from "@chakra-ui/react";
//  import { Navigate, Route, Routes, useLocation } from "react-router-dom";
//  import UserPage from "./pages/UserPage";
//  import PostPage from "./pages/PostPage";
//  import Header from "./components/Header";
//  import HomePage from "./pages/HomePage";
//  import AuthPage from "./pages/AuthPage";
//  import { useRecoilValue } from "recoil";
//  import userAtom from "./atoms/userAtom";
//  import UpdateProfilePage from "./pages/UpdateProfilePage";
//  import CreatePost from "./components/CreatePost";
//  import ChatPage from "./pages/ChatPage";
//  import { SettingsPage } from "./pages/SettingsPage";
// import { I18nextProvider } from 'react-i18next';
// import i18n from './i18n';  // Correct path to your i18n.js file

// function App() {
//   const user = useRecoilValue(userAtom);
//   const { pathname } = useLocation();

//   // Retrieve language from localStorage or default to English
//   const savedLanguage = localStorage.getItem('language') || 'en';
//   i18n.changeLanguage(savedLanguage);

//   return (
//     <I18nextProvider i18n={i18n}>
//       <Box position={'relative'} w="full">
//         <Container maxW={pathname === '/' ? { base: '620px', md: '900px' } : '620px'}>
//           <Header />
//           <Routes>
//             <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
//             <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
//             <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
//             <Route path="/:username" element={user ? (
//               <>
//                 <UserPage />
//                 <CreatePost />
//               </>
//             ) : (
//               <UserPage />
//             )} />
//             <Route path="/:username/post/:pid" element={<PostPage />} />
//             <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
//             <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
//           </Routes>
//         </Container>
//       </Box>
//     </I18nextProvider>
//   );
// }

// export default App;


// this is the app.jsx trying out the ne background component
// import { Box, Container } from "@chakra-ui/react";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import UserPage from "./pages/UserPage";
// import PostPage from "./pages/PostPage";
// import Header from "./components/Header";
// import HomePage from "./pages/HomePage";
// import AuthPage from "./pages/AuthPage";
// import { useRecoilValue } from "recoil";
// import userAtom from "./atoms/userAtom";
// import UpdateProfilePage from "./pages/UpdateProfilePage";
// import CreatePost from "./components/CreatePost";
// import ChatPage from "./pages/ChatPage";
// import { SettingsPage } from "./pages/SettingsPage";
// import VerifyEmail from "./pages/VerifyEmail";
// import { I18nextProvider } from 'react-i18next';
// import i18n from './i18n';
// import InactivityBackground from './components/InactivityBackground';
// import ReviewModal from './components/ReviewModal';

// function App() {
//   const user = useRecoilValue(userAtom);
//   const { pathname } = useLocation();

//   // Retrieve language from localStorage or default to English
//   const savedLanguage = localStorage.getItem('language') || 'en';
//   i18n.changeLanguage(savedLanguage);

//   return (
//     <I18nextProvider i18n={i18n}>
//       <Box position={'relative'} w="full">
//         <Container maxW={pathname === '/' ? { base: '620px', md: '900px' } : '620px'}>
//           <Header />
//           <Routes>
//             <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
//             <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
//             <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
//             <Route 
//               path="/:username" 
//               element={user ? (
//                 <>
//                   <UserPage />
//                   <CreatePost />
//                 </>
//               ) : (
//                 <UserPage />
//               )} 
//             />
//             <Route path="/:username/post/:pid" element={<PostPage />} />
//             <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
//             <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
//             {/* New route for email verification - doesn't require auth */}
//             <Route path="/verify-email/:id" element={<VerifyEmail />} />
//           </Routes>
//         </Container>
//         {/* Add ReviewModal outside the Container to ensure it can appear over any content */}
//         {user && user.role === "admin" && <ReviewModal />}
//       </Box>
//     </I18nextProvider>
//   );
// }

// export default App;

// post review 
import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import VerifyEmail from "./pages/VerifyEmail";
import TVPage from "./pages/TVPage";
import ResetPassword from "./pages/ResetPassword";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import ReviewModal from './components/ReviewModal';
import AdminDashboard from "./pages/AdminDashboard";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    // Initialize i18n
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage).then(() => {
      setIsI18nReady(true);
    });
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);

  const isPotentialReviewer = user && (user.role === "admin" || user.role === "teacher" || user.role === "student");
  const isTVPage = pathname === '/tv';
  const isAdminDashboard = pathname === '/admin';

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const { data } = await axios.get("/api/messages/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    if (pathname === '/chat' && user) {
    }
  }, [pathname, user]);

  useEffect(() => {
    // Global error handler for fetch requests
    const handleFetchError = async (error) => {
      if (error.response?.status === 401 && 
         !error.config?.url?.includes('/messages/unread-count')) {
        // Only handle auth errors for non-background requests
        localStorage.removeItem("user-threads");
        setUser(null);
        navigate('/auth');
      }
    };

    // Add global fetch error handler
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason instanceof Response) {
        handleFetchError(event.reason);
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', handleFetchError);
    };
  }, [navigate, setUser]);

  const shouldUseFullWidth = isTVPage || isAdminDashboard;

  if (!isI18nReady) {
    return null; // or a loading spinner
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Box>
        {!isTVPage && <Header unreadCount={unreadCount} />}
        <Box mx="auto" px={4} maxW={shouldUseFullWidth ? "100vw" : "600px"}>
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
            <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
            <Route path="/:username" element={<UserPage />} />
            <Route path="/:username/post/:pid" element={<PostPage />} />
            <Route path="/chat" element={user ? <ChatPage onConversationOpen={fetchUnreadCount} /> : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/tv" element={<TVPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin" element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes>
        </Box>
        {!isTVPage && isPotentialReviewer && <ReviewModal />}
      </Box>
    </I18nextProvider>
  );
}

export default App;