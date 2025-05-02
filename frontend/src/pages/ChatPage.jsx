import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import conversationsAtom from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";

const ChatPage = () => {
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();
	const location = useLocation();
	const navigate = useNavigate();
	const [isMonitoring, setIsMonitoring] = useState(false);

	useEffect(() => {
		const recipient = location.state?.recipient;
		if (recipient && !isMonitoring) {
			handleUserSelect(recipient);
			navigate(location.pathname, { replace: true, state: { fromSearch: location.state?.fromSearch } });
		}
	}, [location.state]);

	useEffect(() => {
		if (socket && conversations) {
			const groupIds = conversations.filter(conv => conv.isGroup && !conv.mock).map(conv => conv._id);
			if (groupIds.length > 0) {
				socket.emit("joinGroups", groupIds);
			}
		}
	}, [socket, conversations]);

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
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				setConversations([]);
			} finally {
				setLoadingConversations(false);
			}
		};
		getConversations();
	}, [currentUser.token, isMonitoring, setConversations]);

	// Handle selecting a conversation
	const handleConversationClick = (conversation) => {
		setSelectedConversation(conversation);
	};

	return (
		<div className="chat-wrapper is-standalone">
			<div className="chat-inner">
				{/* Chat sidebar */}
				<div id="chat-sidebar" className="users-sidebar">
					<a href="/" className="header-item">
						<img src="/logo.svg" alt="Logo" />
					</a>
					<div className="conversations-list has-slimscroll-xs">
						{loadingConversations ? (
							<div className="friendkit-loading-wrapper"><div className="friendkit-loader"></div></div>
						) : conversations.length === 0 ? (
							<div className="empty-state"><div className="empty-state-content"><h3>No conversations</h3></div></div>
						) : (
							conversations.map((conv) => (
								<div
									key={conv._id}
									className={`conversation-item${selectedConversation?._id === conv._id ? " is-active" : ""}`}
									onClick={() => handleConversationClick(conv)}
								>
									<div className="conversation-avatar">
										<img src={conv.isGroup ? conv.groupAvatar || "/default-group.png" : conv.participants[0]?.profilePic || "/default-avatar.png"} alt="" />
									</div>
									<div className="conversation-info">
										<div className="conversation-title">
											{conv.isGroup ? conv.groupName : conv.participants[0]?.username}
										</div>
										<div className="conversation-last">
											{conv.lastMessage?.text || "No messages yet."}
										</div>
									</div>
								</div>
							))
						)}
					</div>
					<div className="footer-item">
						<div className="add-button" onClick={() => setIsMonitoring(!isMonitoring)}>
							<i data-feather="user"></i>
						</div>
					</div>
				</div>
				{/* Chat body */}
				<div id="chat-body" className="chat-body is-opened">
					{selectedConversation ? (
						<div className="conversation-body">
							<div className="conversation-header">
								<div className="conversation-header-avatar">
									<img src={selectedConversation.isGroup ? selectedConversation.groupAvatar || "/default-group.png" : selectedConversation.participants[0]?.profilePic || "/default-avatar.png"} alt="" />
								</div>
								<div className="conversation-header-info">
									<h4>{selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.participants[0]?.username}</h4>
									<span>{selectedConversation.isGroup ? "Group" : "Direct Message"}</span>
								</div>
							</div>
							<div className="messages-list has-slimscroll-xs">
								{/* Render messages here (placeholder) */}
								<div className="message-item">No messages yet.</div>
							</div>
							<div className="chat-action">
								<div className="chat-action-inner">
									<div className="control">
										<textarea className="textarea comment-textarea" rows="1" placeholder="Type a message..."></textarea>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="empty-state"><div className="empty-state-content"><h3>Select a conversation</h3></div></div>
					)}
				</div>
				{/* Chat panel (details) - placeholder */}
				<div id="chat-panel" className="chat-panel is-opened">
					<div className="panel-inner">
						<div className="panel-header">
							<h3>Details</h3>
							<div className="panel-close"><i data-feather="x"></i></div>
						</div>
						{/* Details content placeholder */}
						<div className="panel-content"><span>No details yet.</span></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;