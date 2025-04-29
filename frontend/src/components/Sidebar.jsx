import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  useColorModeValue,
  Collapse,
  Avatar,
  Button,
  Text,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import {
  AiFillHome,
  AiOutlineDashboard,
} from "react-icons/ai";
import { BsCheckSquare, BsCreditCard, BsBell, BsSearch, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaUser, FaUsers, FaShieldAlt, FaSignOutAlt, FaCog } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Replace with your actual logo and user data
const logoSrc = "/pear.png";
const userProfileSrc = "/user-profile.png";
const userName = "YourUsername";
const userRole = "UX Designer";

const greenAccent = {
  light: "#27ae60",
  dark: "#219150",
};

export default function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(true);
  const navigate = useNavigate();

  // Color mode values
  const bg = useColorModeValue("white", "#181c1f");
  const border = useColorModeValue("gray.100", "gray.700");
  const text = useColorModeValue("gray.700", "gray.200");
  const subText = useColorModeValue("gray.400", "gray.500");
  const hoverBg = useColorModeValue("gray.100", "#23282c");
  const activeBg = useColorModeValue("#eafaf1", "#1e2a22");
  const accent = useColorModeValue(greenAccent.light, greenAccent.dark);

  // Navigation items
  const mainNavItems = [
    { icon: <AiFillHome size={20} />, label: "Home", active: false, onClick: () => navigate("/") },
    { icon: <AiOutlineDashboard size={20} />, label: "Dashboard", active: true, onClick: () => navigate("/dashboard") },
    { icon: <BsCheckSquare size={20} />, label: "Tasks", active: false, onClick: () => navigate("/tasks") },
  ];

  const userSubItems = [
    { label: "Profile", onClick: () => navigate("/profile") },
    { label: "Email Address", onClick: () => navigate("/email") },
    { label: "Organization", onClick: () => navigate("/organization") },
  ];

  const settingsNavItems = [
    { icon: <FaShieldAlt size={20} />, label: "Security", active: false, highlight: true, onClick: () => navigate("/security") },
    { icon: <BsCreditCard size={20} />, label: "Account", active: false, onClick: () => navigate("/account") },
    { icon: <BsCreditCard size={20} />, label: "Payment", active: false, onClick: () => navigate("/payment") },
  ];

  const bottomNavItems = [
    { icon: <MdOutlineSettings size={20} />, label: "Setting", onClick: () => navigate("/settings") },
    { icon: <BsBell size={20} />, label: "Notifications", onClick: () => navigate("/notifications") },
  ];

  return (
    <Flex
      direction="column"
      w={{ base: "64px", md: "250px" }}
      h="100vh"
      justify="space-between"
      px={{ base: 2, md: 4 }}
      py={6}
      bg={bg}
      borderRight="1px solid"
      borderColor={border}
      transition="width 0.2s"
      position="fixed"
      zIndex={100}
    >
      {/* Top section */}
      <Flex direction="column" gap={6} w="full">
        {/* Logo and brand */}
        <Flex align="center" gap={3} w="full">
          <Box
            w="40px"
            h="40px"
            bg={hoverBg}
            rounded="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <img src={logoSrc} alt="Pear Logo" className="w-full h-full object-cover" />
          </Box>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={text}
            display={{ base: "none", md: "block" }}
          >
            Pear
          </Text>
        </Flex>

        {/* Search bar */}
        <Box w="full" display={{ base: "none", md: "block" }}>
          <Flex align="center" w="full" px={3} py={2.5} bg={hoverBg} rounded="lg">
            <BsSearch className="mr-2" color={subText} />
            <Input
              variant="unstyled"
              placeholder="Search"
              color={subText}
              _placeholder={{ color: subText }}
              fontSize="sm"
              pl={2}
            />
          </Flex>
        </Box>

        {/* Main navigation */}
        <Flex direction="column" gap={2} w="full">
          {mainNavItems.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              justifyContent="flex-start"
              alignItems="center"
              w="full"
              px={3}
              py={2.5}
              h="auto"
              leftIcon={item.icon}
              onClick={item.onClick}
              bg={item.active ? activeBg : "transparent"}
              color={item.active ? accent : text}
              _hover={{ bg: hoverBg, color: accent }}
              fontWeight={item.active ? "bold" : "normal"}
              fontSize="md"
              transition="all 0.15s"
            >
              <Box display={{ base: "none", md: "block" }}>{item.label}</Box>
            </Button>
          ))}

          {/* User section with collapsible submenu */}
          <Box w="full">
            <Button
              variant="ghost"
              justifyContent="space-between"
              alignItems="center"
              w="full"
              px={3}
              py={2.5}
              h="auto"
              onClick={() => setUserMenuOpen((v) => !v)}
              color={text}
              _hover={{ bg: hoverBg }}
              rightIcon={
                userMenuOpen ? (
                  <BsChevronUp color={subText} />
                ) : (
                  <BsChevronDown color={subText} />
                )
              }
            >
              <Flex align="center">
                <FaUsers size={20} />
                <Text ml={2} display={{ base: "none", md: "block" }}>
                  User
                </Text>
              </Flex>
            </Button>
            <Collapse in={userMenuOpen} animateOpacity>
              <Flex direction="column" w="full">
                {userSubItems.map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    justifyContent="flex-start"
                    alignItems="center"
                    w="full"
                    pl={9}
                    pr={3}
                    py={2.5}
                    h="auto"
                    color={text}
                    _hover={{ bg: hoverBg, color: accent }}
                    fontSize="md"
                    onClick={item.onClick}
                  >
                    <Box display={{ base: "none", md: "block" }}>{item.label}</Box>
                  </Button>
                ))}
              </Flex>
            </Collapse>
          </Box>

          {/* Settings nav items */}
          {settingsNavItems.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              justifyContent="flex-start"
              alignItems="center"
              w="full"
              px={3}
              py={2.5}
              h="auto"
              leftIcon={item.icon}
              onClick={item.onClick}
              bg={item.active ? activeBg : item.highlight ? hoverBg : "transparent"}
              color={item.active ? accent : text}
              _hover={{ bg: hoverBg, color: accent }}
              fontWeight={item.active ? "bold" : "normal"}
              fontSize="md"
              transition="all 0.15s"
            >
              <Box display={{ base: "none", md: "block" }}>{item.label}</Box>
            </Button>
          ))}
        </Flex>
      </Flex>

      {/* Bottom section */}
      <Flex direction="column" gap={5} w="full">
        {/* Bottom navigation */}
        <Flex direction="column" gap={2} w="full">
          {bottomNavItems.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              justifyContent="flex-start"
              alignItems="center"
              w="full"
              px={3}
              py={2.5}
              h="auto"
              leftIcon={item.icon}
              onClick={item.onClick}
              color={text}
              _hover={{ bg: hoverBg, color: accent }}
              fontSize="md"
              transition="all 0.15s"
            >
              <Box display={{ base: "none", md: "block" }}>{item.label}</Box>
            </Button>
          ))}
        </Flex>
        <Divider borderColor={border} />
        {/* User profile */}
        <Flex align="center" justify="space-between" w="full">
          <Flex align="center" gap={3}>
            <Avatar src={userProfileSrc} size="md" />
            <Flex direction="column" gap={1} display={{ base: "none", md: "flex" }}>
              <Text fontWeight="medium" color={text}>
                {userName}
              </Text>
              <Text fontSize="xs" color={subText}>
                {userRole}
              </Text>
            </Flex>
          </Flex>
          <IconButton
            icon={<FaSignOutAlt />}
            variant="ghost"
            aria-label="Logout"
            color={text}
            _hover={{ color: accent, bg: hoverBg }}
            size="sm"
            onClick={() => {/* handle logout */}}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}