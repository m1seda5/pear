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
  Portal,
  Slide
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
      setResults(data);
    } catch (error) {
      toast({
        title: "Search Error",
        description: error.response?.data?.error || "Failed to search",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useRef(
    _.debounce(searchHandler, 300)
  ).current;

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleResultClick = (type, item) => {
    setSearchText("");
    setIsExpanded(false);
    if (type === 'user') {
      navigate(`/${item.username}`);
    } else {
      navigate(`/${item.postedBy.username}/post/${item._id}`);
    }
  };

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
          placeholder="Search users or posts..."
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setTimeout(() => setIsExpanded(false), 100)}
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
                onClick={() => setSearchText("")}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>

      <AnimatePresence>
        {isExpanded && searchText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              width: '100%',
              zIndex: 10,
              marginTop: '8px',
            }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              borderRadius="lg"
              boxShadow="xl"
              p={4}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              maxH="60vh"
              overflowY="auto"
            >
              {results.users.length > 0 && (
                <>
                  <Text fontWeight="bold" mb={2}>Users</Text>
                  {results.users.map(user => (
                    <Flex
                      key={user._id}
                      align="center"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      cursor="pointer"
                      onClick={() => handleResultClick('user', user)}
                    >
                      <Avatar src={user.profilePic} size="sm" mr={3} />
                      <Text>{user.username}</Text>
                    </Flex>
                  ))}
                </>
              )}

              {results.posts.length > 0 && (
                <>
                  <Text fontWeight="bold" mt={4} mb={2}>Posts</Text>
                  {results.posts.map(post => (
                    <Flex
                      key={post._id}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      cursor="pointer"
                      onClick={() => handleResultClick('post', post)}
                    >
                      <Text noOfLines={1}>{post.text}</Text>
                    </Flex>
                  ))}
                </>
              )}

              {!isSearching && results.users.length === 0 && results.posts.length === 0 && (
                <Text color="gray.500">No results found</Text>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HeaderSearch;