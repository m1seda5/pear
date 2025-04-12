import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box, keyframes } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";

const zoomKeyframes = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(3); opacity: 0; }
`;

const pulseKeyframes = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(56, 161, 105, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56, 161, 105, 0); }
`;

const UserPage = ({ triggerCreatePostAnimation, blurActive, onCreatePostTutorialStart, onCreatePostTutorialEnd }) => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatePostAnimating, setIsCreatePostAnimating] = useState(false);
  const [showCreatePostTutorial, setShowCreatePostTutorial] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/user/${username}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
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

  useEffect(() => {
    if (triggerCreatePostAnimation) {
      setIsCreatePostAnimating(true);
      setTimeout(() => {
        setIsCreatePostAnimating(false);
        setShowCreatePostTutorial(true);
        onCreatePostTutorialStart(); // Turn blur back on
      }, 1500);
    }
  }, [triggerCreatePostAnimation, onCreatePostTutorialStart]);

  if (!user && loading) return <Flex justifyContent="center" alignItems="center" minH="100vh"><Spinner size="xl" /></Flex>;
  if (!user && !loading) return <Flex justifyContent="center" alignItems="center" minH="100vh"><Text fontSize="2xl" fontWeight="bold">User not found</Text></Flex>;

  return (
    <Box position="relative">
      <UserHeader user={user} />
      {error && (
        <Box p={4} bg="red.50" color="red.700" borderRadius="md" my={4}>
          <Text fontWeight="medium">Error loading posts: {error}</Text>
        </Box>
      )}
      {!fetchingPosts && posts.length === 0 && !error && (
        <Text fontSize="lg" textAlign="center" my={8}>User has no posts.</Text>
      )}
      {fetchingPosts && (
        <Flex justifyContent="center" my={12}><Spinner size="xl" /></Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      <CreatePost 
        triggerAnimation={isCreatePostAnimating} 
        animationStyle={isCreatePostAnimating ? { animation: `${pulseKeyframes} 1.5s infinite, ${zoomKeyframes} 1.5s forwards` } : {}}
        showTutorial={showCreatePostTutorial}
        blurActive={blurActive}
        onTutorialComplete={() => {
          setShowCreatePostTutorial(false);
          onCreatePostTutorialEnd(); // Turn blur off and end tutorial
        }}
      />
    </Box>
  );
};

export default UserPage;