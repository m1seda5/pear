import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Spinner, Text, useToast, IconButton, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useNavigate } from 'react-router-dom';
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import { useTranslation } from 'react-i18next';
import { SmallCloseIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';

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
    const { colorMode, toggleColorMode } = useColorMode();

    const SLIDE_DURATION = 15000; // Increased from 11000ms to 15000ms for better readability
    const MAX_FEATURED_POSTS = 4;

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
                    toast({
                        title: t("Info"),
                        description: t("Fullscreen mode not supported in this browser"),
                        status: "info",
                        duration: 3000,
                        isClosable: true,
                    });
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
                description: t("Could not enter fullscreen mode"),
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
        
        // Pause/resume with spacebar
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            setIsPaused(prev => !prev);
        }
        
        // Navigate with arrow keys
        if (e.key === 'ArrowRight') {
            setCurrentPostIndex(prevIndex => (prevIndex + 1) % posts.length);
            setKey(prev => prev + 1);
        }
        
        if (e.key === 'ArrowLeft') {
            setCurrentPostIndex(prevIndex => 
                prevIndex === 0 ? posts.length - 1 : prevIndex - 1
            );
            setKey(prev => prev + 1);
        }
    }, [isFullscreen, posts.length]);

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
        const loadCachedPosts = () => {
            const cached = localStorage.getItem('tvPagePosts');
            if (cached) {
                try {
                    const parsedPosts = JSON.parse(cached);
                    setCachedPosts(parsedPosts);
                    setPosts(parsedPosts);
                    setLoading(false);
                } catch (e) {
                    console.error("Error parsing cached posts:", e);
                    // Clear invalid cache
                    localStorage.removeItem('tvPagePosts');
                }
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

        // Set up slideshow interval
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

    const handleManualNavigate = (index) => {
        setCurrentPostIndex(index);
        setKey(prev => prev + 1);
    };

    const Progress = ({ index }) => (
        <Box
            h="8px"
            bg="gray.200"
            position="relative"
            overflow="hidden"
            borderRadius="full"
            _dark={{ bg: "gray.600" }}
            cursor="pointer"
            onClick={() => handleManualNavigate(index)}
            _hover={{
                opacity: 0.8,
                transform: "scaleY(1.2)"
            }}
            transition="all 0.2s"
        >
            {index === currentPostIndex && !isPaused && (
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
            {index === currentPostIndex && isPaused && (
                <Box
                    position="absolute"
                    left="0"
                    top="0"
                    h="100%"
                    w="50%"
                    bg="yellow.500"
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

    const handleTogglePause = () => {
        setIsPaused(prev => !prev);
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
            _dark={{ bg: "gray.900" }}
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
                    {/* Progress indicators at top */}
                    <Flex 
                        mb={4} 
                        gap={2} 
                        position="absolute" 
                        top="0" 
                        left="0" 
                        right="0" 
                        zIndex="10" 
                        p={6}
                        bg="blackAlpha.300"
                        _dark={{ bg: "blackAlpha.500" }}
                    >
                        {posts.map((_, index) => (
                            <Box key={`progress-${index}-${key}`} flex={1}>
                                <Progress index={index} />
                            </Box>
                        ))}
                    </Flex>
                    
                    {/* Main content area */}
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
                            >
                                <Post
                                    post={posts[currentPostIndex]}
                                    postedBy={posts[currentPostIndex].postedBy}
                                    isTV={true}
                                />
                            </Box>
                        )}
                    </Box>
                    
                    {/* Control buttons */}
                    <Flex
                        position="fixed"
                        bottom="6"
                        right="6"
                        zIndex="20"
                        gap={3}
                    >
                        {/* Toggle play/pause */}
                        <IconButton
                            icon={isPaused ? 
                                <Box as="span" fontSize="xl">▶️</Box> : 
                                <Box as="span" fontSize="xl">⏸️</Box>
                            }
                            size="lg"
                            variant="solid"
                            bg="blackAlpha.700"
                            color="white"
                            onClick={handleTogglePause}
                            _hover={{ 
                                bg: "blackAlpha.800",
                                transform: "scale(1.05)" 
                            }}
                            borderRadius="full"
                            aria-label={isPaused ? "Play" : "Pause"}
                            boxShadow="lg"
                        />
                        
                        {/* Toggle dark/light mode */}
                        <IconButton
                            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                            size="lg"
                            variant="solid"
                            bg="blackAlpha.700"
                            color="white"
                            onClick={toggleColorMode}
                            _hover={{ 
                                bg: "blackAlpha.800",
                                transform: "scale(1.05)" 
                            }}
                            borderRadius="full"
                            aria-label={colorMode === "light" ? "Dark Mode" : "Light Mode"}
                            boxShadow="lg"
                        />
                        
                        {/* Close button */}
                        <IconButton
                            icon={<SmallCloseIcon boxSize={5} />}
                            size="lg"
                            variant="solid"
                            bg="blackAlpha.700"
                            color="white"
                            onClick={handleClose}
                            _hover={{ 
                                bg: "blackAlpha.800",
                                transform: "scale(1.05)" 
                            }}
                            borderRadius="full"
                            aria-label="Close fullscreen"
                            boxShadow="lg"
                        />
                    </Flex>
                </Box>
            )}
            <style jsx global>{`
                @keyframes fadeInOut {
                    0% {
                        opacity: 0;
                        transform: scale(0.98);
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    90% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.98);
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
                
                /* Improved fullscreen styles */
                :fullscreen {
                    background-color: white;
                }
                
                .chakra-ui-dark :fullscreen {
                    background-color: #1A202C;
                }
                
                :fullscreen .tv-page-container {
                    padding: 0;
                    margin: 0;
                }
                
                /* Improved vendor prefixed fullscreen styles */
                :-webkit-full-screen {
                    background-color: white;
                }
                
                .chakra-ui-dark :-webkit-full-screen {
                    background-color: #1A202C;
                }
                
                :-moz-full-screen {
                    background-color: white;
                }
                
                .chakra-ui-dark :-moz-full-screen {
                    background-color: #1A202C;
                }
                
                :-ms-fullscreen {
                    background-color: white;
                }
                
                .chakra-ui-dark :-ms-fullscreen {
                    background-color: #1A202C;
                }
                
                /* Make post fill container in TV mode */
                .tv-post-container a {
                    display: block;
                    width: 100%;
                }
                
                .tv-post-container a > div {
                    width: 100%;
                    /* Improved hover effects */
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                /* Improved tap/click targets */
                .user-avatar, .username-section, .post-link-wrapper {
                    cursor: pointer;
                }
                
                /* Increase visibility of controls */
                .chakra-button {
                    opacity: 0.85;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .chakra-button:hover {
                    opacity: 1;
                }
                
                /* Better contrast for dark mode */
                .chakra-ui-dark .post-text {
                    color: white !important;
                }
                
                .chakra-ui-dark .username-section {
                    color: white !important;
                }
                
                /* Special styles for text-only posts in TV mode to ensure they're very visible */
                .tv-post-container .post-text {
                    font-weight: 500;
                }
            `}</style>
        </Box>
    );
};

export default TVPage;
