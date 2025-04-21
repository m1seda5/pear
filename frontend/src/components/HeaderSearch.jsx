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
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';
import { t } from 'i18next';

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const HeaderSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const searchHandler = async (query) => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }
    
    setIsSearching(true);
    try {
      const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      console.log("Search results:", data); // Debug the response
      setResults({
        users: Array.isArray(data.users) ? data.users : [],
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
      position="relative"
      flex="1"
      maxW={isExpanded ? "500px" : "200px"}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
              position: 'absolute',
              top: '100%',
              width: '100%',
              zIndex: 10,
              marginTop: '8px',
            }}
          >
            <Box
              bg={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.6)')}
              borderRadius="lg"
              p={4}
              border="1px solid rgba(255, 255, 255, 0.1)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(12px)"
              maxH="400px" // Fixed height instead of vh units
            >
              {results.users?.length > 0 && (
                <Box mb={4}>
                  <Text fontWeight="bold" mb={2}>
                    {t("Users")}
                  </Text>
                  {results.users.map(user => (
                    <Flex
                      key={user._id}
                      align="center"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      cursor="pointer"
                      onClick={() => handleResultClick('user', user)}
                      transition="background 0.2s"
                    >
                      <Avatar src={user.profilePic} size="sm" mr={3} />
                      <Text>{user.username}</Text>
                    </Flex>
                  ))}
                </Box>
              )}

              {results.posts?.length > 0 && (
                <Box>
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
                <Text color="gray.500" textAlign="center" py={2}>
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