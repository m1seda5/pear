// import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// const Comment = ({ reply, lastReply }) => {
// 	return (
// 		<>
// 			<Flex gap={4} py={2} my={2} w={"full"}>
// 				<Avatar src={reply.userProfilePic} size={"sm"} />
// 				<Flex gap={1} w={"full"} flexDirection={"column"}>
// 					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
// 						<Text fontSize='sm' fontWeight='bold'>
// 							{reply.username}
// 						</Text>
// 					</Flex>
// 					<Text>{reply.text}</Text>
// 				</Flex>
// 			</Flex>
// 			{!lastReply ? <Divider /> : null}
// 		</>
// 	);
// };

// export default Comment;
import { useRecoilValue } from "recoil";
import { useState, useRef } from "react";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";

const safeFormatDate = (dateString) => {
    if (!dateString) return "just now";
    try {
        if (typeof dateString !== 'string' && !(dateString instanceof Date)) {
            return "recently";
        }
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2000) {
            return "recently";
        }
        return formatDistanceToNow(parsedDate) + " ago";
    } catch (error) {
        return "recently";
    }
};

const Comment = ({ reply, lastReply, onDelete }) => {
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [selectedReaction, setSelectedReaction] = useState(reply.text);
    const [showReactions, setShowReactions] = useState(false);

    if (currentUser?.isFrozen) return null;

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/posts/comment/${reply._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            onDelete(reply._id);
            showToast("Success", "Comment deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleReaction = async (emoji) => {
        try {
            const res = await fetch(`/api/posts/reply/${reply.postId || reply._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({ text: emoji }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setSelectedReaction(emoji);
            showToast("Success", "Reaction added", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const showDeleteButton = currentUser?.role === "admin" || currentUser?._id === reply.userId;

    return (
        <div className={`friendkit-comment-item${lastReply ? ' last-reply' : ''}`}>
            <div className="friendkit-comment-avatar">
                <img src={reply.userProfilePic || "/default-avatar.png"} alt={reply.username} />
            </div>
            <div className="friendkit-comment-content">
                <div className="friendkit-comment-header">
                    <span className="username">{reply.username}</span>
                    <span className="time">{safeFormatDate(reply.createdAt)}</span>
                    {showDeleteButton && (
                        <button className="button is-icon is-danger is-tiny friendkit-comment-delete" onClick={handleDelete} title="Delete">
                            <i data-feather="x"></i>
                        </button>
                    )}
                </div>
                <div className="friendkit-comment-reaction">
                    <span className="reaction-emoji" onClick={() => setShowReactions(!showReactions)}>{selectedReaction || "😊"}</span>
                    {showReactions && (
                        <div className="friendkit-reaction-dropdown">
                            {["😊", "👍", "🔥", "👏"].map((emoji) => (
                                <button
                                    key={emoji}
                                    className={`button is-light is-small${selectedReaction === emoji ? " is-active" : ""}`}
                                    onClick={() => { handleReaction(emoji); setShowReactions(false); }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;