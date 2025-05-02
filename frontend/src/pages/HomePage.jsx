import { Box, Flex, Text, Avatar, Button, Input, VStack, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { FaImage, FaVideo, FaSmile, FaMapMarkerAlt, FaUserTag, FaEllipsisH } from "react-icons/fa";

const HomePage = () => {
	const user = useRecoilValue(userAtom);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	const [postText, setPostText] = useState("");
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	return (
		<Flex gap={10} alignItems={"flex-start"} maxW="1200px" mx="auto" px={4} py={8}>
			{/* Left Sidebar */}
			<Box flex="1" position="sticky" top="20" display={{ base: "none", md: "block" }}>
				<VStack spacing={4} align="stretch">
					<Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
						<Text fontWeight="bold" mb={2}>Temperature</Text>
						<Text fontSize="sm" color="gray.500">Coming soon...</Text>
					</Box>
					<Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
						<Text fontWeight="bold" mb={2}>Recommended Pages</Text>
						<Text fontSize="sm" color="gray.500">Coming soon...</Text>
					</Box>
				</VStack>
			</Box>

			{/* Main Content */}
			<Box flex="2">
				{/* Compose Card */}
				<Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} mb={4}>
					<HStack spacing={4} mb={4}>
						<Avatar size="md" src={user?.profilePic} name={user?.name} />
						<Input
							placeholder="Write something about you..."
							value={postText}
							onChange={(e) => setPostText(e.target.value)}
							borderRadius="full"
						/>
					</HStack>
					<HStack justify="space-between" px={4}>
						<HStack spacing={4}>
							<Button variant="ghost" leftIcon={<FaImage />} colorScheme="blue">
								Photo
							</Button>
							<Button variant="ghost" leftIcon={<FaVideo />} colorScheme="blue">
								Video
							</Button>
							<Button variant="ghost" leftIcon={<FaUserTag />} colorScheme="blue">
								Tag
							</Button>
							<Button variant="ghost" leftIcon={<FaMapMarkerAlt />} colorScheme="blue">
								Location
							</Button>
						</HStack>
						<Button colorScheme="blue" size="sm" isDisabled={!postText.trim()}>
							Publish
						</Button>
					</HStack>
				</Box>

				{/* Posts */}
				<VStack spacing={4}>
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</VStack>
			</Box>

			{/* Right Sidebar */}
			<Box flex="1" position="sticky" top="20" display={{ base: "none", md: "block" }}>
				<VStack spacing={4} align="stretch">
					<Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
						<Text fontWeight="bold" mb={2}>Notely</Text>
						<Text fontSize="sm" color="gray.500">Coming soon...</Text>
					</Box>
				</VStack>
			</Box>
		</Flex>
	);
};

export default HomePage;
