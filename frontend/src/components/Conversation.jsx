import React from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
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
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={handleClick}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius={"md"}
    >
      {conversation.isGroup ? (
        <>
          <Icon as={FaUsers} color="blue.500" mr={2} />
          <AvatarGroup size="sm" max={3}>
            {participants.slice(0, 3).map((p) => (
              <Avatar
                key={p?._id || Math.random()}
                src={p?.profilePic}
                name={p?.username}
                size={{
                  base: "xs",
                  sm: "sm",
                  md: "md",
                }}
              />
            ))}
          </AvatarGroup>
          <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight="700" display={"flex"} alignItems={"center"}>
              {groupName}
              {participants.length > 0 && (
                <Text fontSize="xs" color="gray.500" ml={2}>
                  {participants.length} members
                </Text>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </Flex>
  );
};

export default Conversation;