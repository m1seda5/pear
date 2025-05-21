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
import { useToast } from "react-hot-toast";
import { useContext } from "react";
import { CompetitionContext, PointPopUpContext } from "../contexts/CompetitionContext";

const MessageContainer = ({ isMonitoring }) => {
  const showToast = useShowToast();
  const { selectedConversation } = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { competitionActive, updatePoints, triggerPopUp } = useContext(CompetitionContext);
  const { colorMode } = useContext(PointPopUpContext);

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
    if (socket) {
      socket.on("messageReceived", (data) => {
        setMessages((prev) => [...prev, data.message]);
      });

      socket.on("typing", () => setIsTyping(true));
      socket.on("stopTyping", () => setIsTyping(false));

      socket.on("pointsUpdate", (data) => {
        if (competitionActive) {
          updatePoints(data.points);
          triggerPopUp(data.points, colorMode);
          showToast("Success", data.message, "success");
        }
      });

      return () => {
        socket.off("messageReceived");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("pointsUpdate");
      };
    }
  }, [socket, competitionActive, updatePoints, triggerPopUp, colorMode, showToast]);

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
    if (selectedConversation._id) {
      if (selectedConversation.isGroup) {
        socket?.emit("joinGroup", selectedConversation._id);
      } else {
        socket?.emit("joinChat", selectedConversation._id);
      }
    }
  }, [selectedConversation._id, selectedConversation.isGroup, socket]);

  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.50", "gray.dark")}
      borderRadius="md"
      p={2}
      flexDirection="column"
    >
      {isMonitoring && (
        <Flex bg="yellow.100" p={2} borderRadius="md" mb={2}>
          <Text fontSize="sm" fontWeight="bold">
            🔒 Monitoring Mode - Read Only
          </Text>
        </Flex>
      )}

      {selectedConversation.isGroup ? (
        <GroupMessageHeader conversation={selectedConversation} />
      ) : (
        <Flex w="full" h={12} alignItems="center" gap={2}>
          <Avatar src={selectedConversation.userProfilePic} size="sm" />
          <Text display="flex" alignItems="center">
            {selectedConversation.username}
            {currentUser?.role === "admin" && (
              <Image src="/verified.png" w={4} h={4} ml={1} />
            )}
          </Text>
        </Flex>
      )}

      <Divider />

      <Flex
        flexDir="column"
        gap={4}
        my={4}
        p={2}
        height="400px"
        overflowY="auto"
        sx={messageContainerStyles}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems="center"
              p={1}
              borderRadius="md"
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir="column" gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages && messages && Array.isArray(messages) && messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            ownMessage={currentUser._id === message.sender?._id}
            onDelete={isMonitoring ? null : handleDelete}
          />
        ))}

        {isTyping && (
          <Flex gap={2} alignSelf="flex-start" alignItems="center" p={2}>
            <Avatar 
              src={selectedConversation.userProfilePic} 
              size="sm"
            />
            <Flex gap={1} bg="gray.100" p={2} borderRadius="xl" alignItems="center">
              <Box w={2} h={2} bg="gray.400" borderRadius="full" animation="bounce 0.8s infinite"/>
              <Box w={2} h={2} bg="gray.400" borderRadius="full" animation="bounce 0.8s infinite 0.2s"/>
              <Box w={2} h={2} bg="gray.400" borderRadius="full" animation="bounce 0.8s infinite 0.4s"/>
            </Flex>
          </Flex>
        )}
        <div ref={messageEndRef} />
      </Flex>

      {!isMonitoring && <MessageInput setMessages={setMessages} />}
    </Flex>
  );
};

export default MessageContainer;