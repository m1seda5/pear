import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Badge,
  Spinner
} from "@chakra-ui/react";
import useFetch from "../hooks/useFetch";

const AuditDetails = ({ userId }) => {
  const [decisions, setDecisions] = useState([]);
  const { get, loading } = useFetch();

  useEffect(() => {
    const loadData = async () => {
      const data = await get(`/api/reviewer-groups/reviewer/${userId}/decisions`);
      setDecisions(data);
    };
    if (userId) loadData();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <Box mt={4}>
      <Text fontSize="xl" mb={4}>Review Decisions</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Post Content</Th>
            <Th>Author</Th>
            <Th>Decision</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {decisions.map(post => (
            <Tr key={post._id}>
              <Td maxW="200px" isTruncated>{post.text}</Td>
              <Td>
                <Avatar 
                  size="sm" 
                  name={post.postedBy.username} 
                  src={post.postedBy.profilePic} 
                  mr={2} 
                />
                {post.postedBy.username}
              </Td>
              <Td>
                <Badge 
                  colorScheme={post.reviewStatus === 'approved' ? 'green' : 'red'}
                >
                  {post.reviewStatus}
                </Badge>
              </Td>
              <Td>
                {new Date(post.reviewedBy[0].decisionDate).toLocaleString()}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AuditDetails;