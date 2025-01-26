// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button, useToast } from "@chakra-ui/react";
// import { MdMail } from "react-icons/md";

// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";

// const UserHeader = ({ user }) => {
//   const toast = useToast();
//   const currentUser = useRecoilValue(userAtom); // logged in user
//   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

//   const copyURL = () => {
//     const currentURL = window.location.href;
//     navigator.clipboard.writeText(currentURL).then(() => {
//       toast({
//         title: "Success.",
//         status: "success",
//         description: "Profile link copied.",
//         duration: 3000,
//         isClosable: true,
//       });
//     });
//   };

//   return (
//     <VStack gap={4} alignItems={"start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         <Box>
//           <Text fontSize={"2xl"} fontWeight={"bold"}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"}>
//             <Text fontSize={"sm"}>{user.username}</Text>
//             <Text
//               fontSize={"xs"}
//               bg={"gray.dark"}
//               color={"gray.light"}
//               p={1}
//               borderRadius={"full"}
//             >
//               brookhouse
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <Avatar
//               name={user.name}
//               src={user.profilePic}
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//           {!user.profilePic && (
//             <Avatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//         </Box>
//       </Flex>

//       <Text>{user.bio}</Text>

//       {currentUser?._id === user._id && (
//         <Link as={RouterLink} to="/update">
//           <Button size={"sm"}>Edit Profile</Button>
//         </Link>
//       )}
//       {currentUser?._id !== user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following ? "Unfollow" : "Follow"}
//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"}>
//           {/* <Text color={"gray.light"}>{user.followers.length} followers</Text> */}
//           <Link color={"gray.light"}>Pear</Link>
//           <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
//           <Link color={"gray.light"}>gmail.com</Link>
//         </Flex>
//         <Flex>
//           {/* okay this is for the icon and making it more functional  
// 					want to add an email icon that can link us to the users mail */}
//           <Box className="icon-container">
//             <MdMail size={24} cursor={"pointer"} />
//           </Box>
//           <Box className="icon-container">
//             <Menu>
//               <MenuButton>
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <Portal>
//                 <MenuList bg={"gray.dark"}>
//                   <MenuItem bg={"gray.dark"} onClick={copyURL}>
//                     Copy link
//                   </MenuItem>
//                 </MenuList>
//               </Portal>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>

//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"1.2px solid gray"}
//           justifyContent={"center"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}>Feed</Text>
//         </Flex>
// 		{/* <Flex
//           flex={1}
//           borderBottom={"1px solid gray"}
//           justifyContent={"center"}
//           color={"gray.light"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}> Replies</Text>
//         </Flex> */}
        
//       </Flex>
//     </VStack>
//   );
// };

// export default UserHeader;



// so thi sis a working version without translations added 
// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button, useToast } from "@chakra-ui/react";
// import { MdVideoCall } from "react-icons/md"; // Import the video icon
// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";

// const UserHeader = ({ user }) => {
//   const toast = useToast();
//   const currentUser = useRecoilValue(userAtom); // logged in user
//   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

//   const copyURL = () => {
//     const currentURL = window.location.href;
//     navigator.clipboard.writeText(currentURL).then(() => {
//       toast({
//         title: "Success.",
//         status: "success",
//         description: "Profile link copied.",
//         duration: 3000,
//         isClosable: true,
//       });
//     });
//   };

//   return (
//     <VStack gap={4} alignItems={"start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         <Box>
//           <Text fontSize={"2xl"} fontWeight={"bold"}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"}>
//             <Text fontSize={"sm"}>{user.username}</Text>
//             <Text
//               fontSize={"xs"}
//               bg={"gray.dark"}
//               color={"gray.light"}
//               p={1}
//               borderRadius={"full"}
//             >
//               brookhouse
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <Avatar
//               name={user.name}
//               src={user.profilePic}
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//           {!user.profilePic && (
//             <Avatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//         </Box>
//       </Flex>

//       <Text>{user.bio}</Text>

//       {currentUser?._id === user._id && (
//         <Link as={RouterLink} to="/update">
//           <Button size={"sm"}>Edit Profile</Button>
//         </Link>
//       )}
//       {currentUser?._id !== user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following ? "Unfollow" : "Follow"}
//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"}>
//           <Link color={"gray.light"}>Pear</Link>
//           <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
//           <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
//             meet.com
//           </Link>
//         </Flex>
//         <Flex>
//           <Box className="icon-container">
//             <Link href="https://pearmeet.onrender.com" isExternal>
//               <MdVideoCall size={24} cursor={"pointer"} />
//             </Link>
//           </Box>
//           <Box className="icon-container">
//             <Menu>
//               <MenuButton>
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <Portal>
//                 <MenuList bg={"gray.dark"}>
//                   <MenuItem bg={"gray.dark"} onClick={copyURL}>
//                     Copy link
//                   </MenuItem>
//                 </MenuList>
//               </Portal>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>

//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"1.2px solid gray"}
//           justifyContent={"center"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}>Feed</Text>
//         </Flex>
//       </Flex>
//     </VStack>
//   );
// };

// export default UserHeader;


// this is an updated version with translations working
// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button, useToast } from "@chakra-ui/react";
// import { MdVideoCall } from "react-icons/md";
// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";
// import { useTranslation } from 'react-i18next';  // Import useTranslation
// import React, { useEffect, useState } from 'react'; // Import useState and useEffect

// const UserHeader = ({ user }) => {
//   const toast = useToast();
//   const currentUser = useRecoilValue(userAtom); // logged in user
//   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
//   const { t, i18n } = useTranslation();  // Initialize the translation hook
//   const [language, setLanguage] = useState(i18n.language);  // Add a state for language

//   useEffect(() => {
//     // Update the language state whenever the i18n language changes
//     const handleLanguageChange = (lng) => {
//       setLanguage(lng);
//     };

//     i18n.on('languageChanged', handleLanguageChange);

//     return () => {
//       i18n.off('languageChanged', handleLanguageChange);
//     };
//   }, [i18n]);

//   const copyURL = () => {
//     const currentURL = window.location.href;
//     navigator.clipboard.writeText(currentURL).then(() => {
//       toast({
//         title: t("Success."),  // Use t() for translations
//         status: "success",
//         description: t("Profile link copied."),  // Use t() for translations
//         duration: 3000,
//         isClosable: true,
//       });
//     });
//   };

//   return (
//     <VStack gap={4} alignItems={"start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         <Box>
//           <Text fontSize={"2xl"} fontWeight={"bold"}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"}>
//             <Text fontSize={"sm"}>{user.username}</Text>
//             <Text
//               fontSize={"xs"}
//               bg={"gray.dark"}
//               color={"gray.light"}
//               p={1}
//               borderRadius={"full"}
//             >
//               brookhouse
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <Avatar
//               name={user.name}
//               src={user.profilePic}
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//           {!user.profilePic && (
//             <Avatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//             />
//           )}
//         </Box>
//       </Flex>

//       <Text>{user.bio}</Text>

//       {currentUser?._id === user._id && (
//         <Link as={RouterLink} to="/update">
//           <Button size={"sm"}>{t("Edit Profile")}</Button> {/* Use t() */}
//         </Link>
//       )}
//       {currentUser?._id !== user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following ? t("Unfollow") : t("Follow")} {/* Use t() */}
//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"}>
//           <Link color={"gray.light"}>Pear</Link>
//           <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
//           <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
//             meet.com
//           </Link>
//         </Flex>
//         <Flex>
//           <Box className="icon-container">
//             <Link href="https://pearmeet.onrender.com" isExternal>
//               <MdVideoCall size={24} cursor={"pointer"} />
//             </Link>
//           </Box>
//           <Box className="icon-container">
//             <Menu>
//               <MenuButton>
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <Portal>
//                 <MenuList bg={"gray.dark"}>
//                   <MenuItem bg={"gray.dark"} onClick={copyURL}>
//                     {t("Copy link")} {/* Use t() */}
//                   </MenuItem>
//                 </MenuList>
//               </Portal>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>

//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"1.2px solid gray"}
//           justifyContent={"center"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}>{t("Feed")}</Text> {/* Use t() */}
//         </Flex>
//       </Flex>
//     </VStack>
//   );
// };

// export default UserHeader;


// with updated profile  this is working version
// import { Avatar, Box, Flex, Link, Text, VStack, useToast } from "@chakra-ui/react";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button } from "@chakra-ui/react";
// import { MdVideoCall } from "react-icons/md";
// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";
// import { useTranslation } from 'react-i18next';
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// const MotionAvatar = motion(Avatar);

// const UserHeader = ({ user }) => {
//   const toast = useToast();
//   const currentUser = useRecoilValue(userAtom); // logged in user
//   const navigate = useNavigate(); // For navigation
//   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
//   const { t, i18n } = useTranslation();
//   const [language, setLanguage] = useState(i18n.language);

//   useEffect(() => {
//     const handleLanguageChange = (lng) => {
//       setLanguage(lng);
//     };

//     i18n.on('languageChanged', handleLanguageChange);

//     return () => {
//       i18n.off('languageChanged', handleLanguageChange);
//     };
//   }, [i18n]);

//   const copyURL = () => {
//     const currentURL = window.location.href;
//     navigator.clipboard.writeText(currentURL).then(() => {
//       toast({
//         title: t("Success."),
//         status: "success",
//         description: t("Profile link copied."),
//         duration: 3000,
//         isClosable: true,
//       });
//     });
//   };

//   const handleProfileClick = () => {
//     navigate('/update'); // Redirect to UpdateProfilePage
//   };

//   return (
//     <VStack gap={4} alignItems={"start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         <Box>
//           <Text fontSize={"2xl"} fontWeight={"bold"}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"}>
//             <Text fontSize={"sm"}>{user.username}</Text>
//             <Text
//               fontSize={"xs"}
//               bg={"gray.dark"}
//               color={"gray.light"}
//               p={1}
//               borderRadius={"full"}
//             >
//               brookhouse
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <MotionAvatar
//               name={user.name}
//               src={user.profilePic}
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//               onClick={handleProfileClick}
//               cursor="pointer"
//               whileHover={{ scale: 1.05 }} // Popout animation
//               transition={{ duration: 0.2 }} // Duration of the animation
//             />
//           )}
//           {!user.profilePic && (
//             <MotionAvatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//               onClick={handleProfileClick}
//               cursor="pointer"
//               whileHover={{ scale: 1.05 }} // Popout animation
//               transition={{ duration: 0.2 }} // Duration of the animation
//             />
//           )}
//         </Box>
//       </Flex>

//       <Text>{user.bio}</Text>

//       {currentUser?._id === user._id && (
//         <Link as={RouterLink} to="/update">
//           <Button size={"sm"}>{t("Edit Profile")}</Button>
//         </Link>
//       )}
//       {currentUser?._id !== user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following ? t("Unfollow") : t("Follow")}
//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"}>
//           <Link color={"gray.light"}>Pear</Link>
//           <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
//           <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
//             meet.com
//           </Link>
//         </Flex>
//         <Flex>
//           <Box className="icon-container">
//             <Link href="https://pearmeet.onrender.com" isExternal>
//               <MdVideoCall size={24} cursor={"pointer"} />
//             </Link>
//           </Box>
//           <Box className="icon-container">
//             <Menu>
//               <MenuButton>
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <Portal>
//                 <MenuList bg={"gray.dark"}>
//                   <MenuItem bg={"gray.dark"} onClick={copyURL}>
//                     {t("Copy link")}
//                   </MenuItem>
//                 </MenuList>
//               </Portal>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>

//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"1.2px solid gray"}
//           justifyContent={"center"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}>{t("Feed")}</Text>
//         </Flex>
//       </Flex>
//     </VStack>
//   );
// };

// export default UserHeader;


// this updated version with verification(working)
import { Avatar, Box, Flex, Link, Text, VStack, useToast } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button } from "@chakra-ui/react";
import { MdVideoCall } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDisclosure } from "@chakra-ui/hooks";
import AdminModal from "./AdminModal"; // Import the AdminModal component
import { freezeUserAccount, deleteUserAccount } from "../api/userApi"; // Import API functions

const MotionAvatar = motion(Avatar);

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // Logged-in user
  const navigate = useNavigate(); // For navigation
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For the verification dropdown
  const [showAdminModal, setShowAdminModal] = useState(false); // For the admin modal

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: t("Success."),
        status: "success",
        description: t("Profile link copied."),
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleProfileClick = () => {
    navigate('/update'); // Redirect to UpdateProfilePage
  };

  const awardVerification = (type) => {
    // Function to handle awarding of verification badges
    toast({
      title: t("Verification Awarded"),
      status: "success",
      description: t(`User awarded ${type} verification.`),
      duration: 3000,
      isClosable: true,
    });
    // Send request to server to update the user's verification status here
  };

  const handleDoubleClick = () => {
    if (currentUser?.role === 'admin') {
      setShowAdminModal(true); // Show admin modal on double-click
    }
  };

  const handleFreezeAccount = async (userId) => {
    try {
      await freezeUserAccount(userId); // Freeze the user account
      toast({
        title: "Success",
        status: "success",
        description: "User account frozen successfully",
        duration: 3000,
        isClosable: true,
      });
      setShowAdminModal(false); // Close the modal
    } catch (error) {
      console.error("Error freezing account:", error);
      toast({
        title: "Error",
        status: "error",
        description: "Failed to freeze account",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async (userId) => {
    try {
      await deleteUserAccount(userId); // Delete the user account
      toast({
        title: "Success",
        status: "success",
        description: "User account deleted successfully",
        duration: 3000,
        isClosable: true,
      });
      setShowAdminModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        status: "error",
        description: "Failed to delete account",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            {user.verification && (
              <Text
                fontSize={"xs"}
                bg={user.verification === 'gold' ? "gold" : "blue.500"} // Show color based on verification
                color={"white"}
                p={1}
                borderRadius={"full"}
              >
                {user.verification === 'gold' ? "Gold Verified" : "Blue Verified"}
              </Text>
            )}
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <MotionAvatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
              onClick={handleDoubleClick} // Trigger admin modal on double-click
              cursor="pointer"
              whileHover={{ scale: 1.05 }} // Popout animation
              transition={{ duration: 0.2 }} // Duration of the animation
            />
          )}
          {!user.profilePic && (
            <MotionAvatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
              onClick={handleDoubleClick} // Trigger admin modal on double-click
              cursor="pointer"
              whileHover={{ scale: 1.05 }} // Popout animation
              transition={{ duration: 0.2 }} // Duration of the animation
            />
          )}

          {/* Admin Modal for Freeze/Delete */}
          {showAdminModal && (
            <AdminModal
              userId={user._id}
              onClose={() => setShowAdminModal(false)}
              onFreeze={handleFreezeAccount}
              onDelete={handleDeleteAccount}
            />
          )}

          {/* Dropdown Menu for Admin Verification */}
          {currentUser?.role === 'admin' && isOpen && (
            <Box 
              position="absolute" 
              mt={2} 
              bg="gray.700" 
              p={3} 
              borderRadius="md" 
              boxShadow="md"
              onMouseLeave={onClose} // Close the dropdown on mouse leave
            >
              <Button size={"sm"} colorScheme="blue" onClick={() => awardVerification('blue')}>
                Award Blue Verification
              </Button>
              <Button size={"sm"} colorScheme="yellow" mt={2} onClick={() => awardVerification('gold')}>
                Award Gold Verification
              </Button>
            </Box>
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>{t("Edit Profile")}</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? t("Unfollow") : t("Follow")}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Link color={"gray.light"}>Pear</Link>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
            meet.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Link href="https://pearmeet.onrender.com" isExternal>
              <MdVideoCall size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    {t("Copy link")}
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.2px solid gray"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>{t("Feed")}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;