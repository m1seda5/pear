import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Spinner, Text, useToast, IconButton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useNavigate, Navigate } from 'react-router-dom';
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import { useTranslation } from 'react-i18next';
import { SmallCloseIcon } from '@chakra-ui/icons';

const TVPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const [error, setError] = useState(null);
    const [cachedPosts, setCachedPosts] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [key, setKey] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const user = useRecoilValue(userAtom);
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();

    const SLIDE_DURATION = 11000;
    const MAX_FEATURED_POSTS = 4;

    // Add authentication check
    if (!user || !user.token) {
        return <Navigate to="/auth" />;
    }

    // Handle fullscreen toggling with better error handling
    const toggleFullscreen = useCallback(() => {
        try {
            if (!document.fullscreenElement) {
                // Different browsers might have different implementations
                const element = document.documentElement;
                const requestMethod = element.requestFullscreen || 
                                    element.webkitRequestFullscreen || 
                                    element.mozRequestFullScreen || 
                                    element.msRequestFullscreen;
                
                if (requestMethod) {
                    requestMethod.call(element);
                    setIsFullscreen(true);
                } else {
                    // Fallback if fullscreen API is not available
                    console.log("Fullscreen API not available");
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
            toast({
                title: t("Fullscreen Error"),
                description: "Could not enter fullscreen mode",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [t, toast]);

    // Handle ESC key to exit fullscreen
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && isFullscreen) {
            setIsFullscreen(false);
        }
    }, [isFullscreen]);

    // Exit handler to update state when user exits fullscreen by other means
    const handleFullscreenChange = useCallback(() => {
        setIsFullscreen(!!document.fullscreenElement);
    }, []);

    // Separate useEffect for fullscreen setup to avoid dependency issues
    useEffect(() => {
        // Auto-enter fullscreen after a short delay to ensure component is fully mounted
        const timer = setTimeout(() => {
            toggleFullscreen();
        }, 100);
        
        return () => clearTimeout(timer);
    }, [toggleFullscreen]);

    // Separate useEffect for event listeners
    useEffect(() => {
        // Add event listeners for fullscreen
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        return () => {
            // Clean up event listeners
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            
            // Try to exit fullscreen on component unmount if still in fullscreen
            try {
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => {
                        console.error("Error exiting fullscreen:", err);
                    });
                }
            } catch (error) {
                console.error("Error checking fullscreen state:", error);
            }
        };
    }, [handleKeyDown, handleFullscreenChange]);

    useEffect(() => {
        if (!user || !user.token) return;
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/posts/tv');
                if (!res.ok) throw new Error('Failed to fetch posts');
                const data = await res.json();
                setPosts(data);
                setCachedPosts(data);
            } catch (err) {
                setError(err.message);
                toast({ title: t('Error'), description: err.message, status: 'error', duration: 5000, isClosable: true });
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [t, toast, user]);

    const Progress = ({ index }) => (
        <Box
            h="5px"
            bg="gray.200"
            position="relative"
            overflow="hidden"
            borderRadius="full"
            _dark={{ bg: "gray.600" }}
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
        // Try to exit fullscreen if active
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.error("Error exiting fullscreen:", err);
                });
            }
        } catch (error) {
            console.error("Error checking fullscreen state:", error);
        }
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
            zIndex="9999"
        >
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="100%">
                    <Spinner size="xl" />
                </Flex>
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <Box height="100%" width="100%">
                    <Flex mb={4} gap={2} position="absolute" top="0" left="0" right="0" zIndex="10" p={4}>
                        {posts.map((_, index) => (
                            <Box key={`progress-${index}-${key}`} flex={1}>
                                <Progress index={index} />
                            </Box>
                        ))}
                    </Flex>
                    <Box
                        height="100%"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={6}
                    >
                        {posts[currentPostIndex] && (
                            <Box
                                width="100%"
                                maxWidth="1600px"
                                mx="auto"
                                className="tv-post-container"
                                key={`post-${currentPostIndex}-${key}`}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                bg="white"
                                _dark={{ bg: "gray.800" }}
                                borderRadius="xl"
                                p={4}
                                boxShadow="xl"
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
                        <IconButton
                            icon={<SmallCloseIcon />}
                            size="sm"
                            variant="ghost"
                            bg="blackAlpha.300"
                            color="white"
                            onClick={handleClose}
                            _hover={{ 
                                bg: "blackAlpha.400",
                                opacity: "1" 
                            }}
                            borderRadius="full"
                            opacity="0.4"
                            aria-label="Close fullscreen"
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
                    width: 100%;
                }
                
                .tv-post-container > a {
                    width: 100%;
                    display: block;
                }
                
                /* Fullscreen styles */
                :fullscreen {
                    background-color: white;
                }
                
                :fullscreen .tv-page-container {
                    padding: 0;
                    margin: 0;
                }
                
                /* Vendor prefixed fullscreen styles */
                :-webkit-full-screen {
                    background-color: white;
                }
                
                :-moz-full-screen {
                    background-color: white;
                }
                
                :-ms-fullscreen {
                    background-color: white;
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    :fullscreen, :-webkit-full-screen, :-moz-full-screen, :-ms-fullscreen {
                        background-color: #1A202C;
                    }
                }
                
                /* Explicit light/dark mode styles for both modes */
                :fullscreen .tv-post-container {
                    background-color: white;
                    color: black;
                }
                
                .chakra-ui-dark :fullscreen .tv-post-container {
                    background-color: #1A202C;
                    color: white;
                }
                
                /* Make post fill container in TV mode */
                .tv-post-container a {
                    display: block;
                    width: 100%;
                }
                
                .tv-post-container a > div {
                    width: 100%;
                }
            `}</style>
        </Box>
    );
};

export default TVPage;
