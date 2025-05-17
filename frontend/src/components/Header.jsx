// v1
// import { Box, Flex, Icon, useColorMode } from "@chakra-ui/react";
// import { SunIcon, MoonIcon } from "@chakra-ui/icons";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";
// import { useState, useEffect, useRef } from "react";
// import { FaLock, FaUserShield } from "react-icons/fa";
// import { PiTelevisionSimpleBold } from "react-icons/pi";

// // Main Header component
// function Header({ unreadCount = 0 }) {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const user = useRecoilValue(userAtom);
//   const logout = useLogout();
//   const setAuthScreen = useSetRecoilState(authScreenAtom);
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
//   // State for locked icons
//   const [showLockIcon, setShowLockIcon] = useState({
//     chat: false,
//     tv: false,
//     admin: false
//   });

//   // User role checks
//   const isStudent = user?.role === "student";
//   const isTeacher = user?.role === "teacher";
//   const isAdmin = user?.role === "admin";

//   // Update mobile status on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Time-based access control for chat
//   const hasChatAccess = useChatAccessCheck(user, isStudent, isTeacher, isAdmin);

//   // Click handlers
//   const handleChatClick = () => {
//     if (user && !user.isFrozen && hasChatAccess) {
//       navigate("/chat");
//     }
//   };

//   const handleTVClick = () => {
//     if (user && isAdmin) {
//       navigate("/tv");
//     }
//   };

//   const handleAdminClick = () => {
//     if (user && isAdmin) {
//       navigate("/admin");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       navigate("/auth");
//       await logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   // Define icon size
//   const iconSize = 24;

//   return (
//     <Box 
//       width="100%" 
//       display="flex" 
//       justifyContent="center"
//       py={2}
//     >
//       <Flex
//         bg={colorMode === "dark" ? "rgba(26, 32, 44, 0.9)" : "rgba(247, 250, 252, 0.9)"}
//         backdropFilter="blur(10px)"
//         borderRadius="full"
//         boxShadow={colorMode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.1)"}
//         px={4}
//         py={3}
//         maxWidth="100%"
//         mx="auto"
//         gap={{ base: 3, md: 5 }}
//         justify="center"
//         align="center"
//         overflow="auto"
//         css={{
//           scrollbarWidth: 'none',
//           '&::-webkit-scrollbar': {
//             display: 'none',
//           },
//         }}
//       >
//         {user && (
//           <NavIcon 
//             icon={<AiFillHome size={iconSize} />}
//             label="Home"
//             onClick={() => navigate("/")}
//           />
//         )}

//         {!user && (
//           <NavIcon 
//             icon={<Box fontWeight="medium">Login</Box>}
//             label="Login"
//             onClick={() => { setAuthScreen("login"); navigate("/auth"); }}
//           />
//         )}

//         <NavIcon 
//           icon={
//             <Icon
//               as={colorMode === "dark" ? SunIcon : MoonIcon}
//               w={iconSize - 4}
//               h={iconSize - 4}
//             />
//           }
//           label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
//           onClick={toggleColorMode}
//         />

//         {user && (
//           <>
//             <NavIcon 
//               icon={<RxAvatar size={iconSize} />}
//               label="Profile"
//               onClick={() => navigate(`/${user.username}`)}
//             />

//             <NavIcon 
//               icon={
//                 <Box position="relative"
//                   onMouseEnter={() => setShowLockIcon({ ...showLockIcon, chat: !hasChatAccess || user.isFrozen })}
//                   onMouseLeave={() => setShowLockIcon({ ...showLockIcon, chat: false })}
//                 >
//                   {user.isFrozen || showLockIcon.chat ? (
//                     <FaLock size={iconSize - 4} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
//                   ) : (
//                     <BsFillChatQuoteFill size={iconSize - 4} />
//                   )}
//                   {unreadCount > 0 && !user.isFrozen && hasChatAccess && (
//                     <Flex
//                       position="absolute"
//                       top="-5px"
//                       right="-5px"
//                       bg="purple.500"
//                       color="white"
//                       borderRadius="full"
//                       w="16px"
//                       h="16px"
//                       fontSize="xs"
//                       alignItems="center"
//                       justifyContent="center"
//                       fontWeight="bold"
//                     >
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </Flex>
//                   )}
//                 </Box>
//               }
//               label={user.isFrozen ? "Account Frozen" : (hasChatAccess ? "Chat" : "No Access")}
//               onClick={handleChatClick}
//               isDisabled={user.isFrozen || !hasChatAccess}
//             />

//             {isAdmin && !isMobile && (
//               <NavIcon 
//                 icon={<FaUserShield size={iconSize - 4} />}
//                 label="Admin"
//                 onClick={handleAdminClick}
//               />
//             )}

//             {isAdmin && !isMobile && (
//               <NavIcon 
//                 icon={
//                   <Box
//                     onMouseEnter={() => setShowLockIcon({ ...showLockIcon, tv: !isAdmin })}
//                     onMouseLeave={() => setShowLockIcon({ ...showLockIcon, tv: false })}
//                   >
//                     {showLockIcon.tv ? (
//                       <FaLock size={iconSize - 4} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
//                     ) : (
//                       <PiTelevisionSimpleBold size={iconSize} />
//                     )}
//                   </Box>
//                 }
//                 label="TV"
//                 onClick={handleTVClick}
//               />
//             )}

//             <NavIcon 
//               icon={<MdOutlineSettings size={iconSize} />}
//               label="Settings"
//               onClick={() => navigate("/settings")}
//             />

//             <NavIcon 
//               icon={<FiLogOut size={iconSize - 4} />}
//               label="Logout"
//               onClick={handleLogout}
//             />
//           </>
//         )}

//         {!user && (
//           <NavIcon 
//             icon={<Box fontWeight="medium">Sign up</Box>}
//             label="Sign up"
//             onClick={() => { setAuthScreen("signup"); navigate("/auth"); }}
//           />
//         )}
//       </Flex>
//     </Box>
//   );
// }

// // Helper component for individual nav icons
// function NavIcon({ icon, label, onClick, isDisabled }) {
//   const { colorMode } = useColorMode();
//   const [showLabel, setShowLabel] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
  
//   // Colors based on state
//   const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
//   const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
//   const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  
//   const iconColor = isDisabled 
//     ? disabledColor 
//     : (isHovered ? activeColor : normalColor);

//   return (
//     <Box
//       position="relative"
//       onMouseEnter={() => {
//         setShowLabel(true);
//         setIsHovered(true);
//       }}
//       onMouseLeave={() => {
//         setShowLabel(false);
//         setIsHovered(false);
//       }}
//       onClick={isDisabled ? undefined : onClick}
//       cursor={isDisabled ? "not-allowed" : "pointer"}
//       transition="all 0.2s ease"
//       transform={isHovered && !isDisabled ? "scale(1.15)" : "scale(1)"}
//       color={iconColor}
//       mx={1}
//     >
//       {/* Icon */}
//       <Box 
//         padding={2} 
//         display="flex" 
//         alignItems="center" 
//         justifyContent="center"
//       >
//         {icon}
//       </Box>
      
//       {/* Label tooltip */}
//       {showLabel && (
//         <Box
//           position="absolute"
//           top="-8"
//           left="50%"
//           transform="translateX(-50%)"
//           width="max-content"
//           whiteSpace="nowrap"
//           borderRadius="md"
//           border="1px solid"
//           borderColor={isDisabled ? "red.300" : (colorMode === "dark" ? "whiteAlpha.300" : "gray.200")}
//           bg={colorMode === "dark" ? "gray.800" : "white"}
//           px={2}
//           py={1}
//           fontSize="xs"
//           color={isDisabled ? disabledColor : (colorMode === "dark" ? "white" : "gray.800")}
//           zIndex={10}
//           pointerEvents="none"
//           opacity={0.9}
//           boxShadow="sm"
//         >
//           {label}
//         </Box>
//       )}
      
//       {/* Active indicator dot */}
//       <Box
//         position="absolute"
//         bottom="-2px"
//         left="50%"
//         width="4px"
//         height="4px"
//         borderRadius="full"
//         bg={isDisabled ? disabledColor : activeColor}
//         opacity={isHovered ? 1 : 0}
//         transform="translateX(-50%)"
//         transition="opacity 0.2s ease"
//       />
//     </Box>
//   );
// }

// // Hook for chat access control
// function useChatAccessCheck(user, isStudent, isTeacher, isAdmin) {
//   const [hasChatAccess, setHasChatAccess] = useState(false);
  
//   useEffect(() => {
//     if (!user) {
//       setHasChatAccess(false);
//       return;
//     }
    
//     if (isTeacher || isAdmin) {
//       setHasChatAccess(true);
//       return;
//     }
    
//     if (isStudent) {
//       const checkAccess = () => {
//         const currentDate = new Date();
//         const dayOfWeek = currentDate.getDay();
//         const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();
        
//         const schoolStart = 810;
//         const lunchStart = 1250;
//         const lunchEnd = 1340;
//         const schoolEnd = 1535;
        
//         // Weekend
//         if (dayOfWeek === 0 || dayOfWeek === 6) {
//           return true;
//         }
        
//         // Weekday but outside school hours or during lunch
//         if (currentTime < schoolStart || 
//             (currentTime >= lunchStart && currentTime <= lunchEnd) || 
//             currentTime > schoolEnd) {
//           return true;
//         }
        
//         return false;
//       };
      
//       setHasChatAccess(checkAccess());
      
//       // Check every minute for time-based access changes
//       const intervalId = setInterval(() => {
//         setHasChatAccess(checkAccess());
//       }, 60000);
      
//       return () => clearInterval(intervalId);
//     }
//   }, [user, isStudent, isTeacher, isAdmin]);
  
//   return hasChatAccess;
// }

// export default Header;


// v2
import { Box, Flex, Icon, useColorMode, Tooltip } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaLock, FaUserShield } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { motion } from "framer-motion";

// Main Header component
function Header({ unreadCount = 0 }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const isPinkMode = localStorage.getItem('pinkMode') === 'true';
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLockIcon, setShowLockIcon] = useState(false);

  // User role checks
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click handlers
  const handleChatClick = () => {
    if (user && !user.isFrozen) {
      navigate("/chat");
    }
  };

  const handleTVClick = () => {
    if (user && isAdmin) {
      navigate("/tv");
    }
  };

  const handleAdminClick = () => {
    if (user && isAdmin) {
      navigate("/admin");
    }
  };

  const handleLogout = async () => {
    try {
      navigate("/auth");
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleColorModeToggle = () => {
    if (isPinkMode) {
      // If pink mode is enabled, toggle between dark and pink
      if (colorMode === 'light') {
        setColorMode('dark');
      } else {
        setColorMode('light');
      }
    } else {
      // If pink mode is disabled, use regular light/dark toggle
      toggleColorMode();
    }
  };

  // Define icon size based on screen size
  const iconSize = isMobile ? 22 : 24;
  
  // Glass effect styles
  const glassBg = isPinkMode && colorMode === 'light'
    ? 'rgba(233,161,186,0.7)'
    : (colorMode === "dark" 
      ? "rgba(26, 32, 44, 0.85)" 
      : "rgba(255, 255, 255, 0.85)");
  
  const glassBorder = colorMode === "dark"
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.05)";
    
  const glassBoxShadow = colorMode === "dark"
    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
    : "0 4px 12px rgba(0, 0, 0, 0.08)";

  return (
    <Box 
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      width="100%" 
      display="flex" 
      justifyContent="center"
      py={2} // Reduced from py={3}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex
        as={motion.div}
        bg={glassBg}
        backdropFilter={isPinkMode && colorMode === 'light' ? 'blur(18px) saturate(180%)' : 'blur(12px) saturate(180%)'}
        borderRadius="full"
        border={glassBorder}
        boxShadow={glassBoxShadow}
        px={{ base: 3, md: 5 }}
        py={2} // Reduced from py={3}
        maxWidth={{ base: "95%", md: "90%", lg: "600px" }} // Reduced from 800px
        mx="auto"
        gap={{ base: 2, md: 4 }}
        justify="center"
        align="center"
        overflow="auto"
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {user && (
          <NavIcon 
            icon={<AiFillHome size={iconSize} />}
            label="Home"
            onClick={() => navigate("/")}
            isActive={location.pathname === "/"}
          />
        )}

        {!user && (
          <NavIcon 
            icon={<Box fontWeight="medium">Login</Box>}
            label="Login"
            onClick={() => { setAuthScreen("login"); navigate("/auth"); }}
            isActive={location.pathname === "/auth" && !authScreenAtom}
          />
        )}

        <NavIcon 
          icon={
            <Icon
              as={colorMode === "dark" ? SunIcon : MoonIcon}
              w={iconSize - 8} // Reduced from iconSize - 4
              h={iconSize - 8} // Reduced from iconSize - 4
            />
          }
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          onClick={handleColorModeToggle}
        />

        {user && (
          <>
            <NavIcon 
              icon={<RxAvatar size={iconSize} />}
              label="Profile"
              onClick={() => navigate(`/${user.username}`)}
              isActive={location.pathname === `/${user.username}`}
            />

            <NavIcon 
              icon={
                <Box position="relative">
                  {user.isFrozen ? (
                    <FaLock size={iconSize - 4} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
                  ) : (
                    <BsFillChatQuoteFill size={iconSize - 4} />
                  )}
                </Box>
              }
              label={user.isFrozen ? "Account Frozen" : "Chat"}
              onClick={handleChatClick}
              isDisabled={user.isFrozen}
              isActive={location.pathname === "/chat"}
            />

            {isAdmin && !isMobile && (
              <NavIcon 
                icon={<FaUserShield size={iconSize - 4} />}
                label="Admin"
                onClick={handleAdminClick}
                isActive={location.pathname === "/admin"}
              />
            )}

            {isAdmin && !isMobile && (
              <NavIcon 
                icon={<PiTelevisionSimpleBold size={iconSize} />}
                label="TV"
                onClick={handleTVClick}
                isActive={location.pathname === "/tv"}
              />
            )}

            <NavIcon 
              icon={<MdOutlineSettings size={iconSize} />}
              label="Settings"
              onClick={() => navigate("/settings")}
              isActive={location.pathname === "/settings"}
            />

            <NavIcon 
              icon={<FiLogOut size={iconSize - 4} />}
              label="Logout"
              onClick={handleLogout}
            />
          </>
        )}

        {!user && (
          <NavIcon 
            icon={<Box fontWeight="medium">Sign up</Box>}
            label="Sign up"
            onClick={() => { setAuthScreen("signup"); navigate("/auth"); }}
            isActive={location.pathname === "/auth" && authScreenAtom === "signup"}
          />
        )}
      </Flex>
    </Box>
  );
}

// Modernized NavIcon component with improved animations
function NavIcon({ icon, label, onClick, isDisabled, isActive }) {
  const { colorMode } = useColorMode();
  
  // Colors based on state
  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
  const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  
  const iconColor = isDisabled 
    ? disabledColor 
    : (isActive ? activeColor : normalColor);

  // Animation variants with increased scale
  const iconVariants = {
    hover: { scale: 1.3 }, // Increased from 1.15
    tap: { scale: 0.95 },
    rest: { scale: 1 }
  };

  return (
    <Tooltip 
      label={label} 
      placement="top" 
      hasArrow 
      bg={colorMode === "dark" ? "gray.700" : "gray.50"}
      color={colorMode === "dark" ? "white" : "gray.800"}
      border="1px solid"
      borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
      borderRadius="md"
      fontSize="xs"
      isDisabled={isDisabled}
    >
      <Box
        as={motion.div}
        initial="rest"
        whileHover={isDisabled ? "rest" : "hover"}
        whileTap={isDisabled ? "rest" : "tap"}
        variants={iconVariants}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={isDisabled ? undefined : onClick}
        cursor={isDisabled ? "not-allowed" : "pointer"}
        color={iconColor}
        mx={1.5}
        position="relative"
    >
      {/* Icon */}
      <Box 
        padding={2} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        {icon}
      </Box>
      
        {/* Active indicator */}
        {isActive && !isDisabled && (
        <Box
            as={motion.div}
            layoutId="activeIndicator"
          position="absolute"
            bottom="-5px"
          left="50%"
            width="5px"
            height="5px"
        borderRadius="full"
            bg={activeColor}
            initial={{ x: "-50%" }}
            animate={{ x: "-50%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
    </Box>
    </Tooltip>
  );
}

export default Header;



