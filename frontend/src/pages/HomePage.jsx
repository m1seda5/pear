import { Box, Flex, VStack, HStack, Text, Avatar, Button, Input, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import { FaImage, FaVideo, FaUserTag, FaMapMarkerAlt } from "react-icons/fa";

const demoWeather = {
	temp: "71°",
	desc: "Sunny",
	realFeel: "78°",
	rainChance: "5%",
	days: [
		{ day: "MON", icon: "☀️", temp: "69°" },
		{ day: "TUE", icon: "🌧️", temp: "74°" },
		{ day: "WED", icon: "🌧️", temp: "73°" },
		{ day: "THU", icon: "☁️", temp: "68°" },
		{ day: "FRI", icon: "🌧️", temp: "55°" },
		{ day: "SAT", icon: "🌧️", temp: "58°" },
		{ day: "SUN", icon: "☀️", temp: "64°" },
	],
	date: "Sunday, 18th 2018",
	location: "Los Angeles, CA"
};

const demoPages = [
	{ name: "Fast Pizza", desc: "Pizza & Fast Food" },
	{ name: "Lonely Droid", desc: "Technology" },
	{ name: "Meta Movies", desc: "Movies / Entertainment" },
	{ name: "Nuclearjs", desc: "Technology" },
	{ name: "Slicer", desc: "Web / Design" }
];

const demoFriends = [
	{ name: "Nelly Schwartz", location: "Melbourne" },
	{ name: "Lana Henrikssen", location: "Helsinki" },
	{ name: "Gaelle Morris", location: "Lyon" },
	{ name: "Mike Lasalle", location: "Toronto" },
	{ name: "Rolf Krupp", location: "Berlin" }
];

const HomePage = () => {
	const user = useRecoilValue(userAtom);
	const [posts, setPosts] = useState([]);
	const [postText, setPostText] = useState("");
	const bgColor = useColorModeValue("#f5f6fa", "#23272f");
	const cardBg = useColorModeValue("#fff", "#23272f");
	const borderColor = useColorModeValue("#e6e6e6", "#23272f");

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (res.ok) {
					setPosts(data);
				} else {
					setPosts([]);
				}
			} catch (error) {
				setPosts([]);
			}
		};
		fetchPosts();
	}, []);

	return (
		<Box minH="100vh" bg={bgColor} py={6}>
			<Flex maxW="1400px" mx="auto" gap={8} align="flex-start">
				{/* Left Sidebar */}
				<VStack spacing={6} align="stretch" flex="1" minW="260px">
					{/* Weather Widget */}
					<Box className="card" p={6}>
						<Text fontWeight="bold" fontSize="2xl">{demoWeather.temp}</Text>
						<Text color="gray.500">{demoWeather.desc}</Text>
						<Text fontSize="sm" color="gray.400">Real Feel: {demoWeather.realFeel} | Rain Chance: {demoWeather.rainChance}</Text>
						<HStack mt={2} spacing={2}>
							{demoWeather.days.map((d) => (
								<VStack key={d.day} spacing={0}>
									<Text fontSize="xs" color="gray.400">{d.day}</Text>
									<Text>{d.icon}</Text>
									<Text fontSize="xs" color="gray.400">{d.temp}</Text>
								</VStack>
							))}
						</HStack>
						<Text mt={4} fontSize="sm" color="gray.400">{demoWeather.date}</Text>
						<Text fontSize="sm" color="gray.400">{demoWeather.location}</Text>
					</Box>
					{/* Recommended Pages */}
					<Box className="card" p={6}>
						<Text fontWeight="bold" mb={2}>Recommended Pages</Text>
						{demoPages.map((p) => (
							<HStack key={p.name} justify="space-between" py={1}>
								<Text>{p.name}</Text>
								<Text fontSize="xs" color="gray.400">{p.desc}</Text>
							</HStack>
						))}
					</Box>
				</VStack>

				{/* Center Feed */}
				<Box flex="2" className="posts-feed-wrapper">
					{/* Stories (demo) */}
					<Box className="card" p={6} mb={6}>
						<Text fontWeight="bold" mb={2}>Stories</Text>
						<HStack>
							<Avatar name="Dan Walker" />
							<Avatar name="Bobby Brown" />
							<Avatar name="Elise Walker" />
						</HStack>
					</Box>
					{/* Compose Card */}
					<Box className="card" p={6} mb={6}>
						<HStack mb={4}>
							<Avatar size="md" src={user?.profilePic} name={user?.name} />
							<Input
								placeholder="Write something about you..."
								value={postText}
								onChange={(e) => setPostText(e.target.value)}
								borderRadius="full"
								bg={bgColor}
							/>
						</HStack>
						<HStack spacing={4}>
							<Tooltip label="Add a photo" hasArrow>
								<Button variant="ghost" leftIcon={<FaImage />} colorScheme="blue">Photo</Button>
							</Tooltip>
							<Tooltip label="Coming soon" hasArrow>
								<Button variant="ghost" leftIcon={<FaVideo />} colorScheme="blue">Video</Button>
							</Tooltip>
							<Tooltip label="Tag friends" hasArrow>
								<Button variant="ghost" leftIcon={<FaUserTag />} colorScheme="blue">Tag</Button>
							</Tooltip>
							<Tooltip label="Add location" hasArrow>
								<Button variant="ghost" leftIcon={<FaMapMarkerAlt />} colorScheme="blue">Location</Button>
							</Tooltip>
							<Button colorScheme="blue" size="sm" isDisabled={!postText.trim()}>Publish</Button>
						</HStack>
					</Box>
					{/* Posts */}
					<VStack spacing={6} align="stretch">
						{posts.map((post) => (
							<Post key={post._id} post={post} postedBy={post.postedBy} />
						))}
					</VStack>
				</Box>

				{/* Right Sidebar */}
				<VStack spacing={6} align="stretch" flex="1" minW="260px">
					{/* Suggested Friends */}
					<Box className="card" p={6}>
						<Text fontWeight="bold" mb={2}>Suggested Friends</Text>
						{demoFriends.map((f) => (
							<HStack key={f.name} justify="space-between" py={1}>
								<Avatar size="sm" name={f.name} />
								<Box>
									<Text>{f.name}</Text>
									<Text fontSize="xs" color="gray.400">{f.location}</Text>
								</Box>
								<Button size="xs" colorScheme="blue">+</Button>
							</HStack>
						))}
					</Box>
					{/* Notely Widget */}
					<Box className="card" p={6}>
						<Text fontWeight="bold" mb={2}>Notely</Text>
						<Text fontSize="sm" color="gray.400">Your notes and reminders will appear here.</Text>
					</Box>
				</VStack>
			</Flex>
		</Box>
	);
};

export default HomePage;
