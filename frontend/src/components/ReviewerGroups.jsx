// components/ReviewerGroups.jsx
import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Input,
  Avatar,
  Badge,
  useColorModeValue,
  Flex
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";

const ReviewerGroups = () => {
  const user = useRecoilValue(userAtom);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const bgColor = useColorModeValue("white", "gray.800");
  const { get, post, loading } = useFetch();

  useEffect(() => {
    const loadGroups = async () => {
      const data = await get("/api/reviewer-groups");
      if (data) setGroups(data);
    };
    if (user?.role === "admin") loadGroups();
  }, [user]);

  return (
    <Box p={4}>
      <Flex justify="space-between" mb={6}>
        <Heading size="lg">Reviewer Groups</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal">
          New Group
        </Button>
      </Flex>

      <Input
        placeholder="Search groups..."
        mb={6}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftElement={<SearchIcon color="gray.300" />}
      />

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {groups.map((group) => (
          <Card key={group._id} bg={bgColor}>
            <CardHeader>
              <Heading size="md">{group.name}</Heading>
              <Badge colorScheme="teal" mt={2}>
                {group.permissions.postReview ? "Can Review Posts" : "No Permissions"}
              </Badge>
            </CardHeader>
            <CardBody>
              <Text fontWeight="bold" mb={2}>Members:</Text>
              {group.members.map((member) => (
                <Flex key={member._id} align="center" mb={2}>
                  <Avatar
                    size="sm"
                    name={member.username}
                    src={member.profilePic}
                    mr={2}
                  />
                  <Text>{member.username}</Text>
                  <Box ml="auto">
                    <Box
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={Date.now() - new Date(member.lastActive).getTime() < 300000
                        ? "green.500"
                        : "gray.500"}
                    />
                  </Box>
                </Flex>
              ))}
            </CardBody>
            <CardFooter>
              <Button size="sm" mr={2}>Edit</Button>
              <Button size="sm" colorScheme="red">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ReviewerGroups;