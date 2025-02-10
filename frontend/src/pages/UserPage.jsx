import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import CreatePost from "../components/CreatePost";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleProfileTap = async () => {
    // Only proceed if current user is an admin
    if (currentUser?.role !== "admin") return;

    const now = Date.now();
    if (now - lastTapTime > 500) { // Reset if more than 500ms between taps
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    setLastTapTime(now);

    // If triple tap detected
    if (tapCount === 2) { // Will become 3 with this tap
      try {
        const res = await fetch("/api/users/award-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        });

        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        showToast(
          "Success", 
          data.user.isVerified ? "User verified" : "User verification removed", 
          "success"
        );
        
        // Update local user state with new verification status
        user.isVerified = data.user.isVerified;
        
      } catch (error) {
        showToast("Error", error.message, "error");
      }
      setTapCount(0); // Reset tap count
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} onProfileTap={handleProfileTap} />
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
      <CreatePost />
    </>
  );
};

export default UserPage;




