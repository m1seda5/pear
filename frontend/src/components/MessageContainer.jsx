import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";
import GroupMessageHeader from "./GroupMessageHeader";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { BsCheck2All } from "react-icons/bs";
import { FaPaperclip, FaImage, FaVideo, FaMapMarkerAlt } from "react-icons/fa";

const MessageContainer = ({ isMonitoring }) => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef();
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const messageContainerStyles = {
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: useColorModeValue('gray.300', 'gray.600'),
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: useColorModeValue('gray.400', 'gray.500'),
    },
    overflowX: 'hidden',
    scrollBehavior: 'smooth',
    overscrollBehavior: 'contain'
  };

  const handleDelete = async (messageId) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete the message");
      }

      setMessages((prev) => prev.filter((message) => message._id !== messageId));
      showToast("Success", "Message deleted successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (selectedConversation.isGroup && selectedConversation._id) {
      socket?.emit("joinGroup", selectedConversation._id);
    }
  }, [selectedConversation, socket]);


  useEffect(() => {
    // In MessageContainer.jsx
    // Update handleDirectMessage
    const handleDirectMessage = (message) => {
      if (message.sender._id === currentUser._id) return; // Skip current user's messages
      
      // Strictly verify this is for the current direct conversation
      if (!selectedConversation.isGroup && 
          message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
        
        // Sound notification if window is not focused
        if (!document.hasFocus()) {
          const sound = new Audio(messageSound);
          sound.play();
        }
        
        // Update conversation list
        setConversations((prev) => {
          return prev.map((conversation) => {
            if (conversation._id === message.conversationId) {
              return {
                ...conversation,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              };
            }
            return conversation;
          });
        });
      }
    };
    
    // In MessageContainer.jsx
    // Update handleGroupMessage
    const handleGroupMessage = (data) => {
      if (data.message.sender._id === currentUser._id) return; // Skip current user's messages
      
      // Strictly verify this is for the current group conversation
      if (selectedConversation.isGroup && 
          selectedConversation._id === data.conversation._id) {
        setMessages((prev) => [...prev, data.message]);
        
        // Sound notification if window is not focused
        if (!document.hasFocus()) {
          const sound = new Audio(messageSound);
          sound.play();
        }
        
        // Update conversation list
        setConversations((prev) => {
          return prev.map((conversation) => {
            if (conversation._id === data.conversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: data.message.text,
                  sender: data.message.sender,
                },
              };
            }
            return conversation;
          });
        });
      }
    };
    
    socket?.on("newMessage", handleDirectMessage);
    socket?.on("newGroupMessage", handleGroupMessage);
    
    return () => {
      socket?.off("newMessage", handleDirectMessage);
      socket?.off("newGroupMessage", handleGroupMessage);
    };
  }, [socket, selectedConversation, setConversations, currentUser._id]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;

    if (lastMessageIsFromOtherUser && selectedConversation._id) {
      socket?.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    const handleMessagesSeen = ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          return prev.map((message) => {
            if (!message.seen) {
              return { ...message, seen: true };
            }
            return message;
          });
        });
      }
    };

    socket?.on("messagesSeen", handleMessagesSeen);
    return () => socket?.off("messagesSeen", handleMessagesSeen);
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
    
        const endpoint = selectedConversation.isGroup 
          ? `/api/messages/groups/${selectedConversation._id}/messages`
          : `/api/messages/${selectedConversation.userId}`;
    
        const res = await fetch(endpoint, {
          headers: { 
            'Authorization': `Bearer ${currentUser.token}` 
          },
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
    
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (selectedConversation._id) getMessages();
  }, [showToast, selectedConversation, currentUser.token]);

  useEffect(() => {
    socket?.on("typing", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setIsTyping(true);
      }
    });
    
    socket?.on("stopTyping", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket, selectedConversation._id]);

  useEffect(() => {
    if (selectedConversation._id) {
      if (selectedConversation.isGroup) {
        socket?.emit("joinGroup", selectedConversation._id);
      } else {
        socket?.emit("joinChat", selectedConversation._id);
      }
    }
  }, [selectedConversation._id, selectedConversation.isGroup, socket]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation._id) return;
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) {
          showToast(t("Error"), data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast(t("Error"), error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [selectedConversation._id, showToast, t]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (selectedConversation._id === newMessage.conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, selectedConversation._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    setSendingMessage(true);

    try {
      const formData = new FormData();
      formData.append("text", newMessage);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch(`/api/messages/${selectedConversation._id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        showToast(t("Error"), data.error, "error");
        return;
      }

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setSelectedFile(null);
      setFilePreview(null);

      // Update last message in conversations
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: newMessage,
                sender: currentUser._id,
              },
            };
          }
          return conversation;
        });
      });
    } catch (error) {
      showToast(t("Error"), error.message, "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="message-container">
      {/* Messages header */}
      <div className="message-header">
        <div className="message-header-content">
          <div className="message-header-avatar">
            <img 
              src={selectedConversation.isGroup 
                ? selectedConversation.groupAvatar || "/default-group.png"
                : selectedConversation.userProfilePic} 
              alt={selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.username} 
            />
          </div>
          <div className="message-header-info">
            <h3>{selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.username}</h3>
            <p>{selectedConversation.isGroup ? t("Group Chat") : t("Direct Message")}</p>
          </div>
        </div>
        <div className="message-header-actions">
          <button className="button is-icon">
            <i data-feather="phone"></i>
          </button>
          <button className="button is-icon">
            <i data-feather="video"></i>
          </button>
          <button className="button is-icon">
            <i data-feather="more-vertical"></i>
          </button>
        </div>
      </div>

      {/* Messages body */}
      <div className="message-body">
        {loadingMessages ? (
          <div className="loading-wrapper">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="loading-message">
                <div className="loading-avatar"></div>
                <div className="loading-content">
                  <div className="loading-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`message-item ${message.sender === currentUser._id ? 'is-sent' : 'is-received'}`}
              >
                <div className="message-avatar">
                  <img 
                    src={message.sender === currentUser._id 
                      ? currentUser.profilePic 
                      : selectedConversation.isGroup 
                        ? message.senderProfilePic 
                        : selectedConversation.userProfilePic} 
                    alt={message.sender === currentUser._id ? currentUser.username : message.senderUsername} 
                  />
                </div>
                <div className="message-content">
                  {message.text && <p>{message.text}</p>}
                  {message.img && (
                    <div className="message-image">
                      <img src={message.img} alt="Message attachment" />
                    </div>
                  )}
                  <div className="message-meta">
                    <span className="time">
                      {formatDistanceToNow(new Date(message.createdAt))} {t("ago")}
                    </span>
                    {message.sender === currentUser._id && (
                      <span className="status">
                        <BsCheck2All className={message.seen ? 'is-seen' : ''} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="message-input">
        <form onSubmit={handleSendMessage}>
          <div className="field">
            <div className="control">
              <textarea
                className="textarea"
                rows="1"
                placeholder={t("Type a message...")}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="message-actions">
            <div className="message-attachments">
              <button 
                type="button" 
                className="button is-icon"
                onClick={() => fileInputRef.current.click()}
              >
                <i data-feather="paperclip"></i>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                style={{ display: 'none' }}
              />
            </div>
            <button 
              type="submit" 
              className="button is-solid primary-button"
              disabled={sendingMessage || (!newMessage.trim() && !selectedFile)}
            >
              {sendingMessage ? t("Sending...") : t("Send")}
            </button>
          </div>
        </form>
        {filePreview && (
          <div className="file-preview">
            <img src={filePreview} alt="Preview" />
            <button 
              className="button is-icon is-danger"
              onClick={() => {
                setSelectedFile(null);
                setFilePreview(null);
              }}
            >
              <i data-feather="x"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;