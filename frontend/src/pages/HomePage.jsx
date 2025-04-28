import { Box, Flex, Spinner, Text, useMediaQuery, Skeleton, useBreakpointValue } from "@chakra-ui/react";
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
import CreatePostCard from "../components/CreatePostCard";

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

	// Skeleton grid for loading
	if (loading) {
		return (
			<Box px={{ base: 2, md: 8 }} pt={8}>
				<Text fontSize="3xl" fontWeight="bold" color="green.500" mb={6}>Your Feed</Text>
				<BentoGrid>
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} height="22rem" borderRadius="xl" />
					))}
				</BentoGrid>
			</Box>
		);
	}

	// Randomize post grid spans for variety
	const getGridProps = (i) => {
		if (i % 7 === 0) return { gridColumn: { lg: "span 2" }, gridRow: { lg: "span 2" } };
		if (i % 5 === 0) return { gridColumn: { lg: "span 2" } };
		if (i % 3 === 0) return { gridRow: { lg: "span 2" } };
		return {};
	};

	return (
		<>
			{showTutorial && <TutorialSlider onComplete={handleTutorialComplete} />}
			<Box px={{ base: 2, md: 8 }} pt={8}>
				<Text fontSize="3xl" fontWeight="bold" color="green.500" mb={6}>Your Feed</Text>
				<BentoGrid>
					{/* CreatePostCard always first */}
					<Box gridColumn={{ base: "1", md: "span 2" }}>
						<CreatePostCard onPostCreated={post => setPosts([post, ...posts])} />
					</Box>
					{/* NotelyWidget as a fixed grid item */}
					<Box gridColumn={{ base: "1", md: "span 1" }}>
						<NotelyWidget isOpen={true} setIsOpen={() => {}} fixed />
					</Box>
					{/* Posts */}
					{posts.length === 0 ? (
						<Box
							borderWidth="1px"
							borderRadius="lg"
							p={8}
							textAlign="center"
							fontSize="xl"
							color="gray.400"
							gridColumn="1 / -1"
						>
							No posts yet.
						</Box>
					) : (
						posts.map((post, i) => (
							<Box key={post._id} {...getGridProps(i)}>
								<Post post={post} postedBy={post.postedBy} />
							</Box>
						))
					)}
				</BentoGrid>
			</Box>
		</>
	);
};

export default HomePage;
