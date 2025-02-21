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
  Box,
  Text,
  List,
  ListItem,
  useColorModeValue
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const MAX_GROUP_MEMBERS = 50;

const GroupCreationModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  const checkExistingGroup = async (name) => {
    const res = await fetch(
      `/api/messages/groups/check?name=${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
    return res.json();
  };

  const handleSearchUser = async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    setSearchResults([]);

    try {
      // Fix: Update to match the route in your backend
      const res = await fetch(`/api/users/search/${encodeURIComponent(searchInput.toLowerCase())}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to search user");

      // Don't show current user or already selected users in results
      if (
        data._id !== currentUser._id &&
        !selectedUsers.some((user) => user._id === data._id)
      ) {
        setSearchResults([data]);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.length >= MAX_GROUP_MEMBERS - 1) {
      showToast(
        "Error",
        `Maximum ${MAX_GROUP_MEMBERS} members allowed`,
        "error"
      );
      return;
    }

    setSelectedUsers((prev) => [...prev, user]);
    setSearchResults([]);
    setSearchInput("");
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 1) {
      showToast("Error", "Please add at least one member", "error");
      return;
    }
  
    const groupName = document.getElementById("groupName").value;
    if (!groupName.trim()) {
      showToast("Error", "Please enter a group name", "error");
      return;
    }
  
    setLoading(true);
    try {
      // Check if group already exists
      const existingGroup = await checkExistingGroup(groupName);
      if (existingGroup) {
        showToast("Error", "Group with this name already exists", "error");
        setLoading(false);
        return;
      }
  
      // Fix: Update API endpoint to match backend routes
      const res = await fetch("/api/messages/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          participants: selectedUsers.map((u) => u._id),
          groupName: groupName,
        }),
      });
  
      // Safely handle response parsing
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response:", text.substring(0, 100));
        throw new Error("Server returned invalid JSON response");
      }
  
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
      <ModalContent bg={useColorModeValue("white", "gray.800")}>
        <ModalHeader borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>Create New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} bg={useColorModeValue("gray.50", "gray.700")}>
          <Input placeholder="Group Name" id="groupName" mb={4} required />

          <Flex gap={2} mb={4} wrap="wrap">
            {selectedUsers.map((user) => (
              <Tag key={user._id} size="md" borderRadius="full">
                <TagLabel>{user.username}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u._id !== user._id)
                    )
                  }
                />
              </Tag>
            ))}
          </Flex>

          <Box position="relative">
            <Flex gap={2}>
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchUser()}
                variant="filled"
                _focus={{ bg: useColorModeValue("gray.100", "gray.600") }}
                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
              />
              <Button
                onClick={handleSearchUser}
                isLoading={searching}
                isDisabled={selectedUsers.length >= MAX_GROUP_MEMBERS - 1}
              >
                Search
              </Button>
            </Flex>

            {searchResults.length > 0 && (
              <List
                position="absolute"
                top="100%"
                left={0}
                right={0}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow="md"
                borderRadius="md"
                mt={2}
                maxH="200px"
                overflowY="auto"
                zIndex={1}
              >
                {searchResults.map((user) => (
                  <ListItem
                    key={user._id}
                    p={2}
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                    onClick={() => handleSelectUser(user)}
                  >
                    <Text>{user.username}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

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