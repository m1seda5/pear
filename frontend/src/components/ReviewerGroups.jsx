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
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Checkbox,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";

const ReviewerGroups = () => {
  const user = useRecoilValue(userAtom);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    permissions: { postReview: false }
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null); // Added new state
  const bgColor = useColorModeValue("white", "gray.800");
  const { get, post } = useFetch();

  useEffect(() => {
    const loadGroups = async () => {
      const data = await get("/api/reviewer-groups");
      if (data) setGroups(data);
    };
    if (user?.role === "admin") loadGroups();
  }, [user]);

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(`/api/users/search/${query}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const res = await fetch("/api/reviewer-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroup.name,
          permissions: newGroup.permissions,
          members: selectedMembers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGroups([...groups, data]);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error("Create group error:", error);
    }
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" mb={6}>
        <Heading size="lg">Reviewer Groups</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={() => setIsCreateModalOpen(true)}>
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
                <Flex 
                  key={member._id} 
                  align="center" 
                  mb={2}
                  cursor="pointer"
                  onClick={() => setSelectedReviewer(member._id)}
                  _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  p={2}
                  borderRadius="md"
                >
                  <Avatar size="sm" name={member.username} src={member.profilePic} mr={2} />
                  <Text>{member.username}</Text>
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

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Group Name</FormLabel>
              <Input value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Permissions</FormLabel>
              <Checkbox isChecked={newGroup.permissions.postReview} onChange={(e) => setNewGroup({...newGroup, permissions: {...newGroup.permissions, postReview: e.target.checked}})}>
                Can Review Posts
              </Checkbox>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Add Members</FormLabel>
              <InputGroup>
                <InputLeftElement><SearchIcon /></InputLeftElement>
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value); }} />
              </InputGroup>
              <Menu>
                <MenuList maxH="200px" overflowY="auto">
                  {searchResults.map((user) => (
                    <MenuItem key={user._id} onClick={() => setSelectedMembers([...selectedMembers, user._id])}>
                      {user.username}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            <Text>Selected Members: {selectedMembers.length}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedReviewer && (
        <AuditDetails 
          userId={selectedReviewer}
          onClose={() => setSelectedReviewer(null)}
        />
      )}
    </Box>
  );
};

export default ReviewerGroups;
