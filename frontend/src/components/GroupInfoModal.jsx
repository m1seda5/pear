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
    useToast,
    Input,
    Button
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
    const [groupName, setGroupName] = useState(conversation.groupName);
    const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  
    const handleUpdateGroup = async () => {
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
      }
    };
  
    const handleRemoveMember = async (userId) => {
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
      }
    };
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? (
                <Flex gap={2}>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button size="sm" onClick={handleUpdateGroup}>Save</Button>
                  <Button size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                </Flex>
              ) : (
                <Flex align="center" gap={2}>
                  {conversation.groupName}
                  {currentUser._id === conversation.groupAdmin && (
                    <IconButton
                      icon={<EditIcon />}
                      size="xs"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </Flex>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" mb={4}>Members ({conversation.participants.length})</Text>
              
              {conversation.participants.map(participant => (
                <Flex key={participant._id} align="center" justify="space-between" p={2}>
                  <Flex align="center" gap={2}>
                    <Avatar size="sm" src={participant.profilePic} />
                    <Text>
                      {participant.username}
                      {participant._id === conversation.groupAdmin && " (Admin)"}
                    </Text>
                  </Flex>
                  
                  {currentUser._id === conversation.groupAdmin && 
                    participant._id !== currentUser._id && (
                      <Menu>
                        <MenuButton as={IconButton} icon={<HamburgerIcon />} size="xs" />
                        <MenuList>
                          <MenuItem 
                            icon={<DeleteIcon />} 
                            onClick={() => handleRemoveMember(participant._id)}
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
                  onClick={() => setIsAddMembersOpen(true)}
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
          conversation={conversation}
          onGroupUpdate={onGroupUpdate}
        />
      </>
    );
  };
  
  export default GroupInfoModal;