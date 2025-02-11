import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text, useToast, CloseButton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useNavigate } from 'react-router-dom';
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import { useTranslation } from 'react-i18next';

const TVPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const [error, setError] = useState(null);
    const [cachedPosts, setCachedPosts] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [key, setKey] = useState(0);
    const user = useRecoilValue(userAtom);
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();

    const SLIDE_DURATION = 11000;
    const MAX_FEATURED_POSTS = 4;

    useEffect(() => {
        const loadCachedPosts = () => {
            const cached = localStorage.getItem('tvPagePosts');
            if (cached) {
                const parsedPosts = JSON.parse(cached);
                setCachedPosts(parsedPosts);
                setPosts(parsedPosts);
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

                const sortedPosts = data.sort((a, b) => {
                    const aEngagement = (a.likes?.length || 0) + (a.replies?.length || 0);
                    const bEngagement = (b.likes?.length || 0) + (b.replies?.length || 0);
                    return bEngagement - aEngagement;
                });

                const featuredPosts = sortedPosts.slice(0, MAX_FEATURED_POSTS);
                setPosts(featuredPosts);
                localStorage.setItem('tvPagePosts', JSON.stringify(featuredPosts));
                setCachedPosts(featuredPosts);
            } catch (error) {
                setError(error.message);
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

        const interval = setInterval(() => {
            if (!isPaused && posts.length > 0) {
                setCurrentPostIndex((prevIndex) => {
                    const nextIndex = prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
                    setKey(prev => prev + 1);
                    return nextIndex;
                });
            }
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [user, t, toast, isPaused, posts.length]);

    const Progress = ({ index }) => (
        <Box
            h="3px"
            bg="gray.200"
            position="relative"
            overflow="hidden"
            borderRadius="full"
        >
            {index === currentPostIndex && (
                <Box
                    position="absolute"
                    left="0"
                    top="0"
                    h="100%"
                    w="full"
                    bg="green.500"
                    transition={`transform ${SLIDE_DURATION}ms linear`}
                    style={{
                        transform: 'translateX(-100%)',
                        animation: `progress ${SLIDE_DURATION}ms linear`
                    }}
                />
            )}
        </Box>
    );

    const handleClose = () => {
        navigate('/');
    };

    if (!user || user.role !== 'admin') {
        return <Box p={4}>{t("Access Denied")}</Box>;
    }

    return (
        <Box 
            className="tv-page-container"
            height="100vh"
            width="100vw"
            overflow="hidden"
            position="fixed"
            top="0"
            left="0"
            bg="white"
            _dark={{ bg: "gray.800" }}
        >
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="100%">
                    <Spinner size="xl" />
                </Flex>
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <Box height="100%">
                    <Flex mb={4} gap={2} position="absolute" top="0" left="0" right="0" zIndex="10" p={4}>
                        {posts.map((_, index) => (
                            <Box key={`progress-${index}-${key}`} flex={1}>
                                <Progress index={index} />
                            </Box>
                        ))}
                    </Flex>
                    <Box
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={6}
                    >
                        {posts[currentPostIndex] && (
                            <Box
                                width="100%"
                                maxWidth="1200px"
                                mx="auto"
                                className="tv-post-container"
                                key={`post-${currentPostIndex}-${key}`}
                            >
                                <Post
                                    post={posts[currentPostIndex]}
                                    postedBy={posts[currentPostIndex].postedBy}
                                    isTV={true}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box
                        position="fixed"
                        bottom="4"
                        right="4"
                        zIndex="20"
                    >
                        <CloseButton
                            size="lg"
                            bg="gray.800"
                            color="white"
                            onClick={handleClose}
                            _hover={{ bg: "gray.700" }}
                            p="3"
                            borderRadius="full"
                        />
                    </Box>
                </Box>
            )}
            <style jsx global>{`
                @keyframes fadeInOut {
                    0% {
                        opacity: 0;
                        transform: scale(0.98) translateY(10px);
                    }
                    15% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    85% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.98) translateY(-10px);
                    }
                }
                @keyframes progress {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(0%);
                    }
                }
                .tv-post-container {
                    opacity: 0;
                    animation: fadeInOut ${SLIDE_DURATION}ms ease-in-out forwards;
                }
            `}</style>
        </Box>
    );
};

export default TVPage;
