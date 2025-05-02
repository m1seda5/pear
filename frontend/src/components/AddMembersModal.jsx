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
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const AddMembersModal = ({ isOpen, onClose, conversationId, onMemberAdded }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const toast = useToast();

  const handleSearchUser = async () => {
    if (!searchInput.trim()) return;

    try {
      const res = await fetch(`/api/users/search/${encodeURIComponent(searchInput.toLowerCase())}`, {
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
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user to add",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const promises = selectedUsers.map(user => 
        fetch(`/api/messages/groups/${conversationId}/add`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ userId: user._id })
        }).then(res => res.json())
      );

      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: "Members added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onMemberAdded && onMemberAdded(selectedUsers);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue("white", "gray.800")}>
        <ModalHeader borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>Add Members</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} bg={useColorModeValue("gray.50", "gray.700")}>
          <Flex gap={2} mb={4} wrap="wrap">
            {selectedUsers.map(user => (
              <Tag key={user._id} size="md" borderRadius="full">
                <TagLabel>{user.username}</TagLabel>
                <TagCloseButton 
                  onClick={() => setSelectedUsers(prev => 
                    prev.filter(u => u._id !== user._id)
                  )} 
                />
              </Tag>
            ))}
          </Flex>

          <Flex gap={2}>
            <Input
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
              variant="filled"
              _focus={{ bg: useColorModeValue("gray.100", "gray.600") }}
              _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
            />
            <Button onClick={handleSearchUser}>
              Search
            </Button>
          </Flex>

          <Button
            colorScheme="blue"
            mt={4}
            w="full"
            onClick={handleAddMembers}
            isLoading={loading}
          >
            Add Selected Members
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddMembersModal;