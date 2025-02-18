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
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();

  const handleSelectConversation = () => {
    setSelectedConversation({
      _id: conversation._id,
      userId: user._id,
      userProfilePic: user.profilePic,
      username: conversation.isGroup ? conversation.groupName : user.username,
      mock: conversation.mock,
      isGroup: conversation.isGroup,
    });
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
      onClick={handleSelectConversation}
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.400"
            : "gray.dark"
          : ""
      }
      borderRadius={"md"}
    >
      {conversation.isGroup ? (
        <>
          <Icon as={FaUsers} color="blue.500" mr={2} />
          <AvatarGroup size="sm" max={3}>
            {conversation.participants.slice(0, 3).map(p => (
              <Avatar 
                key={p._id} 
                src={p.profilePic}
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
              {conversation.groupName}
              <Text fontSize="xs" color="gray.500" ml={2}>
                {conversation.participants.length} members
              </Text>
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
              {currentUser._id === lastMessage.sender ? (
                <Box color={lastMessage.seen ? "blue.400" : ""}>
                  <BsCheck2All size={16} />
                </Box>
              ) : (
                ""
              )}
              {lastMessage.text.length > 18
                ? lastMessage.text.substring(0, 18) + "..."
                : lastMessage.text || <BsFillImageFill size={16} />}
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
              src={user.profilePic}
            >
              {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
            </Avatar>
          </WrapItem>

          <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight="700" display={"flex"} alignItems={"center"}>
              {user.username}
              {user?.role === "admin" && (
                <Image src="/verified.png" w={4} h={4} ml={1} />
              )}
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
              {currentUser._id === lastMessage.sender ? (
                <Box color={lastMessage.seen ? "blue.400" : ""}>
                  <BsCheck2All size={16} />
                </Box>
              ) : (
                ""
              )}
              {lastMessage.text.length > 18
                ? lastMessage.text.substring(0, 18) + "..."
                : lastMessage.text || <BsFillImageFill size={16} />}
            </Text>
          </Stack>
        </>
      )}
    </Flex>
  );
};

export default Conversation;