import {
  Flex,
  AvatarGroup,
  Avatar,
  Text,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import GroupInfoModal from "./GroupInfoModal";

const GroupMessageHeader = ({ conversation }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex w="full" h={12} alignItems="center" gap={2}>
        <AvatarGroup size="sm" max={3} mr={2}>
          {(conversation.participants || []).map((participant) => (
            <Avatar
              key={participant._id}
              src={participant.profilePic}
              name={participant.username}
            />
          ))}
        </AvatarGroup>
        <Text fontWeight="bold" flex={1}>
          {conversation.groupName}
        </Text>
        <IconButton
          icon={<InfoIcon />}
          aria-label="Group info"
          size="sm"
          onClick={onOpen}
        />
      </Flex>

      <GroupInfoModal
        isOpen={isOpen}
        onClose={onClose}
        conversation={conversation}
        onGroupUpdate={(updatedGroup) => {
          // Update your state here
        }}
      />
    </>
  );
};

export default GroupMessageHeader;
