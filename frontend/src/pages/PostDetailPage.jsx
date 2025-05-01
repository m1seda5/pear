import { 
  Box, 
  Flex, 
  Text, 
  Avatar, 
  Icon, 
  useColorModeValue,
  HStack,
  VStack,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaEllipsisH, FaThumbsUp, FaLink } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const PostDetailPage = () => {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const toast = useToast();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        setPost(data);
        setLiked(data.likes.includes(currentUser?._id));
        setLikes(data.likes.length);
        setComments(data.comments);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    getPost();
  }, [postId, currentUser?._id, toast]);

  const handleLikeAndUnlike = async () => {
    try {
      const res = await fetch(`/api/posts/like/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        return;
      }
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (data.error) {
        return;
      }
      setComments([...comments, data]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Left Side - Image */}
      <Box flex="1" bg={bgColor} p={4} display="flex" alignItems="center" justifyContent="center">
        <Image
          src={post.img}
          alt="Post image"
          maxH="100%"
          maxW="100%"
          objectFit="contain"
        />
      </Box>

      {/* Right Side - Comments */}
      <Box flex="1" bg={bgColor} borderLeftWidth="1px" borderColor={borderColor}>
        {/* Post Header */}
        <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Avatar
              size="md"
              name={post.postedBy?.name}
              src={post.postedBy?.profilePic}
              onClick={() => navigate(`/${post.postedBy?.username}`)}
              cursor="pointer"
            />
            <VStack align="start" spacing={0}>
              <Text
                fontWeight="bold"
                onClick={() => navigate(`/${post.postedBy?.username}`)}
                cursor="pointer"
              >
                {post.postedBy?.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
            </VStack>
          </HStack>
          <Menu>
            <MenuButton>
              <Icon as={FaEllipsisH} />
            </MenuButton>
            <MenuList>
              <MenuItem>Report</MenuItem>
              {currentUser?._id === post.postedBy?._id && (
                <MenuItem color="red.500">Delete</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>

        {/* Post Content */}
        <Box p={4}>
          <Text mb={4}>{post.text}</Text>
          
          {/* Post Actions */}
          <HStack justify="space-between" color="gray.500" mb={4}>
            <HStack spacing={4}>
              <Button
                variant="ghost"
                leftIcon={liked ? <FaHeart color="red" /> : <FaRegHeart />}
                onClick={handleLikeAndUnlike}
              >
                {likes}
              </Button>
              <Button variant="ghost" leftIcon={<FaLink />}>
                Share
              </Button>
              <Button variant="ghost" leftIcon={<FaRegComment />}>
                {comments.length}
              </Button>
            </HStack>
          </HStack>

          {/* Comments Section */}
          <VStack align="stretch" spacing={4}>
            <HStack>
              <Avatar size="sm" src={currentUser?.profilePic} name={currentUser?.name} />
              <Input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleComment();
                  }
                }}
              />
            </HStack>

            <Divider />

            {/* Comments List */}
            <VStack align="stretch" spacing={4}>
              {comments.map((comment) => (
                <HStack key={comment._id} align="start" spacing={2}>
                  <Avatar size="sm" src={comment.postedBy.profilePic} name={comment.postedBy.name} />
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontWeight="bold">{comment.postedBy.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </Text>
                    </HStack>
                    <Text>{comment.text}</Text>
                    <HStack spacing={4}>
                      <Button variant="ghost" size="sm" leftIcon={<FaThumbsUp />}>
                        Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </HStack>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default PostDetailPage; 