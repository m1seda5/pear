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
// version 2 with translations working
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState, useRef } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";
import { BiShow } from "react-icons/bi";

const Post = ({ post, postedBy, isTV = false }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const viewTimeoutRef = useRef(null);

    useEffect(() => {
        const handleLanguageChange = (lng) => {
            setLanguage(lng);
        };

        i18n.on("languageChanged", handleLanguageChange);
        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [i18n]);

    useEffect(() => {
        const getUser = async () => {
            console.log("postedBy:", postedBy);

            try {
                const userId = typeof postedBy === "object" ? postedBy._id : postedBy;
                const res = await fetch("/api/users/profile/" + userId);
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

    useEffect(() => {
        const markAsViewed = async () => {
            try {
                const res = await fetch(`/api/posts/view/${post._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p._id === post._id ? { ...p, viewCount: data.viewCount, isViewed: true } : p
                    )
                );
            } catch (error) {
                console.error("Error marking post as viewed:", error);
                showToast(t("Error"), error.message, "error");
            }
        };

        if (!post.isViewed) {
            viewTimeoutRef.current = setTimeout(() => {
                markAsViewed();
            }, 3000);
        }

        return () => {
            if (viewTimeoutRef.current) {
                clearTimeout(viewTimeoutRef.current);
            }
        };
    }, [post._id, post.isViewed, setPosts, currentUser.token, showToast, t]);

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm(t("Are you sure you want to delete this post?"))) return;

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
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

    return (
        <Link to={`/${user.username}/post/${post._id}`} style={isTV ? { width: "100%" } : {}}>
            <Flex
                gap={3}
                mb={4}
                py={5}
                width="100%"
                bg={isTV ? "white" : "transparent"}
                _dark={{ bg: isTV ? "gray.800" : "transparent" }}
                borderRadius={isTV ? "xl" : "none"}
                px={isTV ? 6 : 0}
            >
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size={isTV ? "xl" : "md"}
                        name={user.name}
                        src={user?.profilePic}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
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
                                size="xs"
                                name="John doe"
                                src={post.replies[0].userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left="15px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size="xs"
                                name="John doe"
                                src={post.replies[1].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                right="-5px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size="xs"
                                name="John doe"
                                src={post.replies[2].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                left="4px"
                                padding={"2px"}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2} width="100%">
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={isTV ? "2xl" : "sm"}
                                fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            {user?.role === "admin" && (
                                <Image src="/verified.png" w={isTV ? 6 : 4} h={isTV ? 6 : 4} ml={1} />
                            )}
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={isTV ? "lg" : "xs"} width={36} textAlign={"right"} color={"gray.light"}>
                                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : ""} {t("ago")}
                            </Text>
                            {!isTV && (currentUser?._id === user._id || currentUser?.role === "admin") && (
                                <DeleteIcon size={20} onClick={handleDeletePost} />
                            )}
                        </Flex>
                    </Flex>

                    <Text
                        fontSize={isTV ? "xl" : "sm"}
                        className="post-text"
                        color={isTV ? "black" : "inherit"}
                        _dark={{ color: isTV ? "white" : "inherit" }}
                    >
                        {post.text}
                    </Text>

                    {/* Target Groups and General Post Indicators */}
                    <Flex gap={2} wrap="wrap" my={2}>
                        {post.targetGroups && post.targetGroups.map(group => (
                            <Flex key={group._id} align="center" mr={2}>
                                <Box
                                    w="10px"
                                    h="10px"
                                    borderRadius="full"
                                    bg={group.color}
                                    mr={1}
                                />
                                <Text fontSize="sm">{group.name}</Text>
                            </Flex>
                        ))}
                        {post.isGeneral && (
                            <Flex align="center">
                                <Box
                                    w="10px"
                                    h="10px"
                                    borderRadius="full"
                                    bg="gray.500"
                                    mr={1}
                                />
                                <Text fontSize="sm">{t("General Post")}</Text>
                            </Flex>
                        )}
                    </Flex>

                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                            width="100%"
                            margin="0 auto"
                            maxHeight={isTV ? "70vh" : "auto"}
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

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;