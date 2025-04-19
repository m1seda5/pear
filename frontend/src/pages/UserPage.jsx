// UserPage.jsx
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"; // You might want to remove this import as well
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box, Button } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
// import CreatePost from "../components/CreatePost"; // REMOVE this import
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
    const isFromSearch = location.state?.fromSearch;
    if (isFromSearch) {
      sessionStorage.setItem(`userPage_${username}_fromSearch`, "true");
      setFromSearch(true);
    } else {
      const storedFromSearch = sessionStorage.getItem(`userPage_${username}_fromSearch`);
      setFromSearch(storedFromSearch === "true");
    }

    return () => {
      if (!window.location.pathname.includes(`/user/${username}`)) {
        sessionStorage.removeItem(`userPage_${username}_fromSearch`);
      }
    };
  }, [location.state, username]);

  // Updated handleMessage function
  const handleMessage = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

    // School hours configuration
    const schoolStart = 810;  // 8:10 AM
    const lunchStart = 1250;  // 12:50 PM
    const lunchEnd = 1340;    // 1:40 PM
    const schoolEnd = 1535;   // 3:35 PM

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

    navigate(`/chat`, {
      state: {
        recipient: user,
        fromSearch: true
      }
    });
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
          throw new Error(`Failed to fetch posts: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
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
      {/* <UserHeader user={user} /> */} {/* You might want to remove this line */}
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

      {/* <CreatePost /> */} {/* ENSURE THIS LINE IS REMOVED */}
    </Box>
  );
};

export default UserPage;
