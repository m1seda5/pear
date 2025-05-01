import { 
  Box, 
  Flex, 
  Icon,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure,
  Image,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Avatar,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  IconButton,
  Tooltip
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, SearchIcon, ChatIcon, BellIcon } from "@chakra-ui/icons";
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
import PearLogo from "../assets/images/pear.png"; // Use your PNG logo

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Constants for dock component - Optimized for smooth Apple-like effect
const DOCK_HEIGHT = 140;
const DEFAULT_MAGNIFICATION = 120; // Increased for more noticeable effect
const DEFAULT_DISTANCE = 200; // Better range for magnification
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

// Main Dock component - Enhanced for smoother Apple-like effect
function Dock({
  children,
  className,
  spring = { mass: 0.6, stiffness: 350, damping: 30 }, // Optimized for smoother animation
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const { colorMode } = useColorMode();
  const dockRef = useRef(null);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + 32); // Better spacing for magnified items
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, {
    ...spring,
    // Slightly faster animation when entering than leaving for natural feel
    stiffness: isHovered.get() === 1 ? spring.stiffness * 1.2 : spring.stiffness
  });

  // Enhanced mouse tracking with debouncing for smoother transitions
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
      overflow="visible" // Ensure icons can scale outside the container
    >
      <MotionFlex
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        mx="auto"
        width="fit-content"
        maxWidth="100%"
        gap={4} // Increased gap for better spacing when magnified
        borderRadius="3xl"
        bg={colorMode === "dark" ? "rgba(26, 32, 44, 0.85)" : "rgba(247, 250, 252, 0.85)"}
        backdropFilter="blur(12px)" // Glass effect
        px={6} // Wider padding for better hover areas
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
        alignItems="center"
        justifyContent="center"
        boxShadow={colorMode === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 20px rgba(0, 0, 0, 0.15)"}
        position="relative"
        overflow="visible" // Ensure no clipping of magnified icons
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </MotionFlex>
    </MotionBox>
  );
}

// DockItem component - Completely revamped for authentic Apple dock effect
function DockItem({ children, className, onClick, isDisabled }) {
  const ref = useRef(null);
  const { mouseX, spring, distance, magnification } = useDock();
  const itemHovered = useMotionValue(0);
  const { colorMode } = useColorMode();
  
  // Enhanced distance calculation for smoother transitions
  const mouseDistance = useTransform(mouseX, (val) => {
    if (!ref.current) return distance;
    
    const domRect = ref.current.getBoundingClientRect();
    const itemCenter = domRect.left + domRect.width / 2;
    
    // Calculate absolute distance from mouse to center of item
    return Math.abs(val - itemCenter);
  });

  // Enhanced transformation curve for authentic Apple-like scaling
  const widthTransform = useTransform(
    mouseDistance,
    [0, distance * 0.2, distance * 0.5, distance],
    [magnification, magnification * 0.8, magnification * 0.5, 42],
    {
      clamp: true
    }
  );

  // Apply optimized springs for smoother animation
  const width = useSpring(widthTransform, {
    ...spring,
    // Slightly more responsive when growing than shrinking
    stiffness: mouseDistance.get() < distance * 0.3 ? spring.stiffness * 1.2 : spring.stiffness
  });

  // Enhanced hit area for better usability
  const hitAreaSize = useTransform(width, (val) => Math.max(val, 60));

  return (
    <MotionBox
      ref={ref}
      style={{ width: hitAreaSize }} // Larger hit area than visual icon
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
      // Center content within the larger hit area
      sx={{
        "& > *": {
          position: "absolute",
          top: "50%", 
          left: "50%",
          transform: "translate(-50%, -50%)"
        }
      }}
    >
      <MotionBox
        style={{ width }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {Children.map(children, (child) =>
          cloneElement(child, { width, isHovered: itemHovered, isDisabled })
        )}
      </MotionBox>
    </MotionBox>
  );
}

// DockLabel component - Enhanced for smoother fading and better appearance
function DockLabel({ children, className, ...rest }) {
  const { isHovered, isDisabled, width } = rest;
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode();

  // Make label respond to icon hover
  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  // Use color scheme for better theme integration
  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";

  // Scale label slightly with icon for cohesive animation
  const labelScale = useTransform(width, [40, 120], [0.95, 1.1]);

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: -14, scale: labelScale }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.2
          }}
          position="absolute"
          top="-8"
          left="50%"
          width="fit-content"
          whiteSpace="pre"
          borderRadius="lg"
          border="1px solid"
          borderColor={isDisabled ? "red.300" : (colorMode === "dark" ? "whiteAlpha.300" : "gray.200")}
          bg={colorMode === "dark" ? "rgba(45, 55, 72, 0.95)" : "rgba(255, 255, 255, 0.95)"}
          backdropFilter="blur(8px)" // Glass effect
          px={3}
          py={1}
          fontSize="sm" // Slightly larger for better readability
          fontWeight="medium" // Better visibility
          color={isDisabled ? disabledColor : (colorMode === "dark" ? "white" : "gray.800")}
          role="tooltip"
          style={{ x: '-50%' }}
          className={className}
          zIndex={10}
          pointerEvents="none" // Prevent label from interfering with hover
        >
          {children}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}

// DockIcon component - Enhanced for smoother scaling and highlight effect
function DockIcon({ children, className, ...rest }) {
  const { width, isDisabled, isHovered } = rest;
  const { colorMode } = useColorMode();

  // Scale icon size proportionally with container width
  const iconScale = useTransform(width, [42, 120], [0.8, 1.5]);

  // Define active state for highlighting effect
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsActive(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  // Colors for different states
  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
  const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  
  // Dynamic color based on hover state
  const iconColor = isDisabled 
    ? disabledColor 
    : (isActive ? activeColor : normalColor);

  return (
    <MotionBox
      style={{ 
        scale: iconScale,
        color: isActive && !isDisabled ? activeColor : iconColor
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      transition="color 0.2s ease"
      className={className}
    >
      {children}
      
      {/* Simplified indicator dot that appears when active */}
      <MotionBox
        position="absolute"
        bottom="-14px"
        left="50%"
        width="4px"
        height="4px"
        borderRadius="full"
        bg={isDisabled ? disabledColor : activeColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0,
          x: "-50%" 
        }}
        transition={{ duration: 0.2 }}
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
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

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Search component with expandable functionality
  const ExpandableSearch = () => {
    const searchRef = useRef(null);
    
    useEffect(() => {
      function handleClickOutside(event) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsSearchExpanded(false);
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <Box ref={searchRef} position="relative" zIndex="3">
        <DockItem onClick={handleSearchClick}>
          <DockIcon>
            <SearchIcon w={5} h={5} />
          </DockIcon>
          <DockLabel>Search for users</DockLabel>
        </DockItem>
        
        <Collapse in={isSearchExpanded} animateOpacity>
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
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      px={8}
      py={3}
      bg={colorMode === "light" ? "#fff" : "#23272f"}
      borderBottom="1px solid"
      borderColor={colorMode === "light" ? "#e6e6e6" : "#23272f"}
      position="sticky"
      top={0}
      zIndex={10}
    >
      {/* Logo */}
      <Box cursor="pointer" onClick={() => navigate("/")}>
        <img src={PearLogo} alt="Pear" style={{ height: 36 }} />
      </Box>

      {/* Search */}
      <Input
        placeholder="Search..."
        maxW="400px"
        borderRadius="full"
        bg={colorMode === "light" ? "#f5f6fa" : "#23272f"}
        border="none"
        px={6}
        py={2}
        fontSize="md"
        _focus={{ bg: "#fff" }}
      />

      {/* Icons */}
      <Flex align="center" gap={4}>
        <Tooltip label="Feed" hasArrow>
          <IconButton
            icon={<AiFillHome />}
            aria-label="Feed"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/")}
          />
        </Tooltip>
        <Tooltip label="Notifications" hasArrow>
          <IconButton
            icon={<BellIcon />}
            aria-label="Notifications"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/notifications")}
          />
        </Tooltip>
        <Tooltip label="Messages" hasArrow>
          <IconButton
            icon={<ChatIcon />}
            aria-label="Messages"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/chat")}
          />
        </Tooltip>
        <Tooltip label={colorMode === "light" ? "Dark mode" : "Light mode"} hasArrow>
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle color mode"
            variant="ghost"
            fontSize="xl"
            onClick={toggleColorMode}
          />
        </Tooltip>
        {/* Only profile pic opens dropdown */}
        <Menu>
          <MenuButton>
            <Avatar size="sm" src={user?.profilePic} name={user?.name} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate(`/${user.username}`)}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default Header;