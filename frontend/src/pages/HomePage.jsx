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
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import TutorialSlider from "../components/TutorialSlider";
import { useTranslation } from 'react-i18next';
import '../index.css';

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [newPosts, setNewPosts] = useState([]);
  const showToast = useShowToast();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [blurActive, setBlurActive] = useState(true); // Start with blur active
  const [triggerProfileAnimation, setTriggerProfileAnimation] = useState(false);
  const [triggerCreatePostAnimation, setTriggerCreatePostAnimation] = useState(false);
  const user = useRecoilValue(userAtom);

  const [tutorialRunCount, setTutorialRunCount] = useState(() => {
    const savedCount = localStorage.getItem('tutorialRunCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const MAX_TUTORIAL_RUNS = 30;

  useEffect(() => {
    const handleLanguageChange = (lng) => setLanguage(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    if (user && tutorialRunCount < MAX_TUTORIAL_RUNS) {
      setTimeout(() => {
        setShowTutorial(true);
        setIsTutorialActive(true);
        setBlurActive(true); // Ensure blur is active during TutorialSlider
      }, 500);
    }
  }, [user, tutorialRunCount]);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        if (!res.ok) throw new Error(t("Failed to fetch posts"));
        const data = await res.json();
        if (data.error) {
          if (!data.error.includes("User not found")) showToast(t("Error"), data.error, "error");
          return;
        }
        setPosts(data);
        const now = Date.now();
        const recentPosts = data.filter(post => (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60) <= 3);
        setNewPosts(recentPosts);
        setTimeout(() => setNewPosts([]), 30000);
      } catch (error) {
        if (!error.message.includes('User not found')) showToast(t("Error"), error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts, t]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setIsTutorialActive(false);
    setBlurActive(false); // Turn off blur after TutorialSlider ends
    setTutorialRunCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('tutorialRunCount', newCount);
      return newCount;
    });
  };

  const handleNextToProfile = (username) => {
    setShowTutorial(false);
    setBlurActive(false); // Ensure blur is off during transition
    setTriggerProfileAnimation(true);
    setTimeout(() => {
      setTriggerProfileAnimation(false);
      setTriggerCreatePostAnimation(true);
    }, 1500);
  };

  const handleCreatePostTutorialStart = () => {
    setBlurActive(true); // Turn blur back on for CreatePost tutorial
  };

  const handleCreatePostTutorialEnd = () => {
    setBlurActive(false); // Turn blur off after CreatePost tutorial ends
    setIsTutorialActive(false); // End tutorial state
  };

  const isNewPost = (postTime) => {
    const now = Date.now();
    return (now - new Date(postTime).getTime()) / (1000 * 60 * 60) <= 3;
  };

  return (
    <Box className={isTutorialActive ? "pointer-events-none" : ""}>
      {showTutorial && (
        <>
          {blurActive && (
            <Box
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              backdropFilter="blur(8px)"
              bgColor="rgba(0, 0, 0, 0.4)"
              zIndex="1001"
              animation="blurIn 0.5s forwards"
              sx={{ "@keyframes blurIn": { from: { backdropFilter: "blur(0)" }, to: { backdropFilter: "blur(8px)" } } }}
            />
          )}
          <TutorialSlider onComplete={handleTutorialComplete} onNextToProfile={handleNextToProfile} />
        </>
      )}
      <Flex gap="10" alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>{t("Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news 🍐.")}</h1>
          )}
          {loading && (
            <Flex justifyContent="center"><Spinner size="xl" /></Flex>
          )}
          {posts.map((post) => (
            <Box key={post._id} className="postContainer" borderWidth="1px" borderRadius="lg" p={4} mb={6} boxShadow="sm">
              <Post post={post} postedBy={post.postedBy} />
              {isNewPost(post.createdAt) && newPosts.includes(post) && (
                <Text className="newToYouText" mt={2}>{t("New to you!")}</Text>
              )}
            </Box>
          ))}
        </Box>
      </Flex>
      {triggerProfileAnimation && <Header triggerProfileAnimation={true} />}
      {triggerCreatePostAnimation && (
        <UserPage
          triggerCreatePostAnimation={true}
          blurActive={blurActive}
          onCreatePostTutorialStart={handleCreatePostTutorialStart}
          onCreatePostTutorialEnd={handleCreatePostTutorialEnd}
        />
      )}
    </Box>
  );
};

export default HomePage;