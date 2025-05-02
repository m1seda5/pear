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
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowToast";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted successfully", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleLikeAndUnlike = async () => {
		try {
			const res = await fetch(`/api/posts/like/${post._id}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setPosts(posts.map((p) => (p._id === post._id ? data : p)));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleComment = async () => {
		try {
			const res = await fetch(`/api/posts/comment/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: "New comment" }), // Replace with actual comment text
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setPosts(posts.map((p) => (p._id === post._id ? data : p)));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<div className="post">
			<div className="post-header">
				<img src={user?.profilePic || "/default-avatar.png"} alt={user?.username} className="avatar" />
				<div className="post-info">
					<span className="username">{user?.username}</span>
					<span className="timestamp">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
				</div>
				{currentUser?._id === user?._id && (
					<button onClick={handleDeletePost} className="delete-button">
						<i data-feather="trash-2"></i>
					</button>
				)}
			</div>
			<div className="post-content">
				<p>{post.text}</p>
				{post.img && <img src={post.img} alt="Post" className="post-image" />}
			</div>
			<div className="post-actions">
				<button onClick={handleLikeAndUnlike} className="action-button">
					<i data-feather="heart"></i> {post.likes.length}
				</button>
				<button onClick={handleComment} className="action-button">
					<i data-feather="message-circle"></i> {post.comments.length}
				</button>
			</div>
		</div>
	);
};

export default Post;