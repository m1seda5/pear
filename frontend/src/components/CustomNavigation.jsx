// src/components/CustomNavigation.jsx
import React from "react";
import {
  Flex,
  IconButton,
  Link,
  Box,
  useColorMode,
  Tooltip,
  keyframes,
  Icon,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Collapse,
} from "@chakra-ui/react";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { FaPlus, FaLock, FaUserShield, FaUserPlus } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import useLogout from "../hooks/useLogout";

const pulseKeyframes = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const shakeKeyframes = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
`;

export const CustomNavigation = ({ placement, unreadCount = 0, onCreatePostOpen }) => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLockIcon, setShowLockIcon] = React.useState({
    chat: false,
    tv: false,
    admin: false,
  });
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin";
  const isHomePage = location.pathname === "/";

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;

  const hasChatAccess = user && (
    isStudent
      ? dayOfWeek === 0 ||
        dayOfWeek === 6 ||
        currentTime < schoolStart ||
        (currentTime >= lunchStart && currentTime <= lunchEnd) ||
        currentTime > schoolEnd
      : true
  );

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

  const toggleSearch = () => {
    setIsSearchExpanded((prev) => !prev);
  };

  const NavItem = ({ icon, label, to, onClick, isDisabled, children }) => {
    const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
    const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
    const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
    const hoverBgColor = colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50";

    return (
      <Tooltip label={label} placement="top" hasArrow bg={colorMode === "dark" ? "gray.700" : "gray.200"} color={colorMode === "dark" ? "white" : "gray.800"}>
        <Box
          as={Link}
          to={to}
          onClick={onClick}
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={2}
          borderRadius="md"
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          color={isDisabled ? disabledColor : normalColor}
          _hover={{
            bg: hoverBgColor,
            transform: "translateY(-2px)",
          }}
          isDisabled={isDisabled}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          position="relative"
        >
          {children}
          {label === "Chat" && unreadCount > 0 && !isDisabled && (
            <Badge
              position="absolute"
              top="-5px"
              right="-5px"
              borderRadius="full"
              px={1}
              fontSize="xs"
              colorScheme="purple"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Box>
      </Tooltip>
    );
  };

  const pulseAnimation = `${pulseKeyframes} 1s infinite`;
  const shakeAnimation = `${shakeKeyframes} 0.5s`;

  const navigationItems = [
    { icon: AiFillHome, label: "Home", to: "/" },
    user && { icon: RxAvatar, label: "Profile", to: `/${user?.username}` },
    user && {
      icon: BsFillChatQuoteFill,
      label: "Chat",
      onClick: handleChatClick,
      isDisabled: !hasChatAccess || user?.isFrozen,
      lockCondition: !hasChatAccess || user?.isFrozen,
    },
    user && isAdmin && { icon: FaUserShield, label: "Admin", onClick: handleAdminClick },
    user && {
      icon: PiTelevisionSimpleBold,
      label: "TV",
      onClick: handleTVClick,
      isDisabled: !isAdmin,
      lockCondition: !isAdmin,
    },
    user && { icon: MdOutlineSettings, label: "Settings", to: "/settings" },
    user && { icon: FiLogOut, label: "Logout", onClick: handleLogout },
    !user && { icon: FiLogIn, label: "Login", to: "/auth" },
    !user && {
      icon: FaUserPlus,
      label: "Sign up",
      onClick: () => {
        setAuthScreen("signup");
        navigate("/auth");
      },
    },
  ].filter(Boolean);

  const navStyles = {
    side: {
      direction: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "60px",
      bg: "white",
      borderRight: "1px solid",
      borderColor: "gray.200",
      py: 4,
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: "20",
    },
    bottom: {
      direction: "row",
      justifyContent: "space-around",
      alignItems: "center",
      bg: "white",
      borderTop: "1px solid",
      borderColor: "gray.200",
      py: 2,
    },
  };

  const currentStyles = navStyles[placement] || navStyles.bottom;

  return (
    <Flex {...currentStyles}>
      {placement === "side" && user && (
        <Tooltip label="Create Post" placement="right" hasArrow>
          <IconButton
            icon={<FaPlus size={20} />}
            onClick={onCreatePostOpen}
            aria-label="Create Post"
            borderRadius="full"
            mb={4}
            _hover={{ bg: colorMode === "dark" ? "teal.600" : "teal.200" }}
          />
        </Tooltip>
      )}
      {user && (
        <Box display="flex" flexDirection={placement === "bottom" ? "row" : "column"} alignItems="center">
          <Tooltip label="Search" placement={placement === "bottom" ? "top" : "right"} hasArrow>
            <IconButton
              icon={<AiOutlineSearch size={20} />}
              onClick={toggleSearch}
              aria-label="Search"
              borderRadius="full"
              _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.200" }}
            />
          </Tooltip>
          <Collapse in={isSearchExpanded} animateOpacity>
            <InputGroup size="sm" mt={placement === "side" ? 2 : 0} ml={placement === "bottom" ? 2 : 0}>
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch color="gray.500" />
              </InputLeftElement>
              <Input placeholder="Search..." borderRadius="md" />
            </InputGroup>
          </Collapse>
          {navigationItems
            .filter((item) => user || (!item.to && item.onClick))
            .map((item, index) => (
              <NavItem
                key={item.label}
                to={item.to}
                onClick={item.onClick}
                isDisabled={item.isDisabled}
                label={item.label}
              >
                <Box position="relative">
                  <Icon
                    as={item.icon}
                    size={22}
                    color={item.isDisabled ? (colorMode === "dark" ? "red.400" : "red.500") : (colorMode === "dark" ? "whiteAlpha.900" : "gray.700")}
                  />
                  {item.lockCondition && (
                    <Icon
                      as={FaLock}
                      size={16}
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      color={colorMode === "dark" ? "#F56565" : "#E53E3E"}
                      animation={pulseAnimation}
                    />
                  )}
                </Box>
              </NavItem>
            ))}
        </Box>
      )}
      {placement === "bottom" && user && (
        <Tooltip label="Create Post" placement="top" hasArrow>
          <IconButton
            icon={<FaPlus size={20} />}
            onClick={onCreatePostOpen}
            aria-label="Create Post"
            borderRadius="full"
            position="absolute"
            top="-28px" // Adjust as needed to position in the middle
            left="50%"
            transform="translateX(-50%)"
            bg="teal.500"
            color="white"
            _hover={{ bg: "teal.600" }}
          />
        </Tooltip>
      )}
      {placement === "bottom" && !user && (
        <>
          <NavItem label="Login" to="/auth">
            <Icon as={FiLogIn} size={22} color={colorMode === "dark" ? "whiteAlpha.900" : "gray.700"} />
          </NavItem>
          <Tooltip label="Sign up" placement="top" hasArrow>
            <Link to="/auth" onClick={() => setAuthScreen("signup")}>
              <IconButton
                icon={<FaUserPlus size={20} />}
                aria-label="Sign up"
                borderRadius="full"
                _hover={{ bg: colorMode === "dark" ? "blue.600" : "blue.200" }}
              />
            </Link>
          </Tooltip>
        </>
      )}
    </Flex>
  );
};