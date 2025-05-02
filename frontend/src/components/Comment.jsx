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
import { 
    Avatar, 
    Divider, 
    Flex, 
    Text, 
    IconButton, 
    Box, 
    HStack, 
    Input, 
    FormControl, 
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from "@chakra-ui/react";
import { DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FaThumbsUp, FaFire, FaSmile } from "react-icons/fa";
import { FaFaceGrinStars } from "react-icons/fa6";
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
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState(reply.text);
    const inputRef = useRef(null);

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

    const renderReaction = (reactionType) => {
        switch(reactionType) {
            case "thumbsUp":
                return <FaThumbsUp size={20} />;
            case "fire":
                return <FaFire size={20} />;
            case "eyes":
                return <FaFaceGrinStars size={20} />;
            case "smile":
                return <FaSmile size={20} />;
            default:
                return reactionType; // Display emoji directly if it's one of our allowed ones
        }
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    return (
        <>
            <Flex gap={4} py={2} my={2} w="full">
                <Avatar src={reply.userProfilePic} size="sm" />
                <Flex flex={1} flexDirection="column" gap={1}>
                    <Flex justifyContent="space-between" alignItems="center" w="full">
                        <Text fontWeight="bold" fontSize="sm">
                            {reply.username}
                        </Text>
                        {showDeleteButton && (
                            <IconButton
                                icon={<DeleteIcon />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={handleDelete}
                            />
                        )}
                    </Flex>
                    
                    {/* Updated reaction display */}
                    <Flex align="center" gap={2}>
                        <Text fontSize="xl">{renderReaction(selectedReaction)}</Text>
                        <Text fontSize="sm" color="gray.500" ml={2}>
                            {safeFormatDate(reply.createdAt)}
                        </Text>
                    </Flex>

                    <Text fontSize="sm" color="gray.500" mt={1}>
                        {selectedReaction === "😊" && "Smiling"}
                        {selectedReaction === "👍" && "Thumbs Up"} 
                        {selectedReaction === "🔥" && "Fire"}
                        {selectedReaction === "👏" && "Clapping"}
                    </Text>

                    {/* Popover for "Choose Reaction" */}
                    <Popover>
                        <PopoverTrigger>
                            <Text fontSize="sm" color="blue.500" cursor="pointer" mt={1}>
                                Choose Reaction
                            </Text>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                <HStack spacing={4} justify="center">
                                    <Tooltip label="Smile">
                                        <IconButton
                                            aria-label="Smile"
                                            fontSize="xl"
                                            variant={selectedReaction === "😊" ? "solid" : "ghost"}
                                            colorScheme="yellow"
                                            onClick={() => handleReaction("😊")}
                                        >
                                            😊
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip label="Thumbs Up">
                                        <IconButton
                                            aria-label="Thumbs Up"
                                            fontSize="xl"
                                            variant={selectedReaction === "👍" ? "solid" : "ghost"}
                                            colorScheme="blue"
                                            onClick={() => handleReaction("👍")}
                                        >
                                            👍
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip label="Fire">
                                        <IconButton
                                            aria-label="Fire"
                                            fontSize="xl"
                                            variant={selectedReaction === "🔥" ? "solid" : "ghost"}
                                            colorScheme="red"
                                            onClick={() => handleReaction("🔥")}
                                        >
                                            🔥
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip label="Clap">
                                        <IconButton
                                            aria-label="Clap"
                                            fontSize="xl"
                                            variant={selectedReaction === "👏" ? "solid" : "ghost"}
                                            colorScheme="green"
                                            onClick={() => handleReaction("👏")}
                                        >
                                            👏
                                        </IconButton>
                                    </Tooltip>
                                </HStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>

                    {/* Original input with coming soon message */}
                    <FormControl>
                        <Input
                            placeholder="Add a reaction..."
                            onFocus={handleInputFocus}
                            ref={inputRef}
                            isReadOnly
                        />
                    </FormControl>

                    {isInputFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Flex align="center" gap={2} p={2} bg="red.100" borderRadius="md">
                                <WarningIcon color="red.500" />
                                <Text color="red.500" fontSize="sm">
                                    Comments Coming Soon - Use Reactions Instead
                                </Text>
                            </Flex>
                            
                            {/* Original reaction options */}
                            <HStack spacing={4} justify="center" mt={3}>
                                <Tooltip label="Thumbs Up">
                                    <IconButton
                                        icon={<FaThumbsUp />}
                                        aria-label="Thumbs Up"
                                        onClick={() => handleReaction("thumbsUp")}
                                        colorScheme="blue"
                                        variant={selectedReaction === "thumbsUp" ? "solid" : "ghost"}
                                        size="lg"
                                    />
                                </Tooltip>
                                <Tooltip label="Fire">
                                    <IconButton
                                        icon={<FaFire />}
                                        aria-label="Fire"
                                        onClick={() => handleReaction("fire")}
                                        colorScheme="orange"
                                        variant={selectedReaction === "fire" ? "solid" : "ghost"}
                                        size="lg"
                                    />
                                </Tooltip>
                                <Tooltip label="Starry Eyes">
                                    <IconButton
                                        icon={<FaFaceGrinStars />}
                                        aria-label="Eyes"
                                        onClick={() => handleReaction("eyes")}
                                        colorScheme="purple"
                                        variant={selectedReaction === "eyes" ? "solid" : "ghost"}
                                        size="lg"
                                    />
                                </Tooltip>
                                <Tooltip label="Smile">
                                    <IconButton
                                        icon={<FaSmile />}
                                        aria-label="Smile"
                                        onClick={() => handleReaction("smile")}
                                        colorScheme="yellow"
                                        variant={selectedReaction === "smile" ? "solid" : "ghost"}
                                        size="lg"
                                    />
                                </Tooltip>
                            </HStack>
                        </motion.div>
                    )}
                </Flex>
            </Flex>
            {!lastReply && <Divider />}
        </>
    );
};

export default Comment;