import { useState, useRef } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Box,
  Text,
  Flex,
  Avatar,
  Stack,
  IconButton,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";
import TagsInput from "./TagsInput"; // Import the TagsInput component

const CreateGroup = ({ onGroupCreated, groups }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3182CE"); // Default blue color
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const { t } = useTranslation();
  
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Transform selected users into tag format for the TagsInput component
  const selectedUserTags = selectedUsers.map(user => ({
    id: user._id,
    label: user.username,
    profilePic: user.profilePic // Add profile pic for avatar display
  }));

  // Handle changes from the TagsInput component
  const handleUserTagsChange = (newTags) => {
    // Convert tags back to user objects
    setSelectedUsers(newTags.map(tag => ({
      _id: tag.id,
      username: tag.label,
      profilePic: tag.profilePic
    })));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/users/search/${searchQuery}`);
      const data = await res.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setSearchResults([]);
        return;
      }
      
      // Filter out current user and already selected users
      const filteredResults = Array.isArray(data) 
        ? data.filter(u => 
            u._id !== user._id && 
            !selectedUsers.some(selected => selected._id === u._id)
          )
        : [data].filter(u => 
            u._id !== user._id && 
            !selectedUsers.some(selected => selected._id === u._id)
          );
      
      setSearchResults(filteredResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search users",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchResults(searchResults.filter(u => u._id !== user._id));
    setSearchQuery("");
  };

  // Create search results as suggestions for TagsInput
  const userSuggestions = searchResults.map(user => ({
    id: user._id,
    label: user.username,
    profilePic: user.profilePic
  }));

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const memberIds = [...selectedUsers.map(u => u._id), user._id];
      
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: groupName,
          description,
          color,
          members: memberIds
        })
      });

      const responseText = await res.text();

      if (!res.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { error: responseText };
        }
        throw new Error(errorData.error || "Failed to create group");
      }

      const data = JSON.parse(responseText);
      
      toast({
        title: "Success",
        description: "Group created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setGroupName("");
      setDescription("");
      setColor("#3182CE");
      setSelectedUsers([]);
      setSearchResults([]);
      setSearchQuery("");
      
      onClose();
      
      // Callback to refresh groups in parent component
      if (onGroupCreated) {
        onGroupCreated(data);
      }
    } catch (error) {
      console.error("Group creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Custom render function for user tags to include avatar
  const renderUserTag = (tag) => (
    <Flex align="center">
      <Avatar src={tag.profilePic} size="xs" mr={2} />
      <Text>{tag.label}</Text>
    </Flex>
  );

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        onClick={onOpen}
        size="sm"
      >
        {t("Create Group")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Create Posting Group")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t("Group Name")}</FormLabel>
                <Input 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  placeholder={t("Enter group name")}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t("Description")}</FormLabel>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder={t("Enter group description")}
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t("Group Color")}</FormLabel>
                <Flex align="center">
                  <Input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    w="80px"
                    mr={3}
                  />
                  <Box 
                    w="24px" 
                    h="24px" 
                    borderRadius="md" 
                    bg={color} 
                    border="1px solid"
                    borderColor={borderColor}
                  />
                </Flex>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t("Add Members")}</FormLabel>
                <InputGroup>
                  <Input 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder={t("Search by username or email")}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <InputRightElement>
                    {isSearching ? (
                      <Spinner size="sm" />
                    ) : (
                      <IconButton
                        aria-label="Search"
                        icon={<SearchIcon />}
                        size="sm"
                        onClick={handleSearch}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              {/* Search results display */}
              {searchResults.length > 0 && (
                <Box
                  mt={2}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={2}
                  maxH="150px"
                  overflowY="auto"
                >
                  {searchResults.map((result) => (
                    <Flex 
                      key={result._id} 
                      align="center" 
                      justify="space-between"
                      p={2}
                      _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleAddUser(result)}
                    >
                      <Flex align="center">
                        <Avatar size="sm" src={result.profilePic} mr={2} />
                        <Text>{result.username}</Text>
                      </Flex>
                      <IconButton
                        icon={<AddIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        aria-label="Add user"
                      />
                    </Flex>
                  ))}
                </Box>
              )}
              
              {/* TagsInput for selected members */}
              {selectedUsers.length > 0 && (
                <Box mt={4}>
                  <TagsInput
                    label={t("Selected Members")}
                    suggestions={userSuggestions}
                    selectedTags={selectedUserTags}
                    onTagsChange={handleUserTagsChange}
                    maxTags={10}
                    placeholderText={t("No members selected")}
                    colorSchemes={[
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    ]}
                  />
                </Box>
              )}

              {/* Empty state for groups */}
              {groups && groups.length === 0 && (
                <Text textAlign="center" mt={4}>
                  {t("No groups found. Create your first group!")}
                </Text>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateGroup}
              isLoading={isCreating}
            >
              {t("Create Group")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroup;