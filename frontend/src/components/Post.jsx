//version 1 working
// import { Avatar } from "@chakra-ui/avatar";
// import { Image } from "@chakra-ui/image";
// import { Box, Flex, Text } from "@chakra-ui/layout";
// import { Link, useNavigate } from "react-router-dom";
// import Actions from "./Actions";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import { formatDistanceToNow } from "date-fns";
// import { DeleteIcon } from "@chakra-ui/icons";
// import { useRecoilState, useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import postsAtom from "../atoms/postsAtom";

// const Post = ({ post, postedBy }) => {
// 	const [user, setUser] = useState(null);
// 	const showToast = useShowToast();
// 	const currentUser = useRecoilValue(userAtom);
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const getUser = async () => {
// 			try {
// 				const res = await fetch("/api/users/profile/" + postedBy);
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				setUser(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 				setUser(null);
// 			}
// 		};

// 		getUser();
// 	}, [postedBy, showToast]);

// 	const handleDeletePost = async (e) => {
// 		try {
// 			e.preventDefault();
// 			if (!window.confirm("Are you sure you want to delete this post?")) return;

// 			const res = await fetch(`/api/posts/${post._id}`, {
// 				method: "DELETE",
// 			});
// 			const data = await res.json();
// 			if (data.error) {
// 				showToast("Error", data.error, "error");
// 				return;
// 			}
// 			showToast("Success", "Post deleted", "success");
// 			setPosts(posts.filter((p) => p._id !== post._id));
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		}
// 	};

// 	if (!user) return null;
// 	return (
// 		<Link to={`/${user.username}/post/${post._id}`}>
// 			<Flex gap={3} mb={4} py={5}>
// 				<Flex flexDirection={"column"} alignItems={"center"}>
// 					<Avatar
// 						size='md'
// 						name={user.name}
// 						src={user?.profilePic}
// 						onClick={(e) => {
// 							e.preventDefault();
// 							navigate(`/${user.username}`);
// 						}}
// 					/>
// 					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
// 					<Box position={"relative"} w={"full"}>
// 						{post.replies.length === 0 && <Text textAlign={"center"}>🍐</Text>}
// 						{post.replies[0] && (
// 							<Avatar
// 								size='xs'
// 								name='John doe'
// 								src={post.replies[0].userProfilePic}
// 								position={"absolute"}
// 								top={"0px"}
// 								left='15px'
// 								padding={"2px"}
// 							/>
// 						)}

// 						{post.replies[1] && (
// 							<Avatar
// 								size='xs'
// 								name='John doe'
// 								src={post.replies[1].userProfilePic}
// 								position={"absolute"}
// 								bottom={"0px"}
// 								right='-5px'
// 								padding={"2px"}
// 							/>
// 						)}

// 						{post.replies[2] && (
// 							<Avatar
// 								size='xs'
// 								name='John doe'
// 								src={post.replies[2].userProfilePic}
// 								position={"absolute"}
// 								bottom={"0px"}
// 								left='4px'
// 								padding={"2px"}
// 							/>
// 						)}
// 					</Box>
// 				</Flex>
// 				<Flex flex={1} flexDirection={"column"} gap={2}>
// 					<Flex justifyContent={"space-between"} w={"full"}>
// 						<Flex w={"full"} alignItems={"center"}>
// 							<Text
// 								fontSize={"sm"}
// 								fontWeight={"bold"}
// 								onClick={(e) => {
// 									e.preventDefault();
// 									navigate(`/${user.username}`);
// 								}}
// 							>
// 								{user?.username}
// 							</Text>
// 							<Image src='/verified.png' w={4} h={4} ml={1} />
// 						</Flex>
// 						<Flex gap={4} alignItems={"center"}>
// 							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
// 								{formatDistanceToNow(new Date(post.createdAt))} ago
// 							</Text>

// 							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
// 						</Flex>
// 					</Flex>

// 					<Text fontSize={"sm"}>{post.text}</Text>
// 					{post.img && (
// 						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
// 							<Image src={post.img} w={"full"} />
// 						</Box>
// 					)}

// 					<Flex gap={3} my={1}>
// 						<Actions post={post} />
// 					</Flex>
// 				</Flex>
// 			</Flex>
// 		</Link>
// 	);
// };

// export default Post;

// version 2 with translations working
import { 
	Box, 
	Flex, 
	Text, 
	Avatar, 
	Icon, 
	useColorModeValue,
	HStack,
	VStack,
	Button,
	Image,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Input,
	Divider
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post, postedBy }) => {
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const [liked, setLiked] = useState(post.likes.includes(currentUser?._id));
	const [likes, setLikes] = useState(post.likes.length);
	const [isCommenting, setIsCommenting] = useState(false);
	const [comment, setComment] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	const handleLikeAndUnlike = async () => {
		try {
			const res = await fetch(`/api/posts/like/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
				return;
			}
			setLiked(!liked);
			setLikes(liked ? likes - 1 : likes + 1);
		} catch (error) {
			console.log(error);
		}
	};

	const handleComment = async () => {
		try {
			const res = await fetch(`/api/posts/comment/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (data.error) {
				return;
			}
			setComment("");
			setIsCommenting(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Box bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={4} mb={4}>
			{/* Post Header */}
			<Flex justify="space-between" align="center" mb={4}>
				<HStack spacing={3}>
					<Avatar
						size="md"
						name={postedBy?.name}
						src={postedBy?.profilePic}
						onClick={() => navigate(`/${postedBy?.username}`)}
						cursor="pointer"
					/>
					<VStack align="start" spacing={0}>
						<Text
							fontWeight="bold"
							onClick={() => navigate(`/${postedBy?.username}`)}
							cursor="pointer"
						>
							{postedBy?.name}
						</Text>
						<Text fontSize="sm" color="gray.500">
							{formatDistanceToNow(new Date(post.createdAt))} ago
						</Text>
					</VStack>
				</HStack>
				<Menu>
					<MenuButton>
						<Icon as={FaEllipsisH} />
					</MenuButton>
					<MenuList>
						<MenuItem>Report</MenuItem>
						{currentUser?._id === postedBy?._id && (
							<MenuItem color="red.500">Delete</MenuItem>
						)}
					</MenuList>
				</Menu>
			</Flex>

			{/* Post Content */}
			<Text mb={4}>{post.text}</Text>
			{post.img && (
				<Image
					src={post.img}
					alt="Post image"
					borderRadius="lg"
					w="100%"
					maxH="500px"
					objectFit="cover"
					onClick={() => navigate(`/post/${post._id}`)}
					cursor="pointer"
					mb={4}
				/>
			)}

			{/* Post Actions */}
			<HStack justify="space-between" color="gray.500" mb={4}>
				<HStack spacing={4}>
					<Button
						variant="ghost"
						leftIcon={liked ? <FaHeart color="red" /> : <FaRegHeart />}
						onClick={handleLikeAndUnlike}
					>
						{likes}
					</Button>
					<Button
						variant="ghost"
						leftIcon={<FaRegComment />}
						onClick={() => setIsCommenting(!isCommenting)}
					>
						{post.comments.length}
					</Button>
					<Button variant="ghost" leftIcon={<FaShare />}>
						Share
					</Button>
				</HStack>
			</HStack>

			{/* Comments Section */}
			{isCommenting && (
				<VStack align="stretch" spacing={2}>
					<Divider />
					<HStack>
						<Avatar size="sm" src={currentUser?.profilePic} name={currentUser?.name} />
						<Input
							placeholder="Write a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleComment();
								}
							}}
						/>
					</HStack>
					{post.comments.map((comment) => (
						<HStack key={comment._id} align="start" spacing={2}>
							<Avatar size="sm" src={comment.postedBy.profilePic} name={comment.postedBy.name} />
							<VStack align="start" spacing={0}>
								<Text fontWeight="bold">{comment.postedBy.name}</Text>
								<Text>{comment.text}</Text>
							</VStack>
						</HStack>
					))}
				</VStack>
			)}

			{/* Image Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody p={0}>
						<Image src={post.img} alt="Post image" w="100%" />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default Post;