// // version 1 original 
// import { Box, Flex, Spinner } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
// import { useRecoilState } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// import SuggestedUsers from "../components/SuggestedUsers";

// const HomePage = () => {
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const [loading, setLoading] = useState(true);
// 	const showToast = useShowToast();
// 	useEffect(() => {
// 		const getFeedPosts = async () => {
// 			setLoading(true);
// 			setPosts([]);
// 			try {
// 				const res = await fetch("/api/posts/feed");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				console.log(data);
// 				setPosts(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		getFeedPosts();
// 	}, [showToast, setPosts]);

// 	return (
// 		<Flex gap='10' alignItems={"flex-start"}>
// 			<Box flex={70}>
// 				{!loading && posts.length === 0 && <h1>Follow users for the latest Brookhouse news.</h1>}

// 				{loading && (
// 					<Flex justify='center'>
// 						<Spinner size='xl' />
// 					</Flex>
// 				)}

// 				{posts.map((post) => (
// 					<Post key={post._id} post={post} postedBy={post.postedBy} />
// 				))}
// 			</Box>
// 			<Box
// 				flex={30}
// 				display={{
// 					base: "none",
// 					md: "block",
// 				}}
// 			>
// 				<SuggestedUsers />
// 			</Box>
// 		</Flex>
// 	);
// };

// export default HomePage;


//  version 2 this is the animated posts with green tint (this is before the disabled suggested users)
// import { Box, Flex, Spinner } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
// import { useRecoilState } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// import SuggestedUsers from "../components/SuggestedUsers";

// const HomePage = () => {
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const [loading, setLoading] = useState(true);
// 	const showToast = useShowToast();

// 	useEffect(() => {
// 		const getFeedPosts = async () => {
// 			setLoading(true);
// 			setPosts([]);
// 			try {
// 				const res = await fetch("/api/posts/feed");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				console.log(data);
// 				setPosts(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		getFeedPosts();
// 	}, [showToast, setPosts]);

// 	return (
// 		<Flex gap="10" alignItems={"flex-start"}>
// 			<Box flex={70}>
// 				{!loading && posts.length === 0 && (
// 					<h1>Follow users for the latest Brookhouse news.</h1>
// 				)}

// 				{loading && (
// 					<Flex justify="center">
// 						<Spinner size="xl" />
// 					</Flex>
// 				)}

// 				{posts.map((post) => (
// 					<Box
// 						key={post._id}
// 						borderWidth="1px"
// 						borderRadius="lg"
// 						p={4}
// 						mb={6}
// 						boxShadow="sm"
// 						transition="all 0.3s ease-in-out"
// 						_hover={{
// 							transform: "scale(1.05) rotate(1deg)",
// 							boxShadow: "lg",
// 							backgroundColor: "teal.50",
// 						}}
// 					>
// 						{/* Assuming Post component takes care of image and content */}
// 						<Post post={post} postedBy={post.postedBy} />
// 					</Box>
// 				))}
// 			</Box>

// 			<Box
// 				flex={30}
// 				display={{
// 					base: "none",
// 					md: "block",
// 				}}
// 			>
// 				<SuggestedUsers />
// 			</Box>
// 		</Flex>
// 	);
// };

// export default HomePage;

// this is is home page with sugggested users disable version 3 working
// import { Box, Flex, Spinner } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
// import { useRecoilState } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// // import SuggestedUsers from "../components/SuggestedUsers"; // Commented out the import

// const HomePage = () => {
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const [loading, setLoading] = useState(true);
// 	const showToast = useShowToast();

// 	useEffect(() => {
// 		const getFeedPosts = async () => {
// 			setLoading(true);
// 			setPosts([]);
// 			try {
// 				const res = await fetch("/api/posts/feed");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				console.log(data);
// 				setPosts(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		getFeedPosts();
// 	}, [showToast, setPosts]);

// 	return (
// 		<Flex gap="10" alignItems={"flex-start"}>
// 			<Box flex={70}>
// 				{!loading && posts.length === 0 && (
// 					<h1>welcome  to pear you have succesfully created an account login in to see the latest brookhouse news.</h1>
// 				)}

// 				{loading && (
// 					<Flex justifyContent="center">
// 						<Spinner size="xl" />
// 					</Flex>
// 				)}

// 				{posts.map((post) => (
// 					<Box
// 						key={post._id}
// 						borderWidth="1px"
// 						borderRadius="lg"
// 						p={4}
// 						mb={6}
// 						boxShadow="sm"
// 						transition="all 0.3s ease-in-out"
// 						_hover={{
// 							transform: "scale(1.05) rotate(1deg)",
// 							boxShadow: "lg",
// 							backgroundColor: "teal.50",
// 						}}
// 					>
// 						{/* Assuming Post component takes care of image and content */}
// 						<Post post={post} postedBy={post.postedBy} />
// 					</Box>
// 				))}
// 			</Box>

// 			{/* 
// 			<Box
// 				flex={30}
// 				display={{
// 					base: "none",
// 					md: "block",
// 				}}
// 			>
// 				<SuggestedUsers />
// 			</Box>
// 			*/}
// 		</Flex>
// 	);
// };

// export default HomePage;




// adding the new posts working
// import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import Post from "../components/Post";
// import { useRecoilState } from "recoil";
// import postsAtom from "../atoms/postsAtom";
// import '../index.css'; // Ensure correct CSS is imported

// const HomePage = () => {
// 	const [posts, setPosts] = useRecoilState(postsAtom);
// 	const [loading, setLoading] = useState(true);
// 	const [newPosts, setNewPosts] = useState([]);
// 	const showToast = useShowToast();

// 	useEffect(() => {
// 		const getFeedPosts = async () => {
// 			setLoading(true);
// 			setPosts([]);
// 			try {
// 				const res = await fetch("/api/posts/feed");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				setPosts(data);

// 				const now = Date.now();
// 				const recentPosts = data.filter(post => {
// 					const postAgeInHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
// 					return postAgeInHours <= 3; // Check if post is within 1-3 hours
// 				});
// 				setNewPosts(recentPosts);

// 				setTimeout(() => {
// 					setNewPosts([]);
// 				}, 30000); // "New to you" message disappears after 30 seconds
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		getFeedPosts();
// 	}, [showToast, setPosts]);

// 	const isNewPost = (postTime) => {
// 		const now = Date.now();
// 		const postAgeInHours = (now - new Date(postTime).getTime()) / (1000 * 60 * 60);
// 		return postAgeInHours <= 3;
// 	};

// 	return (
// 		<Flex gap="10" alignItems={"flex-start"}>
// 			<Box flex={70}>
// 				{!loading && posts.length === 0 && (
// 					<h1>Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news.</h1>
// 				)}

// 				{loading && (
// 					<Flex justifyContent="center">
// 						<Spinner size="xl" />
// 					</Flex>
// 				)}

// 				{posts.map((post) => {
// 					const isNew = isNewPost(post.createdAt);

// 					return (
// 						<Box
// 							key={post._id}
// 							className="postContainer"
// 							borderWidth="1px"
// 							borderRadius="lg"
// 							p={4}
// 							mb={6}
// 							boxShadow="sm"
// 						>
// 							<Post post={post} postedBy={post.postedBy} />

// 							{isNew && newPosts.includes(post) && (
// 								<Text className="newToYouText" mt={2}>New to you!</Text>
// 							)}
// 						</Box>
// 					);
// 				})}
// 			</Box>
// 		</Flex>
// 	);
// };

// export default HomePage;


// this is with translations added(working)
import { Box, Flex, Spinner, Text, Link } from "@chakra-ui/react"; // Added Link import
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom'; // Added RouterLink import
import '../index.css';

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [newPosts, setNewPosts] = useState([]);
	const showToast = useShowToast();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);

	// Handle language changes
	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setLanguage(lng);
		};

		i18n.on('languageChanged', handleLanguageChange);

		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
	
				if (data.error) {
					showToast(t("Error"), data.error, "error");
					return;
				}
	
				setPosts(data);
	
				const now = Date.now();
				const recentPosts = data.filter(post => {
					const postAgeInHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
					return postAgeInHours <= 3; // Check if post is within 1-3 hours
				});
				setNewPosts(recentPosts);
	
				setTimeout(() => {
					setNewPosts([]);
				}, 30000); // "New to you" message disappears after 30 seconds
			} catch (error) {
				if (error.message.includes('User not found')) {
					console.warn("User retrieval failed but no toast shown");
				} else {
					showToast(t("Error"), error.message, "error");
				}
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts, t]);
	
	const isNewPost = (postTime) => {
		const now = Date.now();
		const postAgeInHours = (now - new Date(postTime).getTime()) / (1000 * 60 * 60);
		return postAgeInHours <= 3;
	};

	return (
		<Box>
			<Flex direction="column" gap={4} pb={4}>
				{!loading && posts.length === 0 && (
					<Text fontSize="md" textAlign="center" p={4}>
						{t("Welcome to Pear! You have successfully created an account.")} <Link as={RouterLink} to="/auth" color="blue.500" fontWeight="bold">{t("Click here to log in")}</Link> {t("to see the latest Brookhouse news 🍐.")}
					</Text>
				)}

				{loading && (
					<Flex justify="center" my={12}>
						<Spinner size="xl" />
					</Flex>
				)}

				{posts.map((post) => {
					const isNew = isNewPost(post.createdAt);

					return (
						<Box key={post._id} position="relative">
							<Post post={post} />
							{isNew && newPosts.includes(post) && (
								<Text position="absolute" top={0} right={0} bg="blue.500" color="white" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold">
									{t("New to you!")}
								</Text>
							)}
						</Box>
					);
				})}
			</Flex>
		</Box>
	);
};

export default HomePage;