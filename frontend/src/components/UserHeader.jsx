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
import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState({
    chat: false,
    lock: false,
    tv: false
  });

  if (!user) {
    return (
      <Flex 
        justifyContent="center" 
        mt={6} 
        mb="12" 
        gap={{ base: 4, md: 10 }}
        px={{ base: 2, md: 0 }}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        width="100%"
      >
        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreen("login")}
          _hover={{
            color: "teal.500",
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease-in-out"
        >
          Login
        </Link>

        <Image
          cursor="pointer"
          alt="logo"
          w={6}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
          _hover={{
            transform: "rotate(20deg) scale(1.2)",
          }}
          transition="all 0.3s ease-in-out"
        />

        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreen("signup")}
          _hover={{
            color: "teal.500",
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease-in-out"
        >
          Sign up
        </Link>
      </Flex>
    );
  }

  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";
  const isAdmin = user.role === "admin";

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;

  const hasChatAccess =
    isStudent &&
    ((dayOfWeek >= 1 && dayOfWeek <= 5 &&
      (currentTime < schoolStart ||
        (currentTime >= lunchStart && currentTime <= lunchEnd) ||
        currentTime > schoolEnd)) ||
      dayOfWeek === 0 || dayOfWeek === 6);

  const handleChatClick = (e) => {
    if (user.isFrozen || !hasChatAccess) {
      e.preventDefault();
      setHoverState({ ...hoverState, lock: true });
    } else {
      setHoverState({ ...hoverState, chat: false, lock: false });
      navigate("/chat");
    }
  };

  const handleTVClick = (e) => {
    if (!isAdmin) {
      e.preventDefault();
      setHoverState({ ...hoverState, tv: true });
    } else {
      setHoverState({ ...hoverState, tv: false });
      navigate("/tv");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Flex 
      justifyContent="center" 
      mt={6} 
      mb="12" 
      gap={{ base: 4, md: 10 }}
      px={{ base: 2, md: 0 }}
      flexWrap={{ base: "wrap", md: "nowrap" }}
      width="100%"
    >
      <Link
        as={RouterLink}
        to="/"
        _hover={{
          color: "teal.500",
          transform: "scale(1.2)",
        }}
        transition="all 0.3s ease-in-out"
      >
        <AiFillHome size={24} />
      </Link>

      <Image
        cursor="pointer"
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        _hover={{
          transform: "rotate(20deg) scale(1.2)",
        }}
        transition="all 0.3s ease-in-out"
      />

      <Flex 
        alignItems="center" 
        gap={{ base: 4, md: 10 }}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Link
          as={RouterLink}
          to={`/${user.username}`}
          _hover={{
            color: "teal.500",
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease-in-out"
        >
          <RxAvatar size={24} />
        </Link>

        <Link
          onClick={handleChatClick}
          _hover={{
            color: user.isFrozen ? "blue.500" : hasChatAccess ? "teal.500" : "red.500",
            transform: "scale(1.2)",
            cursor: user.isFrozen || !hasChatAccess ? "not-allowed" : "pointer",
          }}
          onMouseEnter={() => setHoverState({ ...hoverState, chat: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, chat: false, lock: false })}
        >
          {user.isFrozen ? (
            <FaLock size={20} color="#4299E1" />
          ) : hoverState.lock ? (
            <FaLock size={20} color="#F56565" />
          ) : (
            <BsFillChatQuoteFill size={20} />
          )}
        </Link>

        <Link
          onClick={handleTVClick}
          _hover={{
            color: isAdmin ? "teal.500" : "red.500",
            transform: "scale(1.2)",
            cursor: isAdmin ? "pointer" : "not-allowed",
          }}
          onMouseEnter={() => setHoverState({ ...hoverState, tv: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, tv: false })}
        >
          {hoverState.tv && !isAdmin ? (
            <FaLock size={20} color="#F56565" />
          ) : (
            <PiTelevisionSimpleBold size={20} />
          )}
        </Link>

        <Link
          as={RouterLink}
          to="/settings"
          _hover={{
            color: "teal.500",
            transform: "scale(1.2)",
          }}
          transition="all 0.3s ease-in-out"
        >
          <MdOutlineSettings size={20} />
        </Link>

        <Button
          size="xs"
          onClick={handleLogout}
          _hover={{
            bg: "teal.500",
            color: "white",
            transform: "scale(1.1)",
          }}
          transition="all 0.3s ease-in-out"
        >
          <FiLogOut size={20} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;