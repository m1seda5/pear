import React from 'react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const Conversation = ({ conversation, isOnline, onClick, isMonitoring }) => {
  const currentUser = useRecoilValue(userAtom);
  const { t } = useTranslation();

  const getConversationName = () => {
    if (conversation.isGroup) {
      return conversation.groupName;
    }
    return conversation.participants[0].username;
  };

  const getConversationAvatar = () => {
    if (conversation.isGroup) {
      return conversation.groupAvatar || "/default-group.png";
    }
    return conversation.participants[0].profilePic;
  };

  const getLastMessage = () => {
    if (!conversation.lastMessage) return "";
    if (conversation.lastMessage.sender === currentUser._id) {
      return t("You") + ": " + conversation.lastMessage.text;
    }
    return conversation.lastMessage.text;
  };

  const getUnreadCount = () => {
    if (!conversation.unreadCount || conversation.unreadCount === 0) return null;
    return (
      <div className="friendkit-unread-count">
        {conversation.unreadCount}
      </div>
    );
  };

  return (
    <div 
      className={`conversation-item${isOnline ? ' is-online' : ''}${conversation.unreadCount > 0 ? ' has-unread' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        <img src={getConversationAvatar()} alt={getConversationName()} />
        {isOnline && <div className="online-indicator"></div>}
      </div>
      <div className="conversation-content">
        <div className="conversation-header">
          <h3>{getConversationName()}</h3>
          {conversation.lastMessage && (
            <span className="time">
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt))} {t("ago")}
            </span>
          )}
        </div>
        <div className="conversation-message">
          <p>{getLastMessage()}</p>
          {getUnreadCount()}
        </div>
      </div>
      {isMonitoring && (
        <div className="monitoring-badge">
          <i data-feather="eye"></i>
        </div>
      )}
    </div>
  );
};

export default Conversation;