import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  useColorModeValue,
  Avatar,
  Button,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { BsSearch, BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { RxAvatar } from "react-icons/rx";
import { FaLock, FaUserShield } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";

export default function Sidebar({ onQuickNotes }) {
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const navigate = useNavigate();
  const [showLockIcon, setShowLockIcon] = useState({ chat: false, tv: false });
  const colorMode = useColorModeValue("light", "dark");
  const toggleColorMode = () => {
    const event = new CustomEvent("toggleColorMode");
    window.dispatchEvent(event);
  };

  // User info
  const username = user?.username || "";
  const yearGroup = user?.yearGroup || "";
  const profilePic = user?.profilePic || "/user-profile.png";
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  // Chat access logic (from Header)
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

  // Sidebar style
  const bg = useColorModeValue("white", "#181c1f");
  const border = useColorModeValue("gray.100", "gray.700");
  const text = useColorModeValue("gray.700", "gray.200");
  const subText = useColorModeValue("gray.400", "gray.500");
  const hoverBg = useColorModeValue("gray.100", "#23282c");
  const activeBg = useColorModeValue("#eafaf1", "#1e2a22");
  const accent = useColorModeValue("#27ae60", "#219150");

  // Sidebar nav items
  const navItems = [
    {
      icon: <AiFillHome size={22} />, label: "Home", onClick: () => navigate("/"),
    },
    {
      icon: <BsSearch size={22} />, label: "Search", onClick: () => {/* TODO: open search modal */},
    },
    {
      icon: colorMode === "dark" ? <SunIcon boxSize={5} /> : <MoonIcon boxSize={5} />, label: colorMode === "dark" ? "Light Mode" : "Dark Mode", onClick: toggleColorMode,
    },
    user && {
      icon: <RxAvatar size={22} />, label: "Profile", onClick: () => navigate(`/${username}`),
    },
    user && {
      icon: <BsFillChatQuoteFill size={22} />, label: "Chat", onClick: hasChatAccess && !user.isFrozen ? () => navigate("/chat") : undefined, isDisabled: user.isFrozen || !hasChatAccess, lock: user.isFrozen || !hasChatAccess,
    },
    user && isAdmin && {
      icon: <PiTelevisionSimpleBold size={22} />, label: "TV", onClick: () => navigate("/tv"),
    },
    user && isAdmin && {
      icon: <FaUserShield size={22} />, label: "Admin Dashboard", onClick: () => navigate("/admin"),
    },
    {
      icon: <MdOutlineSettings size={22} />, label: "Settings", onClick: () => navigate("/settings"),
    },
    {
      icon: <Box as="span" fontWeight="bold" fontSize="lg">Q</Box>, label: "Quick Notes", onClick: onQuickNotes,
    },
    {
      icon: <FiLogOut size={22} />, label: "Logout", onClick: async () => { await logout(); navigate("/auth"); },
    },
  ].filter(Boolean);

  return (
    <Flex
      direction="column"
      w={{ base: "64px", md: "250px" }}
      h="calc(100vh - 32px)"
      justify="space-between"
      px={{ base: 2, md: 4 }}
      py={4}
      bg={bg}
      borderRadius="2xl"
      boxShadow="2xl"
      border="1px solid"
      borderColor={border}
      position="fixed"
      top={4}
      left={4}
      zIndex={100}
      transition="width 0.2s"
    >
      {/* Top: Logo */}
      <Flex align="center" gap={3} mb={8}>
        <Box w="40px" h="40px" bg={hoverBg} rounded="md" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
          <img src="/pear.png" alt="Pear Logo" className="w-full h-full object-cover" />
        </Box>
        <Text fontWeight="bold" fontSize="lg" color={text} display={{ base: "none", md: "block" }}>Pear</Text>
      </Flex>
      {/* Nav */}
      <Flex direction="column" gap={2} flex={1}>
        {navItems.map((item, idx) => (
          <Tooltip label={item.label} placement="right" key={item.label} isDisabled={!!item.isDisabled || undefined}>
            <Button
              key={item.label}
              variant="ghost"
              justifyContent="flex-start"
              alignItems="center"
              w="full"
              px={3}
              py={2.5}
              h="auto"
              leftIcon={item.lock ? <FaLock size={18} color="#E53E3E" /> : item.icon}
              onClick={item.isDisabled ? undefined : item.onClick}
              bg={item.active ? activeBg : "transparent"}
              color={item.isDisabled ? "red.400" : text}
              _hover={{ bg: hoverBg, color: accent }}
              fontWeight={item.active ? "bold" : "normal"}
              fontSize="md"
              transition="all 0.15s"
              isDisabled={item.isDisabled}
            >
              <Box display={{ base: "none", md: "block" }}>{item.label}</Box>
            </Button>
          </Tooltip>
        ))}
      </Flex>
      {/* Bottom: User info */}
      {user && (
        <Flex align="center" gap={3} mt={8}>
          <Avatar src={profilePic} size="md" />
          <Flex direction="column" gap={1} display={{ base: "none", md: "flex" }}>
            <Text fontWeight="medium" color={text}>{username}</Text>
            <Text fontSize="xs" color={subText}>{yearGroup}</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}