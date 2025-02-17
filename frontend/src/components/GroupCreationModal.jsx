import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const MAX_GROUP_MEMBERS = 50; // Define the maximum number of group members

const GroupCreationModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  const handleSearchUser = async () => {
    if (!searchInput.trim() || selectedUsers.length >= MAX_GROUP_MEMBERS - 1) return;

    try {
      const res = await fetch(`/api/users/search/${searchInput}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to search user");
      if (data._id === currentUser._id) return;

      setSelectedUsers(prev => [...new Set([...prev, data])]);
      setSearchInput("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 1) {
      showToast("Error", "Please add at least one member", "error");
      return;
    }

    const groupName = document.getElementById('groupName').value;
    if (!groupName.trim()) {
      showToast("Error", "Please enter a group name", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/messages/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          participants: selectedUsers.map(u => u._id),
          groupName: groupName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group");
      
      onGroupCreated(data);
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Group Name"
            id="groupName"
            mb={4}
            required
          />

          <Flex gap={2} mb={4} wrap="wrap">
            {selectedUsers.map(user => (
              <Tag key={user._id} size="md" borderRadius="full">
                <TagLabel>{user.username}</TagLabel>
                <TagCloseButton onClick={() =>
                  setSelectedUsers(prev => prev.filter(u => u._id !== user._id))
                } />
              </Tag>
            ))}
          </Flex>

          <Flex gap={2}>
            <Input
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
            />
            <Button
              onClick={handleSearchUser}
              isDisabled={selectedUsers.length >= MAX_GROUP_MEMBERS - 1}
            >
              Add
            </Button>
          </Flex>

          <Button
            colorScheme="green"
            mt={4}
            w="full"
            onClick={handleCreateGroup}
            isLoading={loading}
          >
            Create Group ({selectedUsers.length + 1} members)
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GroupCreationModal;