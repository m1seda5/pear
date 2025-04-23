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

    return (
        <Flex justifyContent="space-between" width="full" onClick={(e) => e.preventDefault()}>
            {/* Left section with like, comment, repost */}
            <Flex gap={6} alignItems="center">
                {/* Like Action */}
                <Flex alignItems="center" gap={2} cursor="pointer" onClick={handleLikeAndUnlike}>
                    <Text fontSize="sm" fontWeight="medium">
                        {post.likes.length || 0}
                    </Text>
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

                {/* Comment Action */}
                <Flex alignItems="center" gap={2} cursor="pointer" onClick={onOpen}>
                    <Text fontSize="sm" fontWeight="medium">
                        {post.replies.length || 0}
                    </Text>
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

                {/* Repost Action */}
                <Flex alignItems="center" gap={2} cursor="pointer">
                    <Text fontSize="sm" fontWeight="medium">
                        {post.reposts?.length || 0}
                    </Text>
                    <svg
                        aria-label={t('Repost')}
                        color="gray.500"
                        fill="none"
                        height="18"
                        role="img"
                        viewBox="0 0 24 24"
                        width="18"
                    >
                        <path
                            d="M16.373 3.5v2.534a8.945 8.945 0 0 1 5.559 8.276c-.001 1.752-.52 3.465-1.496 4.92a8.955 8.955 0 0 1-4.063 3.357 9.004 9.004 0 0 1-5.271.519 9.046 9.046 0 0 1-4.416-2.414 8.921 8.921 0 0 1-2.545-4.241 8.88 8.88 0 0 1-.189-5.203 8.936 8.936 0 0 1 2.748-4.122 8.99 8.99 0 0 1 4.604-2.096v2.511l6.069-4.031-6.069-4.031z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Flex>
            </Flex>

            {/* Right section with share */}
            <Flex alignItems="center" cursor="pointer">
                <svg
                    aria-label={t('Share')}
                    color="gray.500"
                    fill="none"
                    height="18"
                    role="img"
                    viewBox="0 0 24 24"
                    width="18"
                >
                    <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="22"
                        x2="9.218"
                        y1="3"
                        y2="10.083"
                    ></line>
                    <polygon
                        fill="none"
                        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></polygon>
                </svg>
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
                                placeholder={t('Write your reply...')}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' size={"sm"} mr={3} isLoading={isReplying} onClick={handleReply}>
                            {t('Reply')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Actions;