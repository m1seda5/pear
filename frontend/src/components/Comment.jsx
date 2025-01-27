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
import { Avatar, Divider, Flex, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const Comment = ({ reply, lastReply, onDelete }) => {
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();

    // If the current user is frozen, do not display the comment
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

    const showDeleteButton = currentUser?.role === "admin" || currentUser?._id === reply.userId;

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"} alignItems="center">
                <Avatar src={reply.userProfilePic} size={"sm"} />
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize="sm" fontWeight="bold">
                            {reply.username}
                        </Text>
                        {showDeleteButton && (
                            <Tooltip label="Delete comment">
                                <IconButton
                                    aria-label="Delete comment"
                                    icon={<DeleteIcon />}
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={handleDelete}
                                />
                            </Tooltip>
                        )}
                    </Flex>
                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply && <Divider />}
        </>
    );
};

export default Comment;
