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
  Avatar,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  useColorModeValue,
  Divider
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from 'react-i18next';
import UserSearch from "./UserSearch"; // Import our new component

const MAX_GROUP_MEMBERS = 50;

const GroupCreationModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const { t } = useTranslation();
  
  // Color mode values
  const tagBg = useColorModeValue("blue.50", "blue.800");
  const tagColor = useColorModeValue("blue.800", "blue.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const checkExistingGroup = async (name) => {
    if (!name.trim()) return null;
    
    try {
      const res = await fetch(
        `/api/messages/groups/check?name=${encodeURIComponent(name.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Error checking group name:", error);
      return null;
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.length >= MAX_GROUP_MEMBERS - 1) {
      showToast(
        "Error",
        t(`Maximum ${MAX_GROUP_MEMBERS} members allowed`),
        "error"
      );
      return;
    }

    setSelectedUsers(prev => [...prev, user]);
  };
  
  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user._id !== userId));
  };

  const handleGroupNameChange = async (e) => {
    const value = e.target.value;
    setGroupName(value);
    setError("");
    
    // Check for duplicate group name when user has typed at least 3 characters
    if (value.trim().length >= 3) {
      const existingGroup = await checkExistingGroup(value);
      if (existingGroup) {
        setError(t("A group with this name already exists"));
      }
    }
  };

  const handleCreateGroup = async () => {
    // Validation
    if (!groupName.trim()) {
      setError(t("Please enter a group name"));
      return;
    }
    
    if (selectedUsers.length < 1) {
      showToast("Error", t("Please add at least one member"), "error");
      return;
    }
    
    // Final check for duplicate group name
    const existingGroup = await checkExistingGroup(groupName);
    if (existingGroup) {
      setError(t("A group with this name already exists"));
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch("/api/messages/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          participants: selectedUsers.map((u) => u._id),
          groupName: groupName.trim(),
        }),
      });
      
      // Handle JSON parsing safely
      let data;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(t("Server returned invalid response"));
      }
  
      if (!res.ok) throw new Error(data.error || t("Failed to create group"));
  
      onGroupCreated(data);
      resetForm();
      onClose();
      
      showToast("Success", t("Group created successfully"), "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setGroupName("");
    setSelectedUsers([]);
    setError("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={useColorModeValue("white", "gray.800")}>
        <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
          {t("Create New Group")}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6} bg={useColorModeValue("gray.50", "gray.700")}>
          <Stack spacing={4} my={2}>
            {/* Group Name Input */}
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>{t("Group Name")}</FormLabel>
              <Input 
                placeholder={t("Enter group name")}
                value={groupName}
                onChange={handleGroupNameChange}
                bg={useColorModeValue("white", "gray.800")}
              />
              {error && <FormHelperText color="red.500">{error}</FormHelperText>}
            </FormControl>
            
            {/* User Search */}
            <FormControl>
              <FormLabel>{t("Search and Add Members")}</FormLabel>
              <UserSearch
                placeholder={t("Type username or email...")}
                onUserSelect={handleUserSelect}
                selectedUsers={selectedUsers}
              />
              <FormHelperText>
                {t("{{current}}/{{max}} members selected", { 
                  current: selectedUsers.length + 1, // +1 for current user
                  max: MAX_GROUP_MEMBERS 
                })}
              </FormHelperText>
            </FormControl>
            
            {/* Selected Members */}
            {selectedUsers.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>{t("Selected Members")}</Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedUsers.map((user) => (
                    <Tag
                      key={user._id}
                      size="md"
                      borderRadius="full"
                      variant="subtle"
                      bg={tagBg}
                      color={tagColor}
                    >
                      <Avatar
                        src={user.profilePic}
                        size="xs"
                        name={user.username}
                        ml={-1}
                        mr={2}
                      />
                      <TagLabel>{user.username}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveUser(user._id)}
                      />
                    </Tag>
                  ))}
                </Flex>
              </Box>
            )}
          </Stack>

          <Divider my={4} borderColor={borderColor} />
          
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleCreateGroup}
            isLoading={loading}
            isDisabled={!groupName.trim() || selectedUsers.length < 1 || !!error}
          >
            {t("Create Group")}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GroupCreationModal;