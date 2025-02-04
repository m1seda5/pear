import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import { useTranslation } from 'react-i18next';

const TVPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const [error, setError] = useState(null);
    const [cachedPosts, setCachedPosts] = useState([]);
    const user = useRecoilValue(userAtom);
    const { t } = useTranslation();
    const toast = useToast();

    // Constants
    const SLIDE_DURATION = 7000; // 7 seconds per post
    const MAX_FEATURED_POSTS = 3;

    useEffect(() => {
        // Load cached posts from localStorage if they exist
        const loadCachedPosts = () => {
            const cached = localStorage.getItem('tvPagePosts');
            if (cached) {
                setCachedPosts(JSON.parse(cached));
                setPosts(JSON.parse(cached));
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();

                if (data.error) {
                    setError(data.error);
                    toast({
                        title: t("Error"),
                        description: data.error,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
                }

                // Sort posts by likes and comments for featuring
                const sortedPosts = data.sort((a, b) => {
                    const aEngagement = (a.likes?.length || 0) + (a.replies?.length || 0);
                    const bEngagement = (b.likes?.length || 0) + (b.replies?.length || 0);
                    return bEngagement - aEngagement;
                });

                const featuredPosts = sortedPosts.slice(0, MAX_FEATURED_POSTS);
                setPosts(featuredPosts);
                
                // Cache the posts
                localStorage.setItem('tvPagePosts', JSON.stringify(featuredPosts));
                setCachedPosts(featuredPosts);
            } catch (error) {
                setError(error.message);
                // Use cached posts if available
                loadCachedPosts();
                toast({
                    title: t("Network Error"),
                    description: t("Using cached content"),
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        // Only allow access if user is admin
        if (user?.role !== 'admin') {
            toast({
                title: t("Access Denied"),
                description: t("You don't have permission to view this page"),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        fetchPosts();

        // Set up auto-rotation for posts
        const interval = setInterval(() => {
            setCurrentPostIndex((prevIndex) => 
                prevIndex === (posts.length - 1) ? 0 : prevIndex + 1
            );
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [user, t, toast]);

    // Progress bar animation
    const Progress = ({ index }) => (
        <Box
            h="2px"
            bg="gray.200"
            position="relative"
            overflow="hidden"
            borderRadius="full"
        >
            <Box
                position="absolute"
                bg="teal.500"
                h="100%"
                w="100%"
                transition={`transform ${SLIDE_DURATION}ms linear`}
                transform={index === currentPostIndex ? "translateX(0)" : "translateX(-100%)"}
                transformOrigin="left"
            />
        </Box>
    );

    if (!user || user.role !== 'admin') {
        return <Box p={4}>{t("Access Denied")}</Box>;
    }

    return (
        <Box p={4}>
            {loading ? (
                <Flex justifyContent="center">
                    <Spinner size="xl" />
                </Flex>
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <>
                    <Flex mb={4} gap={2}>
                        {posts.map((_, index) => (
                            <Box key={index} flex={1}>
                                <Progress index={index} />
                            </Box>
                        ))}
                    </Flex>
                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        boxShadow="xl"
                        bg="white"
                        _dark={{ bg: "gray.800" }}
                        transition="all 0.3s"
                    >
                        {posts[currentPostIndex] && (
                            <Post
                                post={posts[currentPostIndex]}
                                postedBy={posts[currentPostIndex].postedBy}
                            />
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TVPage;