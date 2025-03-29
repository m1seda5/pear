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
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [loadingPost, setLoadingPost] = useState(true);

  const formatSafeDate = (dateString) => {
    if (!dateString) return t("just now"); // Handle missing dates
    
    try {
      const parsedDate = new Date(dateString);
      
      // Check if date is invalid
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date:", dateString);
        return t("recently");
      }
      
      return formatDistanceToNow(parsedDate) + " " + t("ago");
    } catch (error) {
      console.error("Date formatting error:", error);
      return t("recently");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(
          t("Error"),
          errorData.error || t("Failed to delete post"),
          "error"
        );
        return;
      }

      navigate("/");
      showToast(t("Success"), t("Post deleted successfully"), "success");
    } catch (error) {
      showToast(
        t("Error"),
        error.message || t("Failed to delete post"),
        "error"
      );
    }
  };

  const handleDeleteComment = (deletedCommentId) => {
    setPosts((prevPosts) => {
      const updatedPost = {
        ...prevPosts[0],
        replies: prevPosts[0].replies.filter(
          (reply) => reply._id !== deletedCommentId
        ),
      };
      return [updatedPost];
    });
  };

  useEffect(() => {
    const getPost = async () => {
      setLoadingPost(true);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          showToast(t("Error"), data?.error || t("Post not found"), "error");
          navigate("/");
          return;
        }

        // Verify post structure
        if (!data._id || !data.createdAt) {
          throw new Error("Invalid post data structure");
        }

        setPosts([data]);
      } catch (error) {
        showToast(t("Error"), error.message, "error");
        navigate("/");
      } finally {
        setLoadingPost(false);
      }
    };
    getPost();
  }, [pid, setPosts, showToast, t, navigate]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (loadingPost) {
    return (
      <Flex justifyContent="center" minH="200px" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const currentPost = posts[0];

  if (!currentPost) {
    return (
      <Flex justifyContent="center" mt={10}>
        <Text>{t("Post not found")}</Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.username} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
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
          {(currentUser?.role === "admin" || currentUser?._id === user._id) && (
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
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {currentPost.replies?.map((reply, index) => (
        <Comment
          key={reply._id}
          reply={{
            ...reply,
            userProfilePic: reply.userProfilePic,
            userId: reply.userId,
            _id: reply._id,
          }}
          lastReply={index === currentPost.replies.length - 1}
          onDelete={handleDeleteComment}
        />
      ))}
    </>
  );
};

export default PostPage;