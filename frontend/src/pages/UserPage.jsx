import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box, Button } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";
import userAtom from "../atoms/userAtom";

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
    // Check location.state for initial navigation
    const isFromSearch = location.state?.fromSearch;
    if (isFromSearch) {
      sessionStorage.setItem(`userPage_${username}_fromSearch`, "true");
      setFromSearch(true);
    } else {
      // Check sessionStorage for persisted state (e.g., after refresh)
      const storedFromSearch = sessionStorage.getItem(`userPage_${username}_fromSearch`);
      setFromSearch(storedFromSearch === "true");
    }

    // Cleanup on unmount (when navigating away)
    return () => {
      // Only clear if navigating to a different page
      if (!window.location.pathname.includes(`/user/${username}`)) {
        sessionStorage.removeItem(`userPage_${username}_fromSearch`);
      }
    };
  }, [location.state, username]);

  // Handle message button click
  const handleMessage = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

    const schoolStart = 810;
    const lunchStart = 1250;
    const lunchEnd = 1340;
    const schoolEnd = 1535;

    const isStudent = currentUser?.role === "student";
    const isTeacher = currentUser?.role === "teacher";
    const isAdmin = currentUser?.role === "admin";

    const hasChatAccess = currentUser && (
      isTeacher ||
      isAdmin ||
      (isStudent &&
        ((dayOfWeek >= 1 &&
          dayOfWeek <= 5 &&
          (currentTime < schoolStart ||
            (currentTime >= lunchStart && currentTime <= lunchEnd) ||
            currentTime > schoolEnd)) ||
          dayOfWeek === 0 ||
          dayOfWeek === 6))
    );

    if (!hasChatAccess) {
      showToast("Error", "Messaging is only available during breaks", "error");
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
        const res = await fetch(`/api/posts/user/${username}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Failed to fetch posts: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    if (user) getPosts();
  }, [username, showToast, setPosts, user]);

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

  return (
    <Box>
      <UserHeader user={user} />
      {fromSearch && currentUser?._id !== user._id && (
        <Flex justifyContent="flex-end" px={4} mb={4}>
          <Button onClick={handleMessage} ml={2}>
            Message
          </Button>
        </Flex>
      )}

      {error && (
        <Box p={4} bg="red.50" color="red.700" borderRadius="md" my={4}>
          <Text fontWeight="medium">Error loading posts: {error}</Text>
        </Box>
      )}

      {!fetchingPosts && posts.length === 0 && !error && (
        <Text fontSize="lg" textAlign="center" my={8}>
          User has no posts.
        </Text>
      )}

      {fetchingPosts && (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}

      <CreatePost />
    </Box>
  );
};

export default UserPage;
