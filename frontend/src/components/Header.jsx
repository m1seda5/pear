import { 
  Box, 
  Flex, 
  Icon,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, SearchIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { FaLock, FaUserShield } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useMemo } from 'react';
import { MdSportsScore } from "react-icons/md";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Constants for dock component - Adjusted for more Apple-like effect
const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 100; // Increased for more noticeable effect
const DEFAULT_DISTANCE = 180; // Increased for wider magnification area
const DEFAULT_PANEL_HEIGHT = 64;

// Create Dock Context
const DockContext = createContext(undefined);

function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

// Main Dock component - Improved for Apple-like effect
function Dock({
  children,
  className,
  spring = { mass: 0.2, stiffness: 300, damping: 20 }, // Adjusted for Apple-like physics
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const { colorMode } = useColorMode();
  const dockRef = useRef(null);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + 24); // Added padding for visual space
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Improved mouse tracking - calculate relative to dock container
  const handleMouseMove = (e) => {
    if (!dockRef.current) return;
    
    // Get dock position relative to viewport
    const dockRect = dockRef.current.getBoundingClientRect();
    
    // Calculate mouse X position relative to the dock
    const relativeMouseX = e.clientX - dockRect.left;
    
    // Set values for animation
    isHovered.set(1);
    mouseX.set(relativeMouseX);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    mouseX.set(Infinity);
  };

  return (
    <MotionBox
      style={{
        height: height,
      }}
      mx={2}
      display="flex"
      width="100%"
      alignItems="flex-end"
      justifyContent="center"
      mt={6}
      mb={10}
      overflow="visible" // Ensure no scrollbars appear
    >
      <MotionFlex
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        mx="auto"
        width="fit-content"
        maxWidth="100%"
        gap={3} // Gap between icons
        borderRadius="3xl"
        bg={colorMode === "dark" ? "rgba(26, 32, 44, 0.85)" : "rgba(247, 250, 252, 0.85)"}
        backdropFilter="blur(12px)" // Apple-style glass effect
        px={4}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
        alignItems="center"
        justifyContent="center"
        boxShadow={colorMode === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 20px rgba(0, 0, 0, 0.15)"}
        position="relative"
        overflow="visible" // Ensure no scrollbars appear
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </MotionFlex>
    </MotionBox>
  );
}

// DockItem component - Fixed for proper Apple dock magnification effect
function DockItem({ children, className, onClick, isDisabled }) {
  const ref = useRef(null);
  const { mouseX, spring, distance, magnification } = useDock();
  const itemHovered = useMotionValue(0);

  // Critical improvement: Better distance calculation
  const mouseDistance = useTransform(mouseX, (val) => {
    if (!ref.current) return distance;
    
    const domRect = ref.current.getBoundingClientRect();
    const itemCenter = domRect.left + domRect.width / 2;
    
    // Distance from mouse to center of this item
    return Math.abs(val - (itemCenter - domRect.x));
  });

  // Improved transformation function with parabolic curve for more Apple-like effect
  const widthTransform = useTransform(
    mouseDistance,
    [0, distance * 0.25, distance * 0.5, distance],
    [magnification, magnification * 0.85, magnification * 0.6, 40],
    {
      clamp: true // Ensures values stay within our defined range
    }
  );

  // Spring physics for smooth animation
  const width = useSpring(widthTransform, spring);

  return (
    <MotionBox
      ref={ref}
      style={{ width }} // This directly applies the animated width
      onHoverStart={() => itemHovered.set(1)}
      onHoverEnd={() => itemHovered.set(0)}
      onFocus={() => itemHovered.set(1)}
      onBlur={() => itemHovered.set(0)}
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      className={className}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { width, isHovered: itemHovered, isDisabled })
      )}
    </MotionBox>
  );
}

// DockLabel component - Enhanced for Apple dock style
function DockLabel({ children, className, ...rest }) {
  const { isHovered, isDisabled } = rest;
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          position="absolute"
          top="-8"
          left="50%"
          width="fit-content"
          whiteSpace="pre"
          borderRadius="md"
          border="1px solid"
          borderColor={isDisabled ? "red.300" : (colorMode === "dark" ? "whiteAlpha.300" : "gray.200")}
          bg={colorMode === "dark" ? "rgba(45, 55, 72, 0.95)" : "rgba(255, 255, 255, 0.95)"}
          backdropFilter="blur(8px)" // Apple-style glass effect
          px={2}
          py={0.5}
          fontSize="xs"
          color={isDisabled ? disabledColor : (colorMode === "dark" ? "white" : "gray.800")}
          role="tooltip"
          style={{ x: '-50%' }}
          className={className}
          zIndex={10}
        >
          {children}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}

// DockIcon component - Enhanced for Apple dock style
function DockIcon({ children, className, ...rest }) {
  const { width, isDisabled } = rest;
  const { colorMode } = useColorMode();

  // Scale icon size proportionally with the container width
  const widthTransform = useTransform(width, (val) => val * 0.6); // Adjusted ratio for better scaling

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
  const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  const iconColor = isDisabled ? disabledColor : normalColor;

  return (
    <MotionBox
      style={{ width: widthTransform }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      color={iconColor}
      _hover={{
        "& .nav-icon-underline": {
          width: "80%",
          opacity: 1
        }
      }}
      className={className}
    >
      {children}
      <Box
        className="nav-icon-underline"
        position="absolute"
        bottom="-8px"
        left="50%"
        width="0%"
        height="2px"
        bg={isDisabled ? disabledColor : activeColor}
        transition="all 0.2s ease-out"
        transform="translateX(-50%)"
        borderRadius="full"
        opacity={0}
      />
    </MotionBox>
  );
}

function Header({ unreadCount = 0 }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  
  // State for locked icons
  const [showLockIcon, setShowLockIcon] = useState({
    chat: false,
    tv: false,
    admin: false
  });

  // User role checks
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  // Time-based access control
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;

  const hasChatAccess = user && (
    isTeacher ||
    isAdmin ||
    (isStudent &&
      ((dayOfWeek >= 1 &&
        dayOfWeek <= 5 &&
        (currentTime < schoolStart ||
          (currentTime >= lunchStart && currentTime <= lunchEnd) ||
          currentTime > schoolEnd)) ||
        dayOfWeek === 0 ||
        dayOfWeek === 6))
  );

  // Click handlers
  const handleChatClick = (e) => {
    if (!user || user.isFrozen || !hasChatAccess) {
      e.preventDefault();
    } else {
      navigate("/chat");
    }
  };

  const handleTVClick = (e) => {
    if (!user || !isAdmin) {
      e.preventDefault();
    } else {
      navigate("/tv");
    }
  };

  const handleAdminClick = (e) => {
    if (!user || !isAdmin) {
      e.preventDefault();
    } else {
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

  // Search component with expandable functionality
  const ExpandableSearch = () => {
    const [expanded, setExpanded] = useState(false);
    const searchRef = useRef(null);
    
    useEffect(() => {
      function handleClickOutside(event) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setExpanded(false);
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <Box ref={searchRef} position="relative" zIndex="3">
        <DockItem onClick={() => setExpanded(!expanded)}>
          <DockIcon>
            <SearchIcon w={5} h={5} />
          </DockIcon>
          <DockLabel>Search for users</DockLabel>
        </DockItem>
        
        <Collapse in={expanded} animateOpacity>
          <Box 
            position="absolute" 
            top="110%" 
            left="50%" 
            transform="translateX(-50%)" 
            width="240px"
            bg={colorMode === "dark" ? "rgba(45, 55, 72, 0.95)" : "rgba(255, 255, 255, 0.95)"}
            backdropFilter="blur(8px)"
            borderRadius="xl"
            boxShadow="lg"
            p={2}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color={colorMode === "dark" ? "gray.300" : "gray.500"} />
              </InputLeftElement>
              <Input 
                placeholder="Search..."
                variant="filled"
                autoFocus
                borderRadius="lg"
                _focus={{ 
                  boxShadow: `0 0 0 1px ${colorMode === "dark" ? "teal.300" : "teal.500"}` 
                }}
              />
            </InputGroup>
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Define icon sizes for dock
  const iconSize = 20;

  return (
    <Box 
      width="100%" 
      display="flex" 
      justifyContent="center"
      position="relative"
      overflow="visible" // Ensure no scrollbars appear
    >
      <Dock 
        panelHeight={56} 
        magnification={84} // Adjusted for more pronounced effect
        distance={180} // Wider influence area for smoother transitions
        spring={{ mass: 0.2, stiffness: 300, damping: 20 }} // More Apple-like physics
      >
        {user && (
          <DockItem onClick={() => navigate("/")}>
            <DockIcon>
              <AiFillHome size={iconSize} />
            </DockIcon>
            <DockLabel>Home</DockLabel>
          </DockItem>
        )}

        {!user && (
          <DockItem onClick={() => { setAuthScreen("login"); navigate("/auth"); }}>
            <DockIcon>
              <Box fontWeight="medium">Login</Box>
            </DockIcon>
            <DockLabel>Login</DockLabel>
          </DockItem>
        )}

        <DockItem onClick={toggleColorMode}>
          <DockIcon>
            <Icon
              as={colorMode === "dark" ? SunIcon : MoonIcon}
              w={iconSize - 2}
              h={iconSize - 2}
              transition="all 0.3s ease"
              transform={colorMode === "dark" ? "rotate(0deg)" : "rotate(-180deg)"}
            />
          </DockIcon>
          <DockLabel>{colorMode === "dark" ? "Light Mode" : "Dark Mode"}</DockLabel>
        </DockItem>

        <ExpandableSearch />

        {user && (
          <>
            <DockItem onClick={() => navigate(`/${user.username}`)}>
              <DockIcon>
                <RxAvatar size={iconSize} />
              </DockIcon>
              <DockLabel>Profile</DockLabel>
            </DockItem>

            <DockItem 
              onClick={handleChatClick} 
              isDisabled={user.isFrozen || !hasChatAccess}
            >
              <DockIcon>
                <Box position="relative"
                  onMouseEnter={() => setShowLockIcon({ ...showLockIcon, chat: !hasChatAccess || user.isFrozen })}
                  onMouseLeave={() => setShowLockIcon({ ...showLockIcon, chat: false })}
                >
                  {user.isFrozen || showLockIcon.chat ? (
                    <FaLock size={iconSize - 2} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
                  ) : (
                    <BsFillChatQuoteFill size={iconSize - 2} />
                  )}
                  {unreadCount > 0 && !user.isFrozen && hasChatAccess && (
                    <Flex
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      bg="purple.500"
                      color="white"
                      borderRadius="full"
                      w="16px"
                      h="16px"
                      fontSize="xs"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Flex>
                  )}
                </Box>
              </DockIcon>
              <DockLabel>{user.isFrozen ? "Account Frozen" : (hasChatAccess ? "Chat" : "No Access")}</DockLabel>
            </DockItem>

            {isAdmin && (
              <DockItem onClick={handleAdminClick}>
                <DockIcon>
                  <FaUserShield size={iconSize - 2} />
                </DockIcon>
                <DockLabel>Admin</DockLabel>
              </DockItem>
            )}

            <DockItem 
              onClick={handleTVClick}
              isDisabled={!isAdmin}
            >
              <DockIcon>
                <Box
                  onMouseEnter={() => setShowLockIcon({ ...showLockIcon, tv: !isAdmin })}
                  onMouseLeave={() => setShowLockIcon({ ...showLockIcon, tv: false })}
                >
                  {showLockIcon.tv ? (
                    <FaLock size={iconSize - 2} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
                  ) : (
                    <PiTelevisionSimpleBold size={iconSize} />
                  )}
                </Box>
              </DockIcon>
              <DockLabel>{isAdmin ? "TV" : "Admin Only"}</DockLabel>
            </DockItem>

            {user && isAdmin && (
              <DockItem onClick={() => navigate("/games")}> 
                <DockIcon>
                  <MdSportsScore size={iconSize} />
                </DockIcon>
                <DockLabel>Scores</DockLabel>
              </DockItem>
            )}

            <DockItem onClick={() => navigate("/settings")}>
              <DockIcon>
                <MdOutlineSettings size={iconSize} />
              </DockIcon>
              <DockLabel>Settings</DockLabel>
            </DockItem>

            <DockItem onClick={handleLogout}>
              <DockIcon>
                <FiLogOut size={iconSize - 2} />
              </DockIcon>
              <DockLabel>Logout</DockLabel>
            </DockItem>
          </>
        )}

        {!user && (
          <DockItem onClick={() => { setAuthScreen("signup"); navigate("/auth"); }}>
            <DockIcon>
              <Box fontWeight="medium">Sign up</Box>
            </DockIcon>
            <DockLabel>Sign up</DockLabel>
          </DockItem>
        )}
      </Dock>
    </Box>
  );
}

export default Header;