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
import { 
	Box, 
	Flex, 
	Spinner, 
	Text, 
	Input, 
	InputGroup, 
	InputLeftElement,
	useColorMode,
	Avatar,
	Icon,
	Circle,
	Divider,
	Card,
	CardHeader,
	CardBody,
	CardFooter
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import useShowToast from "../hooks/useShowToast";
  import Post from "../components/Post";
  import { useRecoilState, useRecoilValue } from "recoil";
  import postsAtom from "../atoms/postsAtom";
  import userAtom from "../atoms/userAtom";
  import { useTranslation } from 'react-i18next';
  import { SearchIcon } from "@chakra-ui/icons";
  import { AiFillHome } from "react-icons/ai";
  import { BsBookmark, BsCalendar3, BsChatLeftText } from "react-icons/bs";
  import { IoDocumentTextOutline } from "react-icons/io5";
  import { HiUserGroup } from "react-icons/hi";
  import '../index.css';
  
  const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [newPosts, setNewPosts] = useState([]);
	const showToast = useShowToast();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);
	const { colorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	
	// For responsive design
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
	useEffect(() => {
	  const handleResize = () => {
		const mobile = window.innerWidth < 768;
		setIsMobile(mobile);
		if (!mobile && !isSidebarOpen) {
		  setIsSidebarOpen(true);
		} else if (mobile && isSidebarOpen) {
		  setIsSidebarOpen(false);
		}
	  };
  
	  window.addEventListener('resize', handleResize);
	  return () => {
		window.removeEventListener('resize', handleResize);
	  };
	}, [isSidebarOpen]);
  
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
			return postAgeInHours <= 3;
		  });
		  setNewPosts(recentPosts);
  
		  setTimeout(() => {
			setNewPosts([]);
		  }, 30000);
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
  
	// Toggle sidebar for mobile
	const toggleSidebar = () => {
	  setIsSidebarOpen(!isSidebarOpen);
	};
  
	return (
	  <Box 
		bg={colorMode === "dark" ? "gray.800" : "gray.50"} 
		minH="100vh" 
		transition="all 0.2s"
	  >
		{/* Header */}
		<Flex 
		  position="sticky" 
		  top="0" 
		  zIndex="10" 
		  p={4} 
		  bg={colorMode === "dark" ? "gray.900" : "white"} 
		  boxShadow="sm" 
		  align="center" 
		  justify="space-between"
		>
		  {/* Left: Logo and Brand */}
		  <Flex align="center">
			{isMobile && (
			  <Icon 
				as={AiFillHome} 
				w={6} 
				h={6} 
				color="green.500" 
				mr={2} 
				cursor="pointer" 
				onClick={toggleSidebar}
			  />
			)}
			<Circle size="50px" bg="green.500" color="white" mr={2}>
			  <Text fontSize="xl" fontWeight="bold">P</Text>
			</Circle>
			<Text fontSize="xl" fontWeight="bold" display={{ base: "none", md: "block" }}>Pear</Text>
		  </Flex>
  
		  {/* Center: Search */}
		  <InputGroup maxW={{ base: "60%", md: "400px" }} mx={{ md: 4 }}>
			<InputLeftElement pointerEvents="none">
			  <SearchIcon color="gray.400" />
			</InputLeftElement>
			<Input 
			  placeholder={t("Search Pear...")} 
			  bg={colorMode === "dark" ? "gray.700" : "gray.100"} 
			  borderRadius="full" 
			/>
		  </InputGroup>
  
		  {/* Right: User Profile */}
		  <Avatar 
			size="sm" 
			name={user?.username || "User"} 
			src={user?.profilePic} 
			bg="gray.300"
		  />
		</Flex>
  
		{/* Main Content Area */}
		<Flex>
		  {/* Sidebar */}
		  {isSidebarOpen && (
			<Box 
			  w={{ base: "250px", lg: "280px" }} 
			  p={5} 
			  bg={colorMode === "dark" ? "gray.900" : "white"} 
			  boxShadow="md" 
			  h="calc(100vh - 72px)" 
			  position="sticky" 
			  top="72px" 
			  transition="all 0.3s ease"
			  zIndex="5"
			  overflowY="auto"
			  display={{ base: isMobile ? "block" : "none", md: "block" }}
			>
			  <Flex direction="column" h="100%">
				<Box mb={6}>
				  <Text fontSize="lg" fontWeight="bold" mb={4}>{t("Home")}</Text>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} 
					bg={colorMode === "dark" ? "gray.800" : "gray.100"} 
					fontWeight="bold"
				  >
					<Icon as={AiFillHome} mr={3} />
					<Text>{t("Feed")}</Text>
				  </Flex>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.100" }}>
					<Icon as={BsBookmark} mr={3} />
					<Text>{t("Saved")}</Text>
				  </Flex>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.100" }}>
					<Icon as={IoDocumentTextOutline} mr={3} />
					<Text>{t("Assignments")}</Text>
				  </Flex>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.100" }}>
					<Icon as={BsCalendar3} mr={3} />
					<Text>{t("Calendar")}</Text>
				  </Flex>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.100" }}>
					<Icon as={BsChatLeftText} mr={3} />
					<Text>{t("Messages")}</Text>
				  </Flex>
				</Box>
  
				<Divider mb={6} />
  
				<Box>
				  <Text fontSize="lg" fontWeight="bold" mb={4}>{t("Your Activity")}</Text>
				  <Flex align="center" py={2} px={3} borderRadius="md" mb={2} _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.100" }}>
					<Icon as={HiUserGroup} mr={3} />
					<Text>{t("Your Communities")}</Text>
				  </Flex>
				</Box>
			  </Flex>
			</Box>
		  )}
  
		  {/* Main Content */}
		  <Box 
			flex="1" 
			p={{ base: 3, md: 6 }} 
			maxW={{ base: "100%", lg: "800px" }} 
			mx="auto"
		  >
			{/* Create Post Card */}
			<Card 
			  mb={6} 
			  boxShadow="md" 
			  bg={colorMode === "dark" ? "gray.800" : "white"} 
			  borderRadius="lg"
			>
			  <CardBody p={4}>
				<Flex align="center">
				  <Avatar size="sm" mr={4} name={user?.username || "User"} src={user?.profilePic} />
				  <InputGroup>
					<Input 
					  placeholder={t("What's on your mind?")} 
					  borderRadius="full" 
					  bg={colorMode === "dark" ? "gray.700" : "gray.100"} 
					/>
				  </InputGroup>
				</Flex>
			  </CardBody>
			  <Divider />
			  <CardFooter p={2} justifyContent="space-around">
				<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
				  <Text>{t("📷 Photo")}</Text>
				</Flex>
				<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
				  <Text>{t("📄 Document")}</Text>
				</Flex>
				<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
				  <Text>{t("👥 Tag")}</Text>
				</Flex>
			  </CardFooter>
			</Card>
  
			{/* Posts */}
			{!loading && posts.length === 0 && (
			  <Card p={6} textAlign="center" boxShadow="md">
				<Text fontSize="lg">
				  {t("Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news 🍐.")}
				</Text>
			  </Card>
			)}
  
			{loading && (
			  <Flex justifyContent="center" p={10}>
				<Spinner size="xl" color="green.500" />
			  </Flex>
			)}
  
			{posts.map((post) => {
			  const isNew = isNewPost(post.createdAt);
  
			  return (
				<Card 
				  key={post._id} 
				  mb={6} 
				  boxShadow="md" 
				  borderRadius="lg"
				  bg={colorMode === "dark" ? "gray.800" : "white"}
				  transition="all 0.3s ease"
				  _hover={{ 
					transform: "translateY(-4px)", 
					boxShadow: "lg" 
				  }}
				  overflow="hidden"
				>
				  <CardHeader pb={0}>
					<Flex align="center">
					  <Avatar 
						size="sm" 
						name={post.postedBy.username || "User"} 
						src={post.postedBy.profilePic} 
						mr={3} 
					  />
					  <Box>
						<Text fontWeight="bold">{post.postedBy.username}</Text>
						<Text fontSize="sm" color="gray.500">
						  {new Date(post.createdAt).toLocaleString()}
						</Text>
					  </Box>
					</Flex>
				  </CardHeader>
				  <CardBody pt={2}>
					<Box className="customPostContainer">
					  <Post post={post} postedBy={post.postedBy} />
					</Box>
					{isNew && newPosts.includes(post) && (
					  <Flex mt={2} justify="flex-end">
						<Box 
						  bg="green.100" 
						  color="green.800" 
						  px={3} 
						  py={1} 
						  borderRadius="full" 
						  fontSize="xs" 
						  fontWeight="bold"
						>
						  {t("New to you!")}
						</Box>
					  </Flex>
					)}
				  </CardBody>
				  <Divider />
				  <CardFooter py={2} justifyContent="space-around">
					<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
					  <Text>{t("👍 Like")}</Text>
					</Flex>
					<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
					  <Text>{t("💬 Comment")}</Text>
					</Flex>
					<Flex align="center" p={2} borderRadius="md" cursor="pointer" _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}>
					  <Text>{t("↗️ Share")}</Text>
					</Flex>
				  </CardFooter>
				</Card>
			  );
			})}
		  </Box>
  
		  {/* Right Sidebar (Trending) - Only visible on larger screens */}
		  <Box 
			w="300px" 
			p={5} 
			bg={colorMode === "dark" ? "gray.900" : "white"} 
			boxShadow="md" 
			h="calc(100vh - 72px)" 
			position="sticky" 
			top="72px" 
			display={{ base: "none", lg: "block" }}
			overflowY="auto"
		  >
			<Text fontSize="lg" fontWeight="bold" mb={4}>{t("Trending")}</Text>
			<Flex mb={4} wrap="wrap" gap={2}>
			  <Box 
				px={3} 
				py={1} 
				bg="green.500" 
				color="white" 
				borderRadius="full" 
				fontSize="sm"
			  >
				{t("All Posts")}
			  </Box>
			  <Box 
				px={3} 
				py={1} 
				bg={colorMode === "dark" ? "gray.700" : "gray.100"} 
				borderRadius="full" 
				fontSize="sm"
			  >
				{t("Popular")}
			  </Box>
			  <Box 
				px={3} 
				py={1} 
				bg={colorMode === "dark" ? "gray.700" : "gray.100"} 
				borderRadius="full" 
				fontSize="sm"
			  >
				{t("Recent")}
			  </Box>
			</Flex>
  
			{/* Trending Topics */}
			{[1, 2, 3, 4].map((item) => (
			  <Box key={item} mb={4}>
				<Divider mb={2} />
				<Flex justify="space-between" align="center">
				  <Box>
					<Text fontWeight="bold" fontSize="md">#{t(`Topic${item}`)}</Text>
					<Text fontSize="sm" color="gray.500">{Math.floor(Math.random() * 100) + 20} {t("posts")}</Text>
				  </Box>
				  <Circle size="40px" bg={colorMode === "dark" ? "gray.700" : "gray.100"}>
					<Text fontSize="lg">🔥</Text>
				  </Circle>
				</Flex>
			  </Box>
			))}
		  </Box>
		</Flex>
	  </Box>
	);
  };
  
  export default HomePage;
