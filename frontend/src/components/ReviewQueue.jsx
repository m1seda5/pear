import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Badge,
  Button,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";

const ReviewQueue = () => {
  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useState([]);
  const bgColor = useColorModeValue("white", "gray.800");
  const { get, loading } = useFetch();

  useEffect(() => {
    const loadPosts = async () => {
      const data = await get("/api/posts/pending-reviews");
      if (data) setPosts(data);
    };
    if (user?.reviewerGroups?.length > 0) loadPosts();
  }, [user]);

  return (
    <Box p={4} bg={bgColor} borderRadius="lg">
      <Heading size="lg" mb={6}>Pending Reviews</Heading>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Author</Th>
            <Th>Content Preview</Th>
            <Th>Submitted</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((post) => (
            <Tr key={post._id}>
              <Td>{post.postedBy.username}</Td>
              <Td>
                <Text noOfLines={1}>{post.text}</Text>
                {post.img && <Badge ml={2}>Image</Badge>}
              </Td>
              <Td>
                {new Date(post.createdAt).toLocaleDateString()}
              </Td>
              <Td>
                <Button size="sm" colorScheme="green" mr={2}>
                  Approve
                </Button>
                <Button size="sm" colorScheme="red">
                  Reject
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ReviewQueue;