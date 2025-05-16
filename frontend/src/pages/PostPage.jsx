// working version one
// import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
// import Actions from "../components/Actions";
// import { useEffect } from "react";
// import Comment from "../components/Comment";
// import useGetUserProfile from "../hooks/useGetUserProfile";
// import useShowToast from "../hooks/useShowToast";
// import { useNavigate, useParams } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
// import { useRecoilState, useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { DeleteIcon } from "@chakra-ui/icons";
// import postsAtom from "../atoms/postsAtom";

// const PostPage = () => {
// 	const { user, loading } = useGetUserProfile();
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const showToast = useShowToast();
// 	const { pid } = useParams();
// 	const currentUser = useRecoilValue(userAtom);
// 	const navigate = useNavigate();

// 	const currentPost = posts[0];

// 	useEffect(() => {
// 		const getPost = async () => {
// 			setPosts([]);
// 			try {
// 				const res = await fetch(`/api/posts/${pid}`);
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				setPosts([data]);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			}
// 		};
// 		getPost();
// 	}, [showToast, pid, setPosts]);

// 	const handleDeletePost = async () => {
// 		try {
// 			if (!window.confirm("Are you sure you want to delete this post?")) return;

// 			const res = await fetch(`/api/posts/${currentPost._id}`, {
// 				method: "DELETE",
// 			});
// 			const data = await res.json();
// 			if (data.error) {
// 				showToast("Error", data.error, "error");
// 				return;
// 			}
// 			showToast("Success", "Post deleted", "success");
// 			navigate(`/${user.username}`);
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		}
// 	};

// 	if (!user && loading) {
// 		return (
// 			<Flex justifyContent={"center"}>
// 				<Spinner size={"xl"} />
// 			</Flex>
// 		);
// 	}

// 	if (!currentPost) return null;
// 	console.log("currentPost", currentPost);

// 	return (
// 		<>
// 			<Flex>
// 				<Flex w={"full"} alignItems={"center"} gap={3}>
// 					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
// 					<Flex>
// 						<Text fontSize={"sm"} fontWeight={"bold"}>
// 							{user.username}
// 						</Text>
// 						<Image src='/verified.png' w='4' h={4} ml={4} />
// 					</Flex>
// 				</Flex>
// 				<Flex gap={4} alignItems={"center"}>
// 					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
// 						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
// 					</Text>

// 					{currentUser?._id === user._id && (
// 						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
// 					)}
// 				</Flex>
// 			</Flex>

// 			<Text my={3}>{currentPost.text}</Text>

// 			{currentPost.img && (
// 				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
// 					<Image src={currentPost.img} w={"full"} />
// 				</Box>
// 			)}

// 			<Flex gap={3} my={3}>
// 				<Actions post={currentPost} />
// 			</Flex>

// 			<Divider my={4} />
// 			{/* temporarily disbled the get button  */}

// 			<Flex justifyContent={"space-between"}>
// 				<Flex gap={2} alignItems={"center"}>
// 					<Text fontSize={"2xl"}>🍐</Text>
// 					<Text color={"gray.light"}>The application is coming to your phone soon.</Text>
// 				</Flex>
// 				{/* <Button>Get</Button> */}
// 			</Flex>

// 			<Divider my={4} />
// 			{currentPost.replies.map((reply) => (
// 				<Comment
// 					key={reply._id}
// 					reply={reply}
// 					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
// 				/>
// 			))}
// 		</>
// 	);
// };

// export default PostPage;

// verison two with transaltions
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";

const PostPage = () => {
  const { t } = useTranslation();
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid, id } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [loadingPost, setLoadingPost] = useState(true);

  const formatSafeDate = (dateString) => {
    if (!dateString) return t("just now");
    try {
      if (typeof dateString !== 'string' && !(dateString instanceof Date)) {
        return t("recently");
      }
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2000) {
        return t("recently");
      }
      return formatDistanceToNow(parsedDate) + " " + t("ago");
    } catch (error) {
      return t("recently");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (!postId) {
        showToast(t("Error"), t("Invalid post ID"), "error");
        return;
      }

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(
          t("Error"),
          data.error || t("Failed to delete post"),
          "error"
        );
        return;
      }

      navigate("/");
      showToast(t("Success"), t("Post deleted successfully"), "success");
    } catch (error) {
      console.error("Delete post error:", error);
      showToast(
        t("Error"),
        error.message || t("Failed to delete post"),
        "error"
      );
    }
  };

  const handleDeleteComment = (deletedCommentId) => {
    setPosts((prevPosts) => {
      if (!prevPosts || !prevPosts[0] || !prevPosts[0].replies) {
        return prevPosts;
      }
      
      const updatedPost = {
        ...prevPosts[0],
        replies: prevPosts[0].replies.filter(
          (reply) => reply && reply._id !== deletedCommentId
        ),
      };
      return [updatedPost];
    });
  };

  useEffect(() => {
    const getPost = async () => {
      setLoadingPost(true);
      try {
        const postId = pid || id;
        if (!postId) {
          showToast(t("Error"), t("Invalid post ID"), "error");
          navigate("/");
          return;
        }

        const res = await fetch(`/api/posts/${postId}`, { credentials: 'include' });
        const data = await res.json();

        if (!res.ok || data.error) {
          showToast(t("Error"), data?.error || t("Post not found"), "error");
          navigate("/");
          return;
        }

        // Enhanced validation
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response format");
        }

        // Check critical fields and provide defaults if needed
        const sanitizedPost = {
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          _id: data._id || null,
          text: data.text || "",
          img: data.img || null,
          likes: Array.isArray(data.likes) ? data.likes : [],
          replies: Array.isArray(data.replies) ? data.replies.filter(reply => reply && typeof reply === 'object') : [],
        };

        // Only set the post if it passed validation
        setPosts([sanitizedPost]);
      } catch (error) {
        console.error("Fetch post error:", error);
        showToast(t("Error"), error.message || t("Failed to load post"), "error");
        navigate("/");
      } finally {
        setLoadingPost(false);
      }
    };
    getPost();
  }, [pid, id, setPosts, showToast, t, navigate]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems="center" minH="200px">
        <Spinner size={"xl"} />
        <Text ml={4}>{t("Loading user...")}</Text>
      </Flex>
    );
  }

  if (loadingPost) {
    return (
      <Flex justifyContent="center" minH="200px" alignItems="center">
        <Spinner size="xl" />
        <Text ml={4}>{t("Loading post...")}</Text>
      </Flex>
    );
  }

  const currentPost = posts && posts.length > 0 ? posts[0] : null;

  if (!currentPost) {
    return (
      <Flex justifyContent="center" mt={10} alignItems="center" minH="200px">
        <Text color="red.400" fontWeight="bold">{t("Post not found or you are not authorized to view this post.")}</Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar 
            src={user?.profilePic || ""} 
            size={"md"} 
            name={user?.username || "User"} 
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username || t("Unknown User")}
            </Text>
            {user?.role === "admin" && (
              <Image src="/verified.png" w={4} h={4} ml={1} />
            )}
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatSafeDate(currentPost.createdAt)}
          </Text>
          {(currentUser?.role === "admin" || currentUser?._id === user?._id) && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={() => handleDeletePost(currentPost._id)}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} alt={t("Post image")} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {Array.isArray(currentPost.replies) && currentPost.replies.map((reply, index) => {
        // Additional validation for each reply
        if (!reply || typeof reply !== 'object' || !reply._id) {
          return null;
        }
        // Defensive: ensure reply.createdAt is a valid ISO string
        let replyCreatedAt = reply.createdAt;
        if (!replyCreatedAt || isNaN(new Date(replyCreatedAt).getTime())) {
          replyCreatedAt = new Date().toISOString();
        }
        return (
          <Comment
            key={reply._id}
            reply={{
              ...reply,
              userProfilePic: reply.userProfilePic || "",
              userId: reply.userId || "",
              _id: reply._id,
              text: reply.text || "",
              createdAt: replyCreatedAt,
            }}
            lastReply={index === (currentPost.replies?.length || 0) - 1}
            onDelete={handleDeleteComment}
          />
        );
      })}
    </>
  );
};

export default PostPage;