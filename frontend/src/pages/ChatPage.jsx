// working version 
// import { SearchIcon } from "@chakra-ui/icons";
// import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
// import Conversation from "../components/Conversation";
// import { GiConversation } from "react-icons/gi";
// import MessageContainer from "../components/MessageContainer";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";
// import { useSocket } from "../context/SocketContext";

// const ChatPage = () => {
// 	const [searchingUser, setSearchingUser] = useState(false);
// 	const [loadingConversations, setLoadingConversations] = useState(true);
// 	const [searchText, setSearchText] = useState("");
// 	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
// 	const [conversations, setConversations] = useRecoilState(conversationsAtom);
// 	const currentUser = useRecoilValue(userAtom);
// 	const showToast = useShowToast();
// 	const { socket, onlineUsers } = useSocket();

// 	useEffect(() => {
// 		socket?.on("messagesSeen", ({ conversationId }) => {
// 			setConversations((prev) => {
// 				const updatedConversations = prev.map((conversation) => {
// 					if (conversation._id === conversationId) {
// 						return {
// 							...conversation,
// 							lastMessage: {
// 								...conversation.lastMessage,
// 								seen: true,
// 							},
// 						};
// 					}
// 					return conversation;
// 				});
// 				return updatedConversations;
// 			});
// 		});
// 	}, [socket, setConversations]);

// 	useEffect(() => {
// 		const getConversations = async () => {
// 			try {
// 				const res = await fetch("/api/messages/conversations");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				console.log(data);
// 				setConversations(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setLoadingConversations(false);
// 			}
// 		};

// 		getConversations();
// 	}, [showToast, setConversations]);

// 	const handleConversationSearch = async (e) => {
// 		e.preventDefault();
// 		setSearchingUser(true);
// 		try {
// 			const res = await fetch(`/api/users/profile/${searchText}`);
// 			const searchedUser = await res.json();
// 			if (searchedUser.error) {
// 				showToast("Error", searchedUser.error, "error");
// 				return;
// 			}

// 			const messagingYourself = searchedUser._id === currentUser._id;
// 			if (messagingYourself) {
// 				showToast("Error", "You cannot message yourself", "error");
// 				return;
// 			}

// 			const conversationAlreadyExists = conversations.find(
// 				(conversation) => conversation.participants[0]._id === searchedUser._id
// 			);

// 			if (conversationAlreadyExists) {
// 				setSelectedConversation({
// 					_id: conversationAlreadyExists._id,
// 					userId: searchedUser._id,
// 					username: searchedUser.username,
// 					userProfilePic: searchedUser.profilePic,
// 				});
// 				return;
// 			}

// 			const mockConversation = {
// 				mock: true,
// 				lastMessage: {
// 					text: "",
// 					sender: "",
// 				},
// 				_id: Date.now(),
// 				participants: [
// 					{
// 						_id: searchedUser._id,
// 						username: searchedUser.username,
// 						profilePic: searchedUser.profilePic,
// 					},
// 				],
// 			};
// 			setConversations((prevConvs) => [...prevConvs, mockConversation]);
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		} finally {
// 			setSearchingUser(false);
// 		}
// 	};

// 	return (
// 		<Box
// 			position={"absolute"}
// 			left={"50%"}
// 			w={{ base: "100%", md: "80%", lg: "750px" }}
// 			p={4}
// 			transform={"translateX(-50%)"}
// 		>
// 			<Flex
// 				gap={4}
// 				flexDirection={{ base: "column", md: "row" }}
// 				maxW={{
// 					sm: "400px",
// 					md: "full",
// 				}}
// 				mx={"auto"}
// 			>
// 				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
// 					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
// 						Your Conversations
// 					</Text>
// 					<form onSubmit={handleConversationSearch}>
// 						<Flex alignItems={"center"} gap={2}>
// 							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
// 							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
// 								<SearchIcon />
// 							</Button>
// 						</Flex>
// 					</form>

// 					{loadingConversations &&
// 						[0, 1, 2, 3, 4].map((_, i) => (
// 							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
// 								<Box>
// 									<SkeletonCircle size={"10"} />
// 								</Box>
// 								<Flex w={"full"} flexDirection={"column"} gap={3}>
// 									<Skeleton h={"10px"} w={"80px"} />
// 									<Skeleton h={"8px"} w={"90%"} />
// 								</Flex>
// 							</Flex>
// 						))}

// 					{!loadingConversations &&
// 						conversations.map((conversation) => (
// 							<Conversation
// 								key={conversation._id}
// 								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
// 								conversation={conversation}
// 							/>
// 						))}
// 				</Flex>
// 				{!selectedConversation._id && (
// 					<Flex
// 						flex={70}
// 						borderRadius={"md"}
// 						p={2}
// 						flexDir={"column"}
// 						alignItems={"center"}
// 						justifyContent={"center"}
// 						height={"400px"}
// 					>
// 						<GiConversation size={100} />
// 						<Text fontSize={20}>Select a conversation to start messaging</Text>
// 					</Flex>
// 				)}

// 				{selectedConversation._id && <MessageContainer />}
// 			</Flex>
// 		</Box>
// 	);
// };

// export default ChatPage;


// version two with transaltions not working for some reason 
// import { SearchIcon } from "@chakra-ui/icons";
// import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
// import Conversation from "../components/Conversation";
// import { GiConversation } from "react-icons/gi";
// import MessageContainer from "../components/MessageContainer";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";
// import { useSocket } from "../context/SocketContext";
// import { useTranslation } from 'react-i18next';  // Import useTranslation

// const ChatPage = () => {
//   const [searchingUser, setSearchingUser] = useState(false);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
//   const [conversations, setConversations] = useRecoilState(conversationsAtom);
//   const currentUser = useRecoilValue(userAtom);
//   const showToast = useShowToast();
//   const { socket, onlineUsers } = useSocket();
//   const { t, i18n } = useTranslation();  // Initialize the translation hook
//   const [language, setLanguage] = useState(i18n.language);  // Track current language

//   // Handle language changes and update the UI accordingly
//   useEffect(() => {
//     const handleLanguageChange = (lng) => {
//       setLanguage(lng);
//     };

//     i18n.on('languageChanged', handleLanguageChange);  // Listen for language change

//     return () => {
//       i18n.off('languageChanged', handleLanguageChange);  // Cleanup on unmount
//     };
//   }, [i18n]);

//   useEffect(() => {
//     socket?.on("messagesSeen", ({ conversationId }) => {
//       setConversations((prev) => {
//         const updatedConversations = prev.map((conversation) => {
//           if (conversation._id === conversationId) {
//             return {
//               ...conversation,
//               lastMessage: {
//                 ...conversation.lastMessage,
//                 seen: true,
//               },
//             };
//           }
//           return conversation;
//         });
//         return updatedConversations;
//       });
//     });
//   }, [socket, setConversations]);

//   useEffect(() => {
//     const getConversations = async () => {
//       try {
//         const res = await fetch("/api/messages/conversations");
//         const data = await res.json();
//         if (data.error) {
//           showToast(t("Error"), data.error, "error");
//           return;
//         }
//         setConversations(data);
//       } catch (error) {
//         showToast(t("Error"), error.message, "error");
//       } finally {
//         setLoadingConversations(false);
//       }
//     };

//     getConversations();
//   }, [showToast, setConversations, t]);

//   const handleConversationSearch = async (e) => {
//     e.preventDefault();
//     setSearchingUser(true);
//     try {
//       const res = await fetch(`/api/users/profile/${searchText}`);
//       const searchedUser = await res.json();
//       if (searchedUser.error) {
//         showToast(t("Error"), searchedUser.error, "error");
//         return;
//       }

//       const messagingYourself = searchedUser._id === currentUser._id;
//       if (messagingYourself) {
//         showToast(t("Error"), t("You cannot message yourself"), "error");
//         return;
//       }

//       const conversationAlreadyExists = conversations.find(
//         (conversation) => conversation.participants[0]._id === searchedUser._id
//       );

//       if (conversationAlreadyExists) {
//         setSelectedConversation({
//           _id: conversationAlreadyExists._id,
//           userId: searchedUser._id,
//           username: searchedUser.username,
//           userProfilePic: searchedUser.profilePic,
//         });
//         return;
//       }

//       const mockConversation = {
//         mock: true,
//         lastMessage: {
//           text: "",
//           sender: "",
//         },
//         _id: Date.now(),
//         participants: [
//           {
//             _id: searchedUser._id,
//             username: searchedUser.username,
//             profilePic: searchedUser.profilePic,
//           },
//         ],
//       };
//       setConversations((prevConvs) => [...prevConvs, mockConversation]);
//     } catch (error) {
//       showToast(t("Error"), error.message, "error");
//     } finally {
//       setSearchingUser(false);
//     }
//   };

//   return (
//     <Box
//       position={"absolute"}
//       left={"50%"}
//       w={{ base: "100%", md: "80%", lg: "750px" }}
//       p={4}
//       transform={"translateX(-50%)"}
//     >
//       <Flex
//         gap={4}
//         flexDirection={{ base: "column", md: "row" }}
//         maxW={{
//           sm: "400px",
//           md: "full",
//         }}
//         mx={"auto"}
//       >
//         <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
//           <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
//             {t("Your Conversations")}
//           </Text>
//           <form onSubmit={handleConversationSearch}>
//             <Flex alignItems={"center"} gap={2}>
//               <Input placeholder={t('Search for a user')} onChange={(e) => setSearchText(e.target.value)} />
//               <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
//                 <SearchIcon />
//               </Button>
//             </Flex>
//           </form>

//           {loadingConversations &&
//             [0, 1, 2, 3, 4].map((_, i) => (
//               <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
//                 <Box>
//                   <SkeletonCircle size={"10"} />
//                 </Box>
//                 <Flex w={"full"} flexDirection={"column"} gap={3}>
//                   <Skeleton h={"10px"} w={"80px"} />
//                   <Skeleton h={"8px"} w={"90%"} />
//                 </Flex>
//               </Flex>
//             ))}

//           {!loadingConversations &&
//             conversations.map((conversation) => (
//               <Conversation
//                 key={conversation._id}
//                 isOnline={onlineUsers.includes(conversation.participants[0]._id)}
//                 conversation={conversation}
//               />
//             ))}
//         </Flex>
//         {!selectedConversation._id && (
//           <Flex
//             flex={70}
//             borderRadius={"md"}
//             p={2}
//             flexDir={"column"}
//             alignItems={"center"}
//             justifyContent={"center"}
//             height={"400px"}
//           >
//             <GiConversation size={100} />
//             <Text fontSize={20}>{t("Select a conversation to start messaging")}</Text>
//           </Flex>
//         )}

//         {selectedConversation._id && <MessageContainer />}
//       </Flex>
//     </Box>
//   );
// };

// export default ChatPage;



// debugging nad fixes that version
// import { SearchIcon } from "@chakra-ui/icons";
// import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
// import Conversation from "../components/Conversation";
// import { GiConversation } from "react-icons/gi";
// import MessageContainer from "../components/MessageContainer";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";
// import { useSocket } from "../context/SocketContext";
// import { useTranslation } from 'react-i18next';  // Import useTranslation

// const ChatPage = () => {
//   const [searchingUser, setSearchingUser] = useState(false);
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
//   const [conversations, setConversations] = useRecoilState(conversationsAtom);
//   const currentUser = useRecoilValue(userAtom); // Get current user details, including the token
//   const showToast = useShowToast();
//   const { socket, onlineUsers } = useSocket();
//   const { t, i18n } = useTranslation();  // Initialize the translation hook
//   const [language, setLanguage] = useState(i18n.language);  // Track current language

//   // Handle language changes and update the UI accordingly
//   useEffect(() => {
//     const handleLanguageChange = (lng) => {
//       setLanguage(lng);
//     };

//     i18n.on('languageChanged', handleLanguageChange);  // Listen for language change

//     return () => {
//       i18n.off('languageChanged', handleLanguageChange);  // Cleanup on unmount
//     };
//   }, [i18n]);

//   useEffect(() => {
//     socket?.on("messagesSeen", ({ conversationId }) => {
//       setConversations((prev) => {
//         const updatedConversations = prev.map((conversation) => {
//           if (conversation._id === conversationId) {
//             return {
//               ...conversation,
//               lastMessage: {
//                 ...conversation.lastMessage,
//                 seen: true,
//               },
//             };
//           }
//           return conversation;
//         });
//         return updatedConversations;
//       });
//     });
//   }, [socket, setConversations]);

//   // Fix for 403 error and ensuring conversations is an array
//   useEffect(() => {
//     const getConversations = async () => {
//       try {
//         const res = await fetch("/api/messages/conversations", {
//           headers: {
//             'Authorization': `Bearer ${currentUser.token}`,  // Ensure token is sent with the request
//           },
//         });
//         const data = await res.json();

//         console.log("Conversations API response:", data);  // Log API response to debug

//         // Check if the data is an array before setting conversations
//         if (!Array.isArray(data)) {
//           showToast(t("Error"), "Unexpected API response format", "error");
//           return;
//         }

//         if (data.error) {
//           showToast(t("Error"), data.error, "error");
//           return;
//         }

//         setConversations(data);  // Set conversations to the returned data
//       } catch (error) {
//         showToast(t("Error"), error.message, "error");
//       } finally {
//         setLoadingConversations(false);  // Stop loading once the request completes
//       }
//     };

//     getConversations();
//   }, [showToast, setConversations, t, currentUser.token]);

//   const handleConversationSearch = async (e) => {
//     e.preventDefault();
//     setSearchingUser(true);
//     try {
//       const res = await fetch(`/api/users/profile/${searchText}`);
//       const searchedUser = await res.json();
//       if (searchedUser.error) {
//         showToast(t("Error"), searchedUser.error, "error");
//         return;
//       }

//       const messagingYourself = searchedUser._id === currentUser._id;
//       if (messagingYourself) {
//         showToast(t("Error"), t("You cannot message yourself"), "error");
//         return;
//       }

//       const conversationAlreadyExists = conversations.find(
//         (conversation) => conversation.participants[0]._id === searchedUser._id
//       );

//       if (conversationAlreadyExists) {
//         setSelectedConversation({
//           _id: conversationAlreadyExists._id,
//           userId: searchedUser._id,
//           username: searchedUser.username,
//           userProfilePic: searchedUser.profilePic,
//         });
//         return;
//       }

//       const mockConversation = {
//         mock: true,
//         lastMessage: {
//           text: "",
//           sender: "",
//         },
//         _id: Date.now(),
//         participants: [
//           {
//             _id: searchedUser._id,
//             username: searchedUser.username,
//             profilePic: searchedUser.profilePic,
//           },
//         ],
//       };
//       setConversations((prevConvs) => [...prevConvs, mockConversation]);
//     } catch (error) {
//       showToast(t("Error"), error.message, "error");
//     } finally {
//       setSearchingUser(false);
//     }
//   };

//   return (
//     <Box
//       position={"absolute"}
//       left={"50%"}
//       w={{ base: "100%", md: "80%", lg: "750px" }}
//       p={4}
//       transform={"translateX(-50%)"}
//     >
//       <Flex
//         gap={4}
//         flexDirection={{ base: "column", md: "row" }}
//         maxW={{
//           sm: "400px",
//           md: "full",
//         }}
//         mx={"auto"}
//       >
//         <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
//           <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
//             {t("Your Conversations")}
//           </Text>
//           <form onSubmit={handleConversationSearch}>
//             <Flex alignItems={"center"} gap={2}>
//               <Input placeholder={t('Search for a user')} onChange={(e) => setSearchText(e.target.value)} />
//               <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
//                 <SearchIcon />
//               </Button>
//             </Flex>
//           </form>

//           {loadingConversations &&
//             [0, 1, 2, 3, 4].map((_, i) => (
//               <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
//                 <Box>
//                   <SkeletonCircle size={"10"} />
//                 </Box>
//                 <Flex w={"full"} flexDirection={"column"} gap={3}>
//                   <Skeleton h={"10px"} w={"80px"} />
//                   <Skeleton h={"8px"} w={"90%"} />
//                 </Flex>
//               </Flex>
//             ))}

//           {/* Ensure conversations is an array before mapping */}
//           {!loadingConversations && Array.isArray(conversations) &&
//             conversations.map((conversation) => (
//               <Conversation
//                 key={conversation._id}
//                 isOnline={onlineUsers.includes(conversation.participants[0]._id)}
//                 conversation={conversation}
//               />
//             ))
//           }
//         </Flex>

//         {!selectedConversation._id && (
//           <Flex
//             flex={70}
//             borderRadius={"md"}
//             p={2}
//             flexDir={"column"}
//             alignItems={"center"}
//             justifyContent={"center"}
//             height={"400px"}
//           >
//             <GiConversation size={100} />
//             <Text fontSize={20}>{t("Select a conversation to start messaging")}</Text>
//           </Flex>
//         )}

//         {selectedConversation._id && <MessageContainer />}
//       </Flex>
//     </Box>
//   );
// };

// export default ChatPage;

// this is the api format issue 
import { ViewIcon, AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
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
    if (!currentUser || !currentUser.token) return;
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
  }, [showToast, setConversations, t, currentUser, isMonitoring]);

  if (!currentUser || !currentUser.token) {
    return null;
  }

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
      bg={cardBg}
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