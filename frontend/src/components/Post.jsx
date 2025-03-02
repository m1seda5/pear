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
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";

const Post = ({ post, postedBy, isTV = false }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  
  useEffect(() => {
    // Update the language state whenever the i18n language changes
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange); // Listen for language change

    return () => {
      i18n.off("languageChanged", handleLanguageChange); // Cleanup on component unmount
    };
  }, [i18n]);

  useEffect(() => {
    const getUser = async () => {
      console.log("postedBy:", postedBy);

      try {
        const userId = typeof postedBy === "object" ? postedBy._id : postedBy; // Extract ID if postedBy is an object
        const res = await fetch("/api/users/profile/" + userId); // Use userId directly in the URL
        const data = await res.json();
        if (data.error) {
          showToast(t("Error"), data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast(t("Error"), error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast, t]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm(t("Are you sure you want to delete this post?")))
        return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // Add authorization header
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast(t("Error deleting post"), data.error, "error");
        return;
      }
      showToast(t("Success"), t("Post deleted"), "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast(t("Error"), error.message, "error");
    }
  };

  if (!user) return null;

  // Calculate content-based styling - text-only posts will be larger in TV mode
  const isTextOnlyPost = !post.img;
  const textFontSize = isTV 
    ? isTextOnlyPost ? "3xl" : "2xl" 
    : "sm";
  
  const usernameFontSize = isTV 
    ? isTextOnlyPost ? "3xl" : "2xl" 
    : "sm";

  const timeFontSize = isTV 
    ? isTextOnlyPost ? "xl" : "lg" 
    : "xs";

  // Enhance clickable area by making the whole post area clickable
  return (
    <Link 
      to={`/${user.username}/post/${post._id}`} 
      style={isTV ? { width: "100%", display: "block" } : {}}
      className="post-link-wrapper"
    >
      <Flex 
        gap={4} 
        mb={4} 
        py={isTV ? 8 : 5} 
        width="100%"
        bg={isTV ? "white" : "transparent"}
        _dark={{ 
          bg: isTV ? "gray.800" : "transparent",
          color: "white" 
        }}
        borderRadius={isTV ? "xl" : "none"}
        px={isTV ? 8 : 0}
        position="relative"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          transform: isTV ? "scale(1.01)" : "none",
          boxShadow: isTV ? "lg" : "none"
        }}
        className="post-container"
      >
        <Flex 
          flexDirection={"column"} 
          alignItems={"center"}
          className="post-avatar-section"
        >
          <Avatar
            size={isTV ? "2xl" : "md"}
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/${user.username}`);
            }}
            cursor="pointer"
            className="user-avatar"
            transition="transform 0.2s"
            _hover={{
              transform: "scale(1.1)"
            }}
          />
          <Box
            w="1px"
            h={"full"}
            bg="gray.light"
            my={2}
            display={isTV ? "none" : "block"}
          ></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🍐</Text>}
            {post.replies[0] && (
              <Avatar
                size={isTV ? "sm" : "xs"}
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left={isTV ? "25px" : "15px"}
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size={isTV ? "sm" : "xs"}
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right={isTV ? "0px" : "-5px"}
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size={isTV ? "sm" : "xs"}
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left={isTV ? "10px" : "4px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={isTV ? 4 : 2} width="100%">
          <Flex justifyContent={"space-between"} w={"full"} alignItems="center">
            <Flex 
              w={"full"} 
              alignItems={"center"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/${user.username}`);
              }}
              cursor="pointer"
              className="username-section"
              _hover={{
                textDecoration: "underline"
              }}
            >
              <Text
                fontSize={usernameFontSize}
                fontWeight={"bold"}
                color={isTV ? "black" : "inherit"}
                _dark={{ 
                  color: isTV ? "white" : "inherit" 
                }}
              >
                {user?.username}
              </Text>
              {user?.role === "admin" && (
                <Image src="/verified.png" w={isTV ? 8 : 4} h={isTV ? 8 : 4} ml={1} />
              )}
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={timeFontSize}
                width={isTV ? 44 : 36}
                textAlign={"right"}
                color={isTV ? "gray.600" : "gray.light"}
                _dark={{ 
                  color: isTV ? "gray.300" : "gray.light" 
                }}
              >
                {formatDistanceToNow(new Date(post.createdAt))} {t("ago")}
              </Text>

              {!isTV &&
                (currentUser?._id === user._id ||
                  currentUser?.role === "admin") && (
                  <Box 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeletePost(e);
                    }}
                    cursor="pointer"
                    p={2}
                    borderRadius="md"
                    _hover={{
                      bg: "red.50",
                      _dark: { bg: "red.900" }
                    }}
                  >
                    <DeleteIcon size={20} />
                  </Box>
                )}
            </Flex>
          </Flex>

          <Text 
            fontSize={textFontSize}
            className="post-text"
            color={isTV ? "black" : "inherit"}
            _dark={{ color: isTV ? "white" : "inherit" }}
            lineHeight={isTV && isTextOnlyPost ? "1.6" : "normal"}
            fontWeight={isTV && isTextOnlyPost ? "medium" : "normal"}
            maxW={isTV && isTextOnlyPost ? "90%" : "full"}
            mx={isTV && isTextOnlyPost ? "auto" : "0"}
            textAlign={isTV && isTextOnlyPost ? "center" : "left"}
            mt={isTV && isTextOnlyPost ? 8 : 0}
            mb={isTV && isTextOnlyPost ? 8 : 0}
          >
            {post.text}
          </Text>
          {post.img && (
            <Box
              borderRadius={isTV ? 12 : 6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              width="100%"
              margin="0 auto"
              maxHeight={isTV ? "70vh" : "auto"}
              boxShadow={isTV ? "xl" : "none"}
              mt={isTV ? 4 : 0}
            >
              <Image
                src={post.img}
                w={"full"}
                h={isTV ? "auto" : "full"}
                maxHeight={isTV ? "70vh" : "auto"}
                objectFit={isTV ? "contain" : "cover"}
                className="post-image"
              />
            </Box>
          )}

          {!isTV && (
            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
          )}
        </Flex>

        {/* Additional clickable overlay to improve UX */}
        {isTV && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            cursor="pointer"
            zIndex="1"
            onClick={(e) => {
              // The Link component will handle navigation
            }}
          />
        )}
      </Flex>
    </Link>
  );
};

export default Post;
