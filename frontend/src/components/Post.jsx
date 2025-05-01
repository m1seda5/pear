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
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post, postedBy }) => {
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const [liked, setLiked] = useState(post.likes.includes(currentUser?._id));
	const [likes, setLikes] = useState(post.likes.length);
	const [isCommenting, setIsCommenting] = useState(false);
	const [comment, setComment] = useState("");

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
		<div className="card is-post">
			<div className="card-heading">
				<div className="user-block">
					<div className="image">
						<img src={postedBy?.profilePic} alt={postedBy?.name} data-user-popover="1" />
					</div>
					<div className="user-info">
						<a href={`/${postedBy?.username}`}>{postedBy?.name}</a>
						<span className="time">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
					</div>
				</div>
				<div className="dropdown is-spaced is-right is-neutral dropdown-trigger">
					<div>
						<div className="button">
							<i data-feather="more-vertical"></i>
						</div>
					</div>
					<div className="dropdown-menu" role="menu">
						<div className="dropdown-content">
							<a href="#" className="dropdown-item">
								<div className="media">
									<i data-feather="bookmark"></i>
									<div className="media-content">
										<h3>Bookmark</h3>
										<small>Add this post to your bookmarks.</small>
									</div>
								</div>
							</a>
							<a className="dropdown-item">
								<div className="media">
									<i data-feather="bell"></i>
									<div className="media-content">
										<h3>Notify me</h3>
										<small>Send me notifications for this post.</small>
									</div>
								</div>
							</a>
							<hr className="dropdown-divider" />
							<a href="#" className="dropdown-item">
								<div className="media">
									<i data-feather="flag"></i>
									<div className="media-content">
										<h3>Flag</h3>
										<small>Report this post for review.</small>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="card-body">
				<div className="post-text">
					<p>{post.text}</p>
				</div>
				{post.img && (
					<div className="post-image">
						<img src={post.img} alt="Post" />
					</div>
				)}
				<div className="post-actions">
					<div className="like-wrapper">
						<button className={`button like-button ${liked ? 'is-active' : ''}`} onClick={handleLikeAndUnlike}>
							<i data-feather="heart"></i>
							<span className="like-overlay"></span>
						</button>
						<div className="likes-count">
							{likes} {likes === 1 ? 'like' : 'likes'}
						</div>
					</div>
					<div className="comments-wrapper">
						<button className="button" onClick={() => setIsCommenting(!isCommenting)}>
							<i data-feather="message-circle"></i>
						</button>
						<div className="comments-count">
							{post.replies.length} {post.replies.length === 1 ? 'comment' : 'comments'}
						</div>
					</div>
					<div className="share-wrapper">
						<button className="button">
							<i data-feather="share-2"></i>
						</button>
					</div>
				</div>
				{isCommenting && (
					<div className="comments-box">
						<div className="media is-comment">
							<div className="media-left">
								<div className="image">
									<img src={currentUser?.profilePic} alt={currentUser?.name} />
								</div>
							</div>
							<div className="media-content">
								<div className="field">
									<div className="control">
										<textarea 
											className="textarea comment-textarea" 
											rows="1" 
											placeholder="Write a comment..."
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										></textarea>
									</div>
								</div>
								<div className="comment-controls">
									<button className="button is-solid primary-button raised" onClick={handleComment}>
										Post Comment
									</button>
								</div>
							</div>
						</div>
						{post.replies.map((reply, index) => (
							<div key={index} className="media is-comment">
								<div className="media-left">
									<div className="image">
										<img src={reply.userProfilePic} alt={reply.username} />
									</div>
								</div>
								<div className="media-content">
									<div className="comment-meta">
										<a href={`/${reply.username}`}>{reply.username}</a>
										<span className="time">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
									</div>
									<p>{reply.text}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Post;