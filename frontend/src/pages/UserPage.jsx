// UserPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import {
  Flex,
  Spinner,
  Text,
  Box,
  Button,
  Skeleton,
  useBreakpointValue,
  Avatar,
  Stack,
} from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";
import userAtom from "../atoms/userAtom";
import { FaLock } from "react-icons/fa";
import NotelyWidget from "../components/NotelyWidget";

// --- BentoGrid Component ---
function BentoGrid({ children }) {
  const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3 });
  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={6}
      w="100%"
      autoRows="22rem"
      mt={6}
      mb={8}
    >
      {children}
    </Box>
  );
}

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useRecoilValue(userAtom);
  const [fromSearch, setFromSearch] = useState(false);

  // Check if the page was accessed via search
  useEffect(() => {
    if (currentUser?._id === user?._id) {
      setFromSearch(false);
      sessionStorage.removeItem(`userPage_${username}_fromSearch`);
      return;
    }
    const isFromSearch = location.state?.fromSearch;
    if (isFromSearch) {
      sessionStorage.setItem(`userPage_${username}_fromSearch`, "true");
      setFromSearch(true);
    } else {
      const storedFromSearch = sessionStorage.getItem(`userPage_${username}_fromSearch`);
      setFromSearch(storedFromSearch === "true");
    }
    return () => {
      if (!window.location.pathname.includes(`/${username}`)) {
        sessionStorage.removeItem(`userPage_${username}_fromSearch`);
      }
    };
  }, [location.state, username, currentUser?._id, user?._id]);

  const handleMessage = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();
    const schoolStart = 810;
    const lunchStart = 1250;
    const lunchEnd = 1340;
    const schoolEnd = 1535;
    const isStudent = currentUser?.role === "student";
    const allowedAccess = !isStudent || (
      (dayOfWeek >= 1 && dayOfWeek <= 5 && (
        currentTime < schoolStart ||
        (currentTime >= lunchStart && currentTime <= lunchEnd) ||
        currentTime > schoolEnd
      )) ||
      dayOfWeek === 0 ||
      dayOfWeek === 6
    );
    if (!allowedAccess) {
      let message = "Messaging is only available during breaks";
      if (currentTime < schoolStart) message = "Please wait until school starts";
      else if (currentTime <= schoolEnd) message = "Wait until lunch time or school ends";
      showToast("Error", message, "error");
      return;
    }
    navigate(`/chat`, { state: { recipient: user, fromSearch: true } });
  };

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/user/${username}`, { credentials: "include" });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch posts: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    if (user) getPosts();
  }, [username, showToast, setPosts, user]);

  // --- Skeleton grid for loading ---
  if (!user && loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="2xl" fontWeight="bold">User not found</Text>
      </Flex>
    );
  }

  // --- Enlarged Profile Header ---
  return (
    <Box px={{ base: 2, md: 8 }} pt={8} maxW="900px" mx="auto">
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        gap={{ base: 4, md: 10 }}
        mb={8}
        w="100%"
      >
        <Avatar
          src={user.profilePic}
          size={useBreakpointValue({ base: "2xl", md: "2xl", lg: "2xl" })}
          boxSize={{ base: "120px", md: "180px", lg: "200px" }}
          borderWidth={3}
          borderColor="green.400"
          mb={{ base: 2, md: 0 }}
        />
        <Stack
          spacing={3}
          align={{ base: "center", md: "flex-start" }}
          w="100%"
        >
          <Flex align="center" gap={4} flexWrap="wrap">
            <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight="bold">
              {user.username}
            </Text>
            <Button size="sm" colorScheme="green" fontWeight="bold">
              Edit Profile
            </Button>
            <Button size="sm" variant="outline" fontWeight="bold">
              View Archive
            </Button>
          </Flex>
          <Flex gap={6} fontSize={{ base: "md", md: "lg" }} color="gray.400">
            <Text>
              <b>{posts.length}</b> posts
            </Text>
            <Text>
              <b>{user.followers}</b> followers
            </Text>
            <Text>
              <b>{user.following}</b> following
            </Text>
          </Flex>
        </Stack>
      </Flex>

      {fromSearch && currentUser?._id !== user._id && (
        <Flex justifyContent="flex-end" px={4} mb={4}>
          {(() => {
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay();
            const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();
            const schoolStart = 810;
            const lunchStart = 1250;
            const lunchEnd = 1340;
            const schoolEnd = 1535;
            const isStudent = currentUser?.role === "student";
            const allowedAccess = !isStudent || (
              (dayOfWeek >= 1 && dayOfWeek <= 5 && (
                currentTime < schoolStart ||
                (currentTime >= lunchStart && currentTime <= lunchEnd) ||
                currentTime > schoolEnd
              )) ||
              dayOfWeek === 0 ||
              dayOfWeek === 6
            );
            return (
              <Button
                onClick={allowedAccess ? handleMessage : undefined}
                ml={2}
                size="sm"
                colorScheme={allowedAccess ? "teal" : "red"}
                leftIcon={!allowedAccess ? <FaLock /> : undefined}
                isDisabled={!allowedAccess}
                variant="solid"
                fontWeight="medium"
                borderRadius="full"
              >
                {allowedAccess ? "Go to Message" : "Locked"}
              </Button>
            );
          })()}
        </Flex>
      )}

      {error && (
        <Box p={4} bg="red.50" color="red.700" borderRadius="md" my={4}>
          <Text fontWeight="medium">Error loading posts: {error}</Text>
        </Box>
      )}

      {fetchingPosts && (
        <BentoGrid>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="22rem" borderRadius="xl" />
          ))}
        </BentoGrid>
      )}

      {!fetchingPosts && (
        <BentoGrid>
          <Box gridColumn={{ base: "1", md: "span 1" }}>
            <NotelyWidget isOpen={true} setIsOpen={() => {}} fixed />
          </Box>
          {posts.length === 0 && !error ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={8}
              textAlign="center"
              fontSize="xl"
              color="gray.400"
              gridColumn="1 / -1"
            >
              User has no posts.
            </Box>
          ) : (
            posts.map((post, i) => (
              <Box
                key={post._id}
                gridColumn={i % 7 === 0 ? { lg: "span 2" } : undefined}
                gridRow={i % 5 === 0 ? { lg: "span 2" } : undefined}
              >
                <Post post={post} postedBy={post.postedBy} />
              </Box>
            ))
          )}
        </BentoGrid>
      )}

      <CreatePost />
    </Box>
  );
};

export default UserPage;

