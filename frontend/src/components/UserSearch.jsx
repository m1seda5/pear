import { useState, useEffect, useRef } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  List,
  ListItem,
  Avatar,
  Text,
  Flex,
  Spinner,
  Button,
  Badge,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

const UserSearch = ({ onUserSelect, selectedUsers = [], excludeIds = [], placeholder, isReviewerOnly = false }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { t } = useTranslation();
  const toast = useToast();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  
  // Color mode values
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");
  
  // Debounce search function to avoid excessive API calls
  const debouncedSearch = useRef(
    debounce(async (term) => {
      if (term.length < 2) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const endpoint = isReviewerOnly 
          ? `/api/users/search-reviewers/${encodeURIComponent(term)}`
          : `/api/users/search/${encodeURIComponent(term)}`;
        
        const res = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
          },
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          if (res.status === 404) {
            setSearchResults([]);
            setNoResults(true);
            return;
          }
          throw new Error(data.error || "Search failed");
        }
        
        // Filter out current user, already selected users, and any explicitly excluded users
        const filtered = Array.isArray(data) 
          ? data.filter(user => 
              user._id !== currentUser._id &&
              !selectedUsers.some(selected => selected._id === user._id) &&
              !excludeIds.includes(user._id)
            )
          : data._id !== currentUser._id && 
            !selectedUsers.some(selected => selected._id === data._id) &&
            !excludeIds.includes(data._id)
            ? [data] 
            : [];
            
        setSearchResults(filtered);
        setNoResults(filtered.length === 0);
      } catch (error) {
        toast({
          title: t("Search Error"),
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 500)
  ).current;
  
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  
  // Handle search text changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    if (value.trim()) {
      debouncedSearch(value.trim());
    } else {
      debouncedSearch.cancel();
      setSearchResults([]);
      setNoResults(false);
    }
  };
  
  // Handle selecting a user from results
  const handleSelectUser = (user) => {
    onUserSelect(user);
    setSearchText("");
    setSearchResults([]);
    setNoResults(false);
    inputRef.current?.focus();
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchResults([]);
        setNoResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Clear search
  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setNoResults(false);
    inputRef.current?.focus();
  };
  
  return (
    <Box position="relative" width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>
        
        <Input
          ref={inputRef}
          placeholder={placeholder || t('Search for users...')}
          value={searchText}
          onChange={handleSearchChange}
          variant="filled"
          _focus={{ bg: useColorModeValue("gray.100", "gray.600") }}
          _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
          pr="4.5rem"
        />
        
        <InputRightElement width="4.5rem">
          {isSearching ? (
            <Spinner size="sm" color="blue.500" mr={2} />
          ) : searchText ? (
            <Button h="1.75rem" size="sm" onClick={clearSearch}>
              <CloseIcon boxSize={3} />
            </Button>
          ) : null}
        </InputRightElement>
      </InputGroup>
      
      {(searchResults.length > 0 || noResults) && (
        <List
          ref={resultsRef}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          maxH="300px"
          overflowY="auto"
          bg={bgColor}
          boxShadow="md"
          borderRadius="md"
          zIndex={10}
          border="1px solid"
          borderColor={borderColor}
        >
          {noResults ? (
            <Box p={4} textAlign="center">
              <Text color={textColor}>{t('No users found')}</Text>
              <Text fontSize="sm" mt={1}>
                {t('Try a different search term or check spelling')}
              </Text>
            </Box>
          ) : (
            searchResults.map((user) => (
              <ListItem
                key={user._id}
                px={3}
                py={2}
                cursor="pointer"
                borderBottom="1px solid"
                borderColor={borderColor}
                _hover={{ bg: hoverBg }}
                onClick={() => handleSelectUser(user)}
                transition="background-color 0.2s"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Avatar 
                      size="sm" 
                      name={user.username} 
                      src={user.profilePic} 
                      mr={3}
                      bg={user.profilePic ? "transparent" : "blue.500"}
                    />
                    <Box>
                      <Text fontWeight="medium">{user.username}</Text>
                      {user.department && (
                        <Text fontSize="xs" color="gray.500">
                          {user.department}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  
                  <Flex align="center">
                    {user.isActive && (
                      <Badge colorScheme="green" variant="subtle" mr={2} fontSize="xs">
                        {t('Online')}
                      </Badge>
                    )}
                    <Badge colorScheme={user.role === 'admin' ? 'red' : user.role === 'teacher' ? 'purple' : 'blue'} variant="subtle" fontSize="xs">
                      {user.role}
                    </Badge>
                  </Flex>
                </Flex>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default UserSearch;