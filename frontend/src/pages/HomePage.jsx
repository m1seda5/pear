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
import SuggestedUsers from "../components/SuggestedUsers";

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
			<Flex gap='10' alignItems={"flex-start"}>
				<Box flex={70}>
					{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
					{loading && (
						<Flex justify='center'>
							<Spinner size='xl' />
						</Flex>
					)}
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</Box>
				{/*
				// SuggestedUsers sidebar is disabled because everyone follows each other now.
				<Box
					flex={30}
					display={{
						base: "none",
						md: "block",
					}}
				>
					<SuggestedUsers />
				</Box>
				*/}
			</Flex>
		</>
	);
};

export default HomePage;
