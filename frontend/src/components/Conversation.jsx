import React from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Box,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const Conversation = ({ conversation, isOnline, onClick, isMonitoring }) => {
  // Early return if conversation is invalid
  if (!conversation || typeof conversation !== 'object') {
    return null;
  }

  const currentUser = useRecoilValue(userAtom);
  const { colorMode } = useColorMode();
  
  // Safely access conversation properties with defaults
  const participants = conversation.participants || [];
  const user = conversation.isGroup ? null : participants[0] || {};
  const lastMessage = conversation.lastMessage || { text: '', sender: '' };
  const groupName = conversation.groupName || '';
  
  // Handle the click event
  const handleClick = () => {
    if (onClick) {
      onClick(conversation);
    }
  };

  return (
    <Flex
      p={2}
      align="center"
      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
      cursor="pointer"
      borderRadius="md"
      onClick={handleClick}
    >
      {conversation.isGroup ? (
        <Flex align="center" gap={3} w="full">
          <AvatarGroup size="sm" max={2} spacing="-0.5rem">
            {participants.slice(0, 3).map((p) => (
              <Avatar
                key={p?._id}
                src={p?.profilePic}
                name={p?.username}
                size="sm"
                border="2px solid"
                borderColor={useColorModeValue("white", "gray.800")}
              />
            ))}
          </AvatarGroup>
          
          <Flex direction="column" flex={1}>
            <Text fontWeight="600" fontSize="sm">
              {groupName}
            </Text>
            <Flex align="center" gap={1}>
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {lastMessage?.text || <BsFillImageFill size={12} />}
              </Text>
              {conversation.unreadCount > 0 && (
                <Badge colorScheme="green" ml={1} fontSize="2xs">
                  {conversation.unreadCount}
                </Badge>
              )}
            </Flex>
          </Flex>
          
          <Text fontSize="2xs" color="gray.500" whiteSpace="nowrap">
            {formatTime(conversation.updatedAt)}
          </Text>
        </Flex>
      ) : (
        <Flex align="center" gap={4}>
          <WrapItem>
            <Avatar
              size={{
                base: "xs",
                sm: "sm",
                md: "md",
              }}
              src={user?.profilePic}
              name={user?.username}
            >
              {isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
            </Avatar>
          </WrapItem>

          <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight="700" display={"flex"} alignItems={"center"}>
              {user?.username}
              {user?.role === "admin" && (
                <Image src="/verified.png" w={4} h={4} ml={1} />
              )}
            </Text>
            <Text
              fontSize={"xs"}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              {currentUser._id === lastMessage?.sender && (
                <Box color={lastMessage?.seen ? "blue.400" : ""}>
                  <BsCheck2All size={16} />
                </Box>
              )}
              {lastMessage?.text ? (
                lastMessage.text.length > 18 
                  ? `${lastMessage.text.substring(0, 18)}...`
                  : lastMessage.text
              ) : (
                <BsFillImageFill size={16} />
              )}
            </Text>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
};

export default Conversation;