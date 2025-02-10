import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const SLIDE_DURATION = 6000;
    const MAX_FEATURED_POSTS = 4;

    useEffect(() => {
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
            setCurrentPostIndex((prevIndex) => 
                (prevIndex + 1) % posts.length
            );
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [user, t, toast]);

    const Progress = ({ index, isActive }) => (
        <Box
            h="4px"
            bg="gray.200"
            position="relative"
            overflow="hidden"
            borderRadius="full"
        >
            {isActive && (
                <Box
                    position="absolute"
                    bg="teal.500"
                    h="100%"
                    w="100%"
                    animation={`progressBar ${SLIDE_DURATION}ms linear`}
                    transformOrigin="left"
                    sx={{
                        "@keyframes progressBar": {
                            "0%": { transform: "scaleX(0)" },
                            "100%": { transform: "scaleX(1)" }
                        }
                    }}
                />
            )}
        </Box>
    );

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
            <Box 
                position="absolute" 
                top={4} 
                right={4} 
                zIndex="20"
            >
                <CloseIcon 
                    boxSize={6} 
                    color="gray.500" 
                    cursor="pointer" 
                    onClick={() => navigate("/")} 
                />
            </Box>

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
                            <Box key={index} flex={1}>
                                <Progress 
                                    index={index} 
                                    isActive={index === currentPostIndex} 
                                />
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
                            >
                                <Post
                                    post={posts[currentPostIndex]}
                                    postedBy={posts[currentPostIndex].postedBy}
                                    isTV={true}
                                    isTVPage={true}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default TVPage;