import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import { HamburgerIcon, EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import AddMembersModal from "./AddMembersModal";

const GroupInfoModal = ({ isOpen, onClose, conversation, onGroupUpdate }) => {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(conversation?.groupName || "");
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateGroup = async () => {
    if (!groupName.trim()) {
      showToast("Error", "Group name cannot be empty", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/groups/${conversation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ groupName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      onGroupUpdate(data);
      setIsEditing(false);
      showToast("Success", "Group updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/groups/${conversation._id}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      onGroupUpdate(data);
      showToast("Success", "Member removed successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberAdded = (updatedConversation) => {
    onGroupUpdate(updatedConversation);
    showToast("Success", "Member added successfully", "success");
  };

  if (!conversation) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("white", "gray.800")}>
          <ModalHeader borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
            {isEditing ? (
              <Flex gap={2}>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
                <Button 
                  size="sm" 
                  onClick={handleUpdateGroup}
                  isLoading={isLoading}
                  colorScheme="blue"
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    setGroupName(conversation.groupName);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            ) : (
              <Flex align="center" gap={2}>
                {conversation.groupName}
                {currentUser._id === conversation.groupAdmin && (
                  <IconButton
                    icon={<EditIcon />}
                    size="xs"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit group name"
                  />
                )}
              </Flex>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} bg={useColorModeValue("gray.50", "gray.700")}>
            <Text fontWeight="bold" mb={4}>
              Members ({conversation.participants.length})
            </Text>
            
            {conversation.participants.map(participant => (
              <Flex 
                key={participant._id} 
                align="center" 
                justify="space-between" 
                p={2}
                borderRadius="md"
                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
              >
                <Flex align="center" gap={2}>
                  <Avatar 
                    size="sm" 
                    src={participant.profilePic}
                    name={participant.username}
                  />
                  <Text>
                    {participant.username}
                    {participant._id === conversation.groupAdmin && 
                      <Text as="span" color="blue.500" ml={1}>(Admin)</Text>
                    }
                  </Text>
                </Flex>
                
                {currentUser._id === conversation.groupAdmin && 
                  participant._id !== currentUser._id && (
                    <Menu>
                      <MenuButton 
                        as={IconButton} 
                        icon={<HamburgerIcon />} 
                        size="xs"
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<DeleteIcon />} 
                          onClick={() => handleRemoveMember(participant._id)}
                          isDisabled={isLoading}
                          color="red.500"
                        >
                          Remove
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
              </Flex>
            ))}

            {currentUser._id === conversation.groupAdmin && (
              <Button
                leftIcon={<AddIcon />}
                mt={4}
                w="full"
                colorScheme="blue"
                onClick={() => setIsAddMembersOpen(true)}
                isDisabled={isLoading}
              >
                Add Members
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AddMembersModal
        isOpen={isAddMembersOpen}
        onClose={() => setIsAddMembersOpen(false)}
        conversationId={conversation._id}
        onMemberAdded={handleMemberAdded}
      />
    </>
  );
};

export default GroupInfoModal;