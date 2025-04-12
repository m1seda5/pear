import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      setError(null);

      try {
        const res = await fetch(`/api/posts/user/${username}`, {
          credentials: "include", // Ensure auth token is sent
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
