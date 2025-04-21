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

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

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
      // Ensure users and posts are arrays
      setResults({
        users: data.users || [],
        posts: data.posts || []
      });
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
            <MotionBox
              bg={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.6)')}
              borderRadius="lg"
              p={4}
              border="1px solid rgba(255, 255, 255, 0.1)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(12px)"
              maxH="60vh"
              overflowY="auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
            >
              {results.users?.length > 0 && (
                <>
                  <MotionText fontWeight="bold" mb={2} variants={itemVariants}>
                    {t("Users")}
                  </MotionText>
                  {results.users.map(user => (
                    <motion.div key={user._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Flex
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
                    </motion.div>
                  ))}
                </>
              )}

              {results.posts?.length > 0 && (
                <>
                  <MotionText fontWeight="bold" mt={4} mb={2} variants={itemVariants}>
                    {t("Posts")}
                  </MotionText>
                  {results.posts.map(post => (
                    <motion.div key={post._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Flex
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                        cursor="pointer"
                        onClick={() => handleResultClick('post', post)}
                      >
                        <Text noOfLines={1} fontStyle="italic">"{post.text}"</Text>
                        <Text ml={2} color="gray.500">by {post.postedBy.username}</Text>
                      </Flex>
                    </motion.div>
                  ))}
                </>
              )}

              {!isSearching && results.users?.length === 0 && results.posts?.length === 0 && (
                <MotionText color="gray.500" variants={itemVariants}>
                  No results found for "{searchText}"
                </MotionText>
              )}
            </MotionBox>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HeaderSearch;