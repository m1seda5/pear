import { useEffect, useState } from 'react';
import { ChakraProvider, Box, Text, VStack, Button, useToast, Container } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
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
import QuickLogin from "./pages/QuickLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Global error handler
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 502 || error.response?.status === 503) {
      // Show toast for server issues
      const toast = useToast();
      toast({
        title: "Server is temporarily unavailable",
        description: "Please try again in a few moments",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    return Promise.reject(error);
  }
);

function ServerStatus() {
  const [isServerUp, setIsServerUp] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkServer = async () => {
    setIsChecking(true);
    try {
      await axios.get('https://pear-tsk2.onrender.com/api/health');
      setIsServerUp(true);
    } catch (error) {
      setIsServerUp(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServer();
    // Check every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isServerUp) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="red.500"
      color="white"
      p={2}
      zIndex={9999}
      textAlign="center"
    >
      <VStack spacing={2}>
        <Text>Server is currently unavailable. Some features may not work.</Text>
        <Button
          size="sm"
          colorScheme="whiteAlpha"
          onClick={checkServer}
          isLoading={isChecking}
        >
          Retry Connection
        </Button>
      </VStack>
    </Box>
  );
}

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
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
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const { data } = await axios.get("/api/messages/unread-count");
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
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

  const shouldUseFullWidth = isTVPage || isAdminDashboard;

  if (!isI18nReady) {
    return null; // or a loading spinner
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <SocketContextProvider>
            <ServerStatus />
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
                    <Route path="/quick-login" element={<QuickLogin />} />
                  </Routes>
                </Box>
                {!isTVPage && isPotentialReviewer && <ReviewModal />}
              </Box>
            </I18nextProvider>
          </SocketContextProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;