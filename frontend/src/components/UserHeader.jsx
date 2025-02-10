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
import { Avatar, Box, Flex, Link, Text, VStack, useToast, IconButton } from "@chakra-ui/react";
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

const MotionAvatar = motion(Avatar);

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  const showToast = (title, description, status) => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(t("Success."), t("Profile link copied."), "success");
    });
  };

  const handleAdminAction = async (action) => {
    try {
      const res = await fetch(`/api/users/admin/${action}-user`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      showToast("Success", `User ${action === 'delete' ? 'deleted' : 'frozen'} successfully`, "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            {user.verification && (
              <Text
                fontSize={"xs"}
                bg={user.verification === 'gold' ? "gold" : "blue.500"}
                color={"white"}
                p={1}
                borderRadius={"full"}
              >
                {user.verification === 'gold' ? "Gold Verified" : "Blue Verified"}
              </Text>
            )}
          </Flex>
        </Box>
        <Box position="relative">
          <MotionAvatar
            name={user.name}
            src={user.profilePic || "https://bit.ly/broken-link"}
            size={{ base: "md", md: "xl" }}
            onDoubleClick={() => currentUser?.role === 'admin' && setIsDropdownOpen(!isDropdownOpen)}
            cursor={currentUser?.role === 'admin' ? "pointer" : "default"}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />

          {isDropdownOpen && currentUser?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                borderRadius: 'md',
                padding: '0.5rem',
                boxShadow: 'lg',
                zIndex: 10,
                minWidth: '200px',
              }}
            >
              <VStack spacing={2} align="stretch">
                <IconButton
                  icon={<Text>❄️ Freeze Account</Text>}
                  onClick={() => handleAdminAction('freeze')}
                  _hover={{ bg: 'blue.800' }}
                />
                <IconButton
                  icon={<Text>🗑️ Delete Account</Text>}
                  onClick={() => handleAdminAction('delete')}
                  _hover={{ bg: 'red.800' }}
                />
              </VStack>
            </motion.div>
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id ? (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>{t("Edit Profile")}</Button>
        </Link>
      ) : (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? t("Unfollow") : t("Follow")}
        </Button>
      )}

      {/* Maintained original design elements */}
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