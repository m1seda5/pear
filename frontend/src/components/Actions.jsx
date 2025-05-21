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
import { useState, useContext, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";
import { CompetitionContext } from "../contexts/CompetitionContext";
import { FaHeart, FaRegHeart, FaComment, FaRetweet } from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { usePointPopUp } from "../context/PointPopUpContext";

const Actions = ({ post, posts, setPosts, onClose }) => {
    const { t } = useTranslation();
    const user = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const { showToast } = useToast();
    const { competitionActive, updatePoints } = useContext(CompetitionContext);
    const triggerPopUp = usePointPopUp();

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
                // Only award points if competition is active and user hasn't received points for this post today
                if (competitionActive && data.pointsAwarded) {
                    updatePoints(10);
                    triggerPopUp(10, pearColor);
                    showToast("Success", "+10 Points! Someone liked your post!", "success");
                }
                
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: [...p.likes, user._id] };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
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

            // Only award points for admin fire reaction
            if (competitionActive && data.adminReaction === "🔥") {
                updatePoints(175);
                triggerPopUp(175, pearColor);
                showToast("Success", "+175 Points! Your post was trending!", "success");
            }

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

    const handleRepost = async () => {
        if (!user) return showToast("Error", "You must be logged in to repost", "error");
        try {
            const res = await fetch("/api/posts/repost/" + post._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");

            // Only award points if competition is active and user hasn't exceeded daily repost limit
            if (competitionActive && data.pointsAwarded) {
                updatePoints(10);
                triggerPopUp(10, pearColor);
                showToast("Success", "+10 Points! You reposted content!", "success");
            }

            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, reposts: [...p.reposts, user._id] };
                }
                return p;
            });
            setPosts(updatedPosts);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    // Hover animation style for action buttons
    const iconHoverStyle = {
        transform: "scale(1.15)",
        transition: "all 0.2s ease-in-out"
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleLikeAndUnlike}
                    disabled={isLiking}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
                <span className="text-sm text-gray-500">{post.likes.length}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onClose()}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <FaComment />
                </button>
                <span className="text-sm text-gray-500">{post.replies.length}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleRepost}
                    className="text-gray-500 hover:text-green-500 transition-colors"
                >
                    <FaRetweet />
                </button>
                <span className="text-sm text-gray-500">{post.reposts?.length || 0}</span>
            </div>
        </div>
    );
};

export default Actions;