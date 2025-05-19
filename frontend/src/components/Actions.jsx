import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";

const Actions = ({ post }) => {
    const { t } = useTranslation();
    const user = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");

    const showToast = useShowToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get appropriate color for pear icon based on color mode
    const pearColor = useColorModeValue("black", "white");

    const handleLikeAndUnlike = async () => {
        if (!user) return showToast("Error", "You must be logged in to like a post", "error");
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch("/api/posts/like/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            if (!liked) {
                // add the id of the current user to post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: [...p.likes, user._id] };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
                // remove the id of the current user from post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: p.likes.filter((id) => id !== user._id) };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            }

            setLiked(!liked);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLiking(false);
        }
    };

    const handleReply = async () => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch("/api/posts/reply/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
                credentials: 'include',
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply posted successfully", "success");
            onClose();
            setReply("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    const handleReplyEmoji = async (emoji) => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch("/api/posts/reply/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: emoji }),
                credentials: 'include',
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply posted successfully", "success");
            onClose();
            setReply("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    // Hover animation style for action buttons
    const iconHoverStyle = {
        transform: "scale(1.15)",
        transition: "all 0.2s ease-in-out"
    };

    return (
        <Flex justifyContent="space-between" width="full" onClick={(e) => e.preventDefault()}>
            {/* Left section with like, comment, repost - reduced gap from 3 to 2 */}
            <Flex gap={2} alignItems="center">
                {/* Like Action - kept in the same position */}
                <Flex alignItems="center" gap={2} cursor="pointer" onClick={handleLikeAndUnlike}>
                    <Flex 
                        _hover={iconHoverStyle} 
                        transition="all 0.2s ease-in-out"
                    >
                        <svg
                            aria-label={t('Like')}
                            color={liked ? "rgb(237, 73, 86)" : "gray.500"}
                            fill={liked ? "rgb(237, 73, 86)" : "none"}
                            height="18"
                            role="img"
                            viewBox="0 0 24 22"
                            width="18"
                        >
                            <path
                                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                                stroke="currentColor"
                                strokeWidth="2"
                            ></path>
                        </svg>
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium">
                        {post.likes.length || 0}
                    </Text>
                </Flex>

                {/* Comment Action - closer to the like button */}
                <Flex alignItems="center" gap={2} cursor="pointer" onClick={onOpen}>
                    <Flex 
                        _hover={iconHoverStyle} 
                        transition="all 0.2s ease-in-out"
                    >
                        <svg
                            aria-label={t('Comment')}
                            color="gray.500"
                            fill="none"
                            height="18"
                            role="img"
                            viewBox="0 0 24 24"
                            width="18"
                        >
                            <path
                                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            ></path>
                        </svg>
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium">
                        {post.replies.length || 0}
                    </Text>
                </Flex>

                {/* Repost Action - closer to the comment button */}
                <Flex alignItems="center" gap={2} cursor="pointer">
                    <Flex 
                        _hover={iconHoverStyle} 
                        transition="all 0.2s ease-in-out"
                    >
                        <svg
                            aria-label='Repost'
                            color='currentColor'
                            fill='currentColor'
                            height='20'
                            role='img'
                            viewBox='0 0 24 24'
                            width='20'
                        >
                            <title>Repost</title>
                            <path
                                fill=''
                                d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
                            ></path>
                        </svg>
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium">
                        {post.reposts?.length || 0}
                    </Text>
                </Flex>
            </Flex>

            {/* Reply Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('Reply to Post')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input
                                placeholder={t('Live comments coming soon, pick a reaction.')}
                                value={''}
                                isDisabled
                            />
                        </FormControl>
                        <Flex mt={4} gap={4} justifyContent="center">
                            {['😊', '👍', '🔥', '👏'].map((emoji) => (
                                <Button
                                    key={emoji}
                                    fontSize="2xl"
                                    onClick={async () => {
                                        setReply(emoji);
                                        await handleReplyEmoji(emoji);
                                    }}
                                    isLoading={isReplying && reply === emoji}
                                    variant="ghost"
                                >
                                    {emoji}
                                </Button>
                            ))}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Actions;