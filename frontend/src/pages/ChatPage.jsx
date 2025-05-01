import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import conversationsAtom from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import UserSearch from "../components/UserSearch";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import GroupCreationModal from "../components/GroupCreationModal";
import { ViewIcon, AddIcon } from "@chakra-ui/icons";

const ChatPage = () => {
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const [isGroupCreationOpen, setIsGroupCreationOpen] = useState(false);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);
	const [isMonitoring, setIsMonitoring] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	// Color mode values
	const cardBg = useColorModeValue("white", "gray.800");
	const subtleBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	// Handle recipient from navigation state
	useEffect(() => {
		const recipient = location.state?.recipient;
		if (recipient && !isMonitoring) {
			handleUserSelect(recipient);
			// Clear the state to prevent re-triggering on refresh
			navigate(location.pathname, { replace: true, state: { fromSearch: location.state?.fromSearch } });
		}
	}, [location.state]);

	useEffect(() => {
		if (socket && conversations) {
			const groupIds = conversations
				.filter(conv => conv.isGroup && !conv.mock)
				.map(conv => conv._id);
			
			if (groupIds.length > 0) {
				socket.emit("joinGroups", groupIds);
			}
		}
	}, [socket, conversations]);

	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setLanguage(lng);
		};

		i18n.on('languageChanged', handleLanguageChange);
		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	useEffect(() => {
		const handleMessagesSeen = ({ conversationId }) => {
			setConversations((prev) => {
				return prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
			});
		};

		const handleGroupUpdate = (updatedGroup) => {
			setConversations((prev) => {
				return prev.map((conversation) => {
					if (conversation._id === updatedGroup._id) {
						return {
							...conversation,
							participants: updatedGroup.participants,
							groupName: updatedGroup.groupName,
							groupAdmin: updatedGroup.groupAdmin,
							lastMessage: updatedGroup.lastMessage || conversation.lastMessage,
						};
					}
					return conversation;
				});
			});

			if (selectedConversation._id === updatedGroup._id) {
				setSelectedConversation(prev => ({
					...prev,
					participants: updatedGroup.participants,
					groupName: updatedGroup.groupName,
					groupAdmin: updatedGroup.groupAdmin,
				}));
			}
		};

		socket?.on("messagesSeen", handleMessagesSeen);
		socket?.on("groupUpdated", handleGroupUpdate);

		return () => {
			socket?.off("messagesSeen", handleMessagesSeen);
			socket?.off("groupUpdated", handleGroupUpdate);
		};
	}, [socket, setConversations, selectedConversation._id, setSelectedConversation]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const endpoint = isMonitoring 
					? "/api/messages/admin/conversations"
					: "/api/messages/conversations";

				const res = await fetch(endpoint, {
					headers: { 'Authorization': `Bearer ${currentUser.token}` },
				});
				
				const data = await res.json();
				
				if (!res.ok) {
					showToast(t("Error"), data.error || t("Failed to fetch conversations"), "error");
					setConversations([]); // Reset to empty array on error
					return;
				}

				// Ensure data is an array before setting
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast(t("Error"), error.message, "error");
				setConversations([]); // Reset to empty array on error
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations, t, currentUser.token, isMonitoring]);

	// Handle selecting a user from search results
	const handleUserSelect = async (selectedUser) => {
		if (selectedUser._id === currentUser._id) {
			showToast(t("Error"), t("You cannot message yourself"), "error");
			return;
		}

		// Check if conversation already exists
		const conversationAlreadyExists = conversations.find((conversation) => {
			if (conversation.isGroup) {
				return false;
			}
			return conversation.participants[0]._id === selectedUser._id;
		});

		if (conversationAlreadyExists) {
			setSelectedConversation({
				_id: conversationAlreadyExists._id,
				userId: selectedUser._id,
				username: selectedUser.username,
				userProfilePic: selectedUser.profilePic,
				isGroup: false,
			});
			return;
		}

		// Create a mock conversation for immediate UI feedback
		const mockConversation = {
			mock: true,
			lastMessage: {
				text: "",
				sender: "",
			},
			_id: Date.now(),
			isGroup: false,
			participants: [
				{
					_id: selectedUser._id,
					username: selectedUser.username,
					profilePic: selectedUser.profilePic,
				},
			],
		};
		setConversations((prevConvs) => [...prevConvs, mockConversation]);
		
		// Auto-select the new conversation
		setSelectedConversation({
			_id: mockConversation._id,
			userId: selectedUser._id,
			username: selectedUser.username,
			userProfilePic: selectedUser.profilePic,
			isGroup: false,
		});
	};

	const handleConversationClick = async (conversation) => {
		if (isMonitoring) {
			try {
				const res = await fetch(`/api/messages/notify-monitoring/${conversation._id}`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${currentUser.token}`,
						'Content-Type': 'application/json'
					}
				});

				if (!res.ok) {
					const data = await res.json();
					showToast("Error", data.error || "Failed to send monitoring notification", "error");
					return;
				}
				
				showToast("Success", "Monitoring notification sent", "success");
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		}
		
		if (conversation.isGroup) {
			setSelectedConversation({
				_id: conversation._id,
				isGroup: true,
				groupName: conversation.groupName,
				participants: conversation.participants || [],
				groupAdmin: conversation.groupAdmin,
				lastMessage: conversation.lastMessage || {},
			});
		} else {
			setSelectedConversation({
				_id: conversation._id,
				userId: conversation.participants[0]._id,
				username: conversation.participants[0].username,
				userProfilePic: conversation.participants[0].profilePic,
				isGroup: false,
			});
		}
	};

	return (
		<div className="view-wrapper">
			<div id="main-feed" className="container">
				<div id="activity-feed" className="view-wrap true-dom">
					<div className="columns">
						{/* Left side column */}
						<div className="column is-3 is-hidden-mobile">
							{/* Chat sidebar */}
							<div className="card">
								<div className="card-heading">
									<h4>{isMonitoring ? t("Monitoring Conversations") : t("Your Conversations")}</h4>
									<div className="dropdown is-spaced is-right is-neutral dropdown-trigger">
										<div>
											<div className="button">
												<i data-feather="more-vertical"></i>
											</div>
										</div>
										<div className="dropdown-menu" role="menu">
											<div className="dropdown-content">
												{currentUser?.role === "admin" && !isMonitoring && (
													<a className="dropdown-item" onClick={() => setIsMonitoring(true)}>
														<div className="media">
															<i data-feather="eye"></i>
															<div className="media-content">
																<h3>{t("Monitor Conversations")}</h3>
																<small>{t("View all conversations")}</small>
															</div>
														</div>
													</a>
												)}
												{isMonitoring && (
													<a className="dropdown-item" onClick={() => {
														setIsMonitoring(false);
														setSelectedConversation({});
													}}>
														<div className="media">
															<i data-feather="x"></i>
															<div className="media-content">
																<h3>{t("Exit Monitoring")}</h3>
																<small>{t("Return to your conversations")}</small>
															</div>
														</div>
													</a>
												)}
												{['admin', 'teacher'].includes(currentUser.role) && !isMonitoring && (
													<a className="dropdown-item" onClick={() => setIsGroupCreationOpen(true)}>
														<div className="media">
															<i data-feather="users"></i>
															<div className="media-content">
																<h3>{t("Create Group")}</h3>
																<small>{t("Start a new group chat")}</small>
															</div>
														</div>
													</a>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="card-body">
									{!isMonitoring && (
										<div className="field">
											<div className="control">
												<UserSearch 
													onUserSelect={handleUserSelect}
													placeholder={t('Search for a user')}
													excludeIds={[currentUser._id]}
												/>
											</div>
										</div>
									)}

									{loadingConversations ? (
										<div className="loading-wrapper">
											{[0, 1, 2, 3, 4].map((_, i) => (
												<div key={i} className="loading-item">
													<div className="loading-avatar"></div>
													<div className="loading-content">
														<div className="loading-text"></div>
														<div className="loading-text"></div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="conversations-list">
											{conversations?.map((conversation) => (
												<Conversation
													key={conversation._id}
													isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
													conversation={conversation}
													onClick={() => handleConversationClick(conversation)}
													isMonitoring={isMonitoring}
												/>
											))}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Center column */}
						<div className="column is-6">
							{!selectedConversation._id ? (
								<div className="empty-state">
									<div className="empty-state-icon">
										<i data-feather="message-circle"></i>
									</div>
									<div className="empty-state-content">
										<h3>
											{isMonitoring 
												? t("Select a conversation to monitor") 
												: t("Select a conversation to start messaging")}
										</h3>
										<p>{t("Choose a conversation from the sidebar to view messages")}</p>
									</div>
								</div>
							) : (
								<MessageContainer isMonitoring={isMonitoring} />
							)}
						</div>

						{/* Right side column */}
						<div className="column is-3">
							{/* Chat info card */}
							{selectedConversation._id && (
								<div className="card">
									<div className="card-heading">
										<h4>{t("Chat Info")}</h4>
									</div>
									<div className="card-body">
										{selectedConversation.isGroup ? (
											<div className="group-info">
												<div className="group-avatar">
													<img src={selectedConversation.groupAvatar || "/default-group.png"} alt="Group" />
												</div>
												<h3>{selectedConversation.groupName}</h3>
												<p>{t("Group Chat")}</p>
												<div className="group-members">
													<h4>{t("Members")}</h4>
													<div className="members-list">
														{selectedConversation.participants?.map((member) => (
															<div key={member._id} className="member-item">
																<img src={member.profilePic} alt={member.username} />
																<span>{member.username}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										) : (
											<div className="user-info">
												<div className="user-avatar">
													<img src={selectedConversation.userProfilePic} alt={selectedConversation.username} />
												</div>
												<h3>{selectedConversation.username}</h3>
												<p>{onlineUsers.includes(selectedConversation.userId) ? t("Online") : t("Offline")}</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<GroupCreationModal 
				isOpen={isGroupCreationOpen}
				onClose={() => setIsGroupCreationOpen(false)}
				onGroupCreated={(newGroup) => {
					setConversations(prev => [newGroup, ...prev]);
					setIsGroupCreationOpen(false);
				}}
			/>
		</div>
	);
};

export default ChatPage;