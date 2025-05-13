import { Box, Flex, Spinner, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import TutorialSlider from "../components/TutorialSlider";
import { useTranslation } from 'react-i18next';
import '../index.css';
import _ from 'lodash';
import NotelyWidget from "../components/NotelyWidget";
// import HousePointTracker from "../components/HousePointTracker";
// import GameWidget from "../components/GameWidget";

const WidgetPlaceholder = ({ title }) => (
	<Box
		bg="gray.700"
		color="white"
		borderRadius="lg"
		p={6}
		mb={4}
		textAlign="center"
		fontWeight="bold"
		fontSize="lg"
		boxShadow="md"
	>
		{title} <br />
		<Box as="span" fontSize="sm" color="gray.300">Coming Soon</Box>
	</Box>
);

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [newPosts, setNewPosts] = useState([]);
	const showToast = useShowToast();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);
	const [showTutorial, setShowTutorial] = useState(false);
	const user = useRecoilValue(userAtom);
	const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

	// Handle language change
	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setLanguage(lng);
		};
		i18n.on('languageChanged', handleLanguageChange);
		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	// Show tutorial on every page load when user is present
	useEffect(() => {
		if (user) {
			setTimeout(() => {
				setShowTutorial(true);
			}, 500);
		}
	}, []);

	// Fetch feed posts
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				if (!res.ok) {
					throw new Error(t("Failed to fetch posts"));
				}
				const data = await res.json();
				if (data.error) {
					if (!data.error.includes("User not found")) {
						showToast(t("Error"), data.error, "error");
					}
					return;
				}
				setPosts(data);
				const now = Date.now();
				const recentPosts = data.filter(post => {
					const postAgeInHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
					return postAgeInHours <= 3;
				});
				setNewPosts(recentPosts);
				setTimeout(() => {
					setNewPosts([]);
				}, 30000);
			} catch (error) {
				if (!error.message.includes('User not found')) {
					showToast(t("Error"), error.message, "error");
				}
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts, t]);

	const handleTutorialComplete = () => {
		setShowTutorial(false);
	};

	const isNewPost = (postTime) => {
		const now = Date.now();
		const postAgeInHours = (now - new Date(postTime).getTime()) / (1000 * 60 * 60);
		return postAgeInHours <= 3;
	};

	return (
		<>
			{showTutorial && <TutorialSlider onComplete={handleTutorialComplete} />}
			{/* Floating widgets (draggable, same size, hidden on small screens) */}
			{isLargerThan1024 && <NotelyWidget />}
			{/* {isLargerThan1024 && <HousePointTracker showTutorial={false} />} */}
			{/* {isLargerThan1024 && <GameWidget />} */}
			{/* Main posts (original layout) */}
			<Box w="100%" maxW="600px" mx="auto" minW="0">
				{!loading && posts.length === 0 && (
					<h1>{t("Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news 🍐.")}</h1>
				)}
				{loading && (
					<Flex justifyContent="center">
						<Spinner size="xl" />
					</Flex>
				)}
				{posts.map((post) => {
					const isNew = isNewPost(post.createdAt);
					return (
						<Box
							key={post._id}
							className="postContainer"
							borderWidth="1px"
							borderRadius="lg"
							p={4}
							mb={6}
							boxShadow="sm"
							maxW="800px"
							mx="auto"
						>
							<Post post={post} postedBy={post.postedBy} />
							{isNew && newPosts.includes(post) && (
								<Text className="newToYouText" mt={2}>{t("New to you!")}</Text>
							)}
						</Box>
					);
				})}
			</Box>
		</>
	);
};

export default HomePage;
