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
import { Flex, Text } from "@chakra-ui/layout";
import { Avatar, Image, useColorModeValue } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";

const Post = ({ post, postedBy, isTV = false }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const viewTimeoutRef = useRef(null);
    
    // Match colors from HomePage background
    const textColor = useColorModeValue("gray.700", "gray.200");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    
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
        <Link 
            to={`/${user.username}/post/${post._id}`} 
            style={{ 
                width: isTV ? "100%" : "auto",
                display: "block"
            }}
        >
            <Flex
                direction="column"
                w="full"
                maxW={isTV ? "full" : "2xl"}
                mx="auto"
                borderBottom="1px"
                borderColor={borderColor}
                overflow="hidden"
                className="post-container"
            >
                {/* Author section with views moved to right */}
                <Flex 
                    alignItems="center" 
                    justifyContent="space-between" 
                    px={5}
                    pt={4}
                    pb={3}
                >
                    <Flex alignItems="center" gap={3}>
                        <Avatar
                            size="md"
                            name={user.name}
                            src={user?.profilePic}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        />
                        <Flex direction="column">
                            <Text 
                                fontSize="sm" 
                                fontWeight="semibold" 
                                color={textColor}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                                {user?.role === "admin" && (
                                    <Image src="/verified.png" display="inline" w={4} h={4} ml={1} />
                                )}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                @{user?.username} · {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : ""} {t("ago")}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex gap={4} alignItems="center">
                        <Flex align="center" gap={1}>
                            <Text color="gray.500" fontSize="sm">
                                {post?.viewCount || 0}
                            </Text>
                            <svg
                                aria-label={t("Views")}
                                color="gray"
                                fill="currentColor"
                                height="16"
                                role="img"
                                viewBox="0 0 24 24"
                                width="16"
                            >
                                <path
                                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                />
                            </svg>
                        </Flex>
                        {(currentUser?._id === user._id || currentUser?.role === "admin") && (
                            <Flex 
                                as="button"
                                p={2} 
                                borderRadius="full"
                                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                                transition="all 0.2s"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeletePost(e);
                                }}
                            >
                                <DeleteIcon boxSize={4} color="gray.500" />
                            </Flex>
                        )}
                    </Flex>
                </Flex>

                {/* Content section */}
                <Text px={5} mb={4} fontSize="sm" color={textColor} className="post-text">
                    {post.text}
                </Text>

                {/* Target Groups and General Post Indicators */}
                <Flex gap={2} wrap="wrap" mb={4} px={5}>
                    {post.targetGroups && post.targetGroups.map(group => (
                        <Flex key={group._id} align="center" mr={2}>
                            <Flex
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg={group.color}
                                mr={1}
                            />
                            <Text fontSize="xs">{group.name}</Text>
                        </Flex>
                    ))}
                    {post.isGeneral && (
                        <Flex align="center">
                            <Flex
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg="gray.500"
                                mr={1}
                            />
                            <Text fontSize="xs">{t("General Post")}</Text>
                        </Flex>
                    )}
                </Flex>

                {/* Image preview */}
                {post.img && (
                    <Flex 
                        w="full"
                        overflow="hidden"
                        mb={4}
                    >
                        <Image
                            src={post.img}
                            w="full"
                            h={isTV ? "auto" : "full"}
                            maxH={isTV ? "70vh" : "auto"}
                            objectFit={isTV ? "contain" : "cover"}
                            className="post-image"
                        />
                    </Flex>
                )}

                {/* Engagement section */}
                <Flex 
                    alignItems="center" 
                    justifyContent="space-between" 
                    px={5}
                    pb={4}
                    pt={2}
                >
                    {/* Actions component with likes, comments, reposts */}
                    <Actions post={post} />
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;