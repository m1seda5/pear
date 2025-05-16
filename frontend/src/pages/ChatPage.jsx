import { ViewIcon, AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Skeleton, SkeletonCircle, Text, useColorModeValue, useColorMode } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import GroupCreationModal from "../components/GroupCreationModal";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useTranslation } from 'react-i18next';
import { useSocket } from "../context/SocketContext";
import UserSearch from "../components/UserSearch";
import { useLocation, useNavigate } from "react-router-dom";
import _ from 'lodash';

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
  const { colorMode } = useColorMode();
  const pinkMode = typeof window !== 'undefined' && localStorage.getItem('pinkMode') === 'true';

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
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
      bg={pinkMode && colorMode === 'light' ? '#e9a1ba' : cardBg}
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex position="relative" justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.100")}>
          {isMonitoring ? t("Monitoring Conversations") : t("Your Conversations")}
        </Text>
        
        <Flex gap={2}>
          {currentUser?.role === "admin" && !isMonitoring && (
            <IconButton
              icon={<ViewIcon />}
              aria-label="Monitor conversations"
              onClick={() => setIsMonitoring(true)}
              size="sm"
              variant="ghost"
            />
          )}
          {isMonitoring && (
            <Button
              onClick={() => {
                setIsMonitoring(false);
                setSelectedConversation({});
              }}
              size="sm"
              variant="outline"
              colorScheme="red"
            >
              {t("Exit Monitoring")}
            </Button>
          )}
          {['admin', 'teacher'].includes(currentUser.role) && !isMonitoring && (
            <IconButton
              icon={<AddIcon />}
              aria-label="Create group"
              onClick={() => setIsGroupCreationOpen(true)}
              size="sm"
              variant="ghost"
            />
          )}
        </Flex>
      </Flex>

      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
          {!isMonitoring && (
            <Box mb={2}>
              <UserSearch 
                onUserSelect={handleUserSelect}
                placeholder={t('Search for a user')}
                excludeIds={[currentUser._id]}
              />
            </Box>
          )}

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations && Array.isArray(conversations) &&
            conversations?.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
                conversation={conversation}
                onClick={() => handleConversationClick(conversation)}
                isMonitoring={isMonitoring}
                bg={subtleBg}
                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                mb={2}
              />
            ))
          }

          {!loadingConversations && (!Array.isArray(conversations) || conversations.length === 0) && (
            <Text fontSize="sm" color="gray.500" p={2}>
              {isMonitoring ? t("No conversations to monitor") : t("No conversations found")}
            </Text>
          )}
        </Flex>

        {!selectedConversation._id ? (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>
              {isMonitoring 
                ? t("Select a conversation to monitor") 
                : t("Select a conversation to start messaging")}
            </Text>
          </Flex>
        ) : (
          <MessageContainer isMonitoring={isMonitoring} />
        )}

        <GroupCreationModal 
          isOpen={isGroupCreationOpen}
          onClose={() => setIsGroupCreationOpen(false)}
          onGroupCreated={(newGroup) => {
            setConversations(prev => [newGroup, ...prev]);
            setIsGroupCreationOpen(false);
          }}
        />
      </Flex>
    </Box>
  );
};

export default ChatPage;