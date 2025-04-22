import { useState, useEffect, useRef } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  Flex,
  Spinner,
  useColorModeValue,
  useToast,
  Text,
  Avatar,
  useDisclosure,
  Button
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { BsChat } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';
import { t } from 'i18next';
import Fuse from 'fuse.js';

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Fuzzy search configuration
const fuseOptions = {
  keys: ['username', 'name', 'email'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
};

const HeaderSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const fuse = useRef(null);

  // Load all users for fuzzy search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users');
        setAllUsers(data);
        fuse.current = new Fuse(data, fuseOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const fuzzySearch = (query) => {
    if (!query || !fuse.current) return [];
    return fuse.current.search(query).map(result => result.item);
  };

  const searchHandler = async (query) => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }
    
    setIsSearching(true);
    try {
      // Use fuzzy search for users
      const fuzzyResults = fuzzySearch(query);
      
      // Still fetch posts from API
      const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      console.log("Search results:", data); // Debug the response
      
      setResults({
        users: fuzzyResults.length > 0 ? fuzzyResults : (Array.isArray(data.users) ? data.users : []),
        posts: Array.isArray(data.posts) ? data.posts : []
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: error.response?.data?.error || "Failed to search",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setResults({ users: [], posts: [] });
    } finally {
      setIsSearching(false);
    }
  };

  // Improved debounced search with proper delay
  const debouncedSearch = useRef(
    _.debounce(searchHandler, 300)
  ).current;

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setResults({ users: [], posts: [] });
    }
  };

  const handleResultClick = (type, item) => {
    setSearchText("");
    setIsExpanded(false);
    
    if (type === 'user') {
      navigate(`/${item.username}`);
    } else if (type === 'post') {
      navigate(`/${item.postedBy.username}/post/${item._id}`);
    }
  };

  // Chat access check
  const checkChatAccess = () => {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const hours = currentDate.getHours();
    
    if (currentUser?.role === 'student') {
      const isWeekday = day >= 1 && day <= 5;
      const isRestrictedTime = (hours >= 8 && hours < 15) && !(hours === 12 && currentDate.getMinutes() >= 50);
      return !isWeekday || !isRestrictedTime;
    }
    return true;
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <Box 
      ref={containerRef}
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      width="400px"
      zIndex="1400"
      backdropFilter="blur(12px)"
      borderRadius="20px"
      boxShadow="xl"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>
        
        <Input
          ref={inputRef}
          placeholder={t("Search users or posts...")}
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
          variant="filled"
          borderRadius="full"
          bg={useColorModeValue('white', 'gray.800')}
          _focus={{ boxShadow: "none" }}
        />
        
        {searchText && (
          <InputRightElement>
            {isSearching ? (
              <Spinner size="sm" />
            ) : (
              <CloseIcon
                fontSize="sm"
                cursor="pointer"
                onClick={() => {
                  setSearchText("");
                  setResults({ users: [], posts: [] });
                }}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>

      <AnimatePresence>
        {isExpanded && searchText && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
            style={{
              width: '100%',
              zIndex: 10,
              marginTop: '8px',
            }}
          >
            <Box
              bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)')}
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(12px)"
              maxH="500px"
              overflowY="auto"
            >
              {results.users?.length > 0 && (
                <Box mb={4} p={4}>
                  <Text fontWeight="bold" mb={2}>
                    {t("Users")}
                  </Text>
                  {results.users.map(user => (
                    <Flex 
                      key={user._id} 
                      align="center" 
                      justify="space-between" 
                      p={2}
                      borderRadius="md"
                      mb={1}
                    >
                      <Flex
                        align="center"
                        flex="1"
                        onClick={() => handleResultClick('user', user)}
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                        cursor="pointer"
                        p={2}
                        borderRadius="md"
                      >
                        <Avatar src={user.profilePic} size="sm" mr={3} />
                        <Text>{user.username}</Text>
                      </Flex>
                      
                      <Button
                        size="xs"
                        leftIcon={checkChatAccess() ? <BsChat /> : <FaLock />}
                        colorScheme={checkChatAccess() ? "teal" : "red"}
                        variant="ghost"
                        isDisabled={!checkChatAccess()}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/${user._id}`);
                        }}
                      >
                        {checkChatAccess() ? "Message" : "Locked"}
                      </Button>
                    </Flex>
                  ))}
                </Box>
              )}

              {results.posts?.length > 0 && (
                <Box p={4}>
                  <Text fontWeight="bold" mb={2}>
                    {t("Posts")}
                  </Text>
                  {results.posts.map(post => (
                    <Flex
                      key={post._id}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      cursor="pointer"
                      onClick={() => handleResultClick('post', post)}
                      transition="background 0.2s"
                      mb={1}
                    >
                      <Box>
                        <Text noOfLines={1} fontStyle="italic">"{post.text}"</Text>
                        <Text fontSize="sm" color="gray.500">by {post.postedBy.username}</Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              )}

              {!isSearching && searchText && results.users?.length === 0 && results.posts?.length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  No results found for "{searchText}"
                </Text>
              )}

              {isSearching && (
                <Flex justify="center" py={4}>
                  <Spinner size="md" />
                </Flex>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HeaderSearch;