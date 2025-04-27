import React, { useEffect, useState } from "react";
import { Flex, Box, Text, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import TutorialSlider from "../components/TutorialSlider";
import Post from "../components/Post";
import GameWidget from "../components/GameWidget";

const HomePage = () => {
  const { t } = useTranslation();
  const [showTutorial, setShowTutorial] = useState(true);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [isLargerThan1024, setIsLargerThan1024] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
        setNewPosts(data.filter(post => isNewPost(post.createdAt)));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargerThan1024(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <>
      {showTutorial && <TutorialSlider onComplete={handleTutorialComplete} />}
      <Flex
        gap="10"
        alignItems="flex-start"
        justify="center"
        w="100%"
        maxW="1400px"
        mx="auto"
        px={{ base: 2, md: 6 }}
      >
        {/* Main Content */}
        <Box
          flex="0 0 600px"
          maxW="600px"
          w="100%"
          minW="0"
        >
          {!loading && posts.length === 0 && (
            <h1>{t("Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news 🍐.")}</h1>
          )}
          {loading && (
            <Flex justifyContent="center">
              <Spinner size="xl" />
            </Flex>
          )}
          {posts.map((post) => {
            const isNew = isNewPost(post.createdAt);
            return (
              <Box
                key={post._id}
                className="postContainer"
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                mb={6}
                boxShadow="sm"
                maxW="800px"
                mx="auto"
              >
                <Post post={post} postedBy={post.postedBy} />
                {isNew && newPosts.includes(post) && (
                  <Text className="newToYouText" mt={2}>{t("New to you!")}</Text>
                )}
              </Box>
            );
          })}
        </Box>
        {/* Right Game Widget */}
        {isLargerThan1024 && (
          <Box
            position="sticky"
            top="20px"
            width="320px"
            flexShrink={0}
            display={{ base: "none", lg: "block" }}
          >
            <GameWidget />
          </Box>
        )}
      </Flex>
      {/* Top-of-feed widget for mobile */}
      {!isLargerThan1024 && (
        <Box width="100%" mb={4}>
          <GameWidget />
        </Box>
      )}
    </>
  );
};

export default HomePage;
