import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
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
import { useState, useEffect } from "react";
import axios from "axios";
import PostDetailPage from "./pages/PostDetailPage";
import feather from 'feather-icons';
import './styles/admin.css';
import './styles/auth.css';
import FriendkitNavbar from "./components/FriendkitNavbar";
import Error404Page from "./pages/Error404Page";

function App() {
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();

	// Retrieve language from localStorage or default to English
	const savedLanguage = localStorage.getItem('language') || 'en';
	i18n.changeLanguage(savedLanguage);

	useEffect(() => { feather.replace(); });

	return (
		<I18nextProvider i18n={i18n}>
			<div className="relative w-full">
				<FriendkitNavbar />
				<Routes>
					<Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
					<Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
					<Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
					<Route 
						path=":username" 
						element={user ? (
							<>
								<UserPage />
								<CreatePost />
							</>
						) : (
							<UserPage />
						)} 
					/>
					<Route path=":username/post/:pid" element={<PostPage />} />
					<Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
					<Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
					<Route path="/verify-email/:id" element={<VerifyEmail />} />
					<Route path="/tv" element={user && user.role === "admin" ? <TVPage /> : <Navigate to="/" />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/admin" element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
					<Route path="/post/:postId" element={<PostDetailPage />} />
					<Route path="*" element={<Error404Page />} />
				</Routes>
				{/* Add ReviewModal outside the Container to ensure it can appear over any content */}
				{user && user.role === "admin" && <ReviewModal />}
			</div>
		</I18nextProvider>
	);
}

export default App;
