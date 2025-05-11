import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  Text,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { BsShieldLockFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";
import ReviewQueue from"../components/ReviewQueue";


// Modified ReviewerGroups to accept onGroupSelect prop
const ReviewerGroups = ({ onGroupSelect }) => {
  const { get } = useFetch();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      const data = await get("/api/reviewer-groups");
      if (data) setGroups(data);
    };
    loadGroups();
  }, [get]);

  return (
    <Box>
      {groups.map((group) => (
        <Box 
          key={group._id} 
          p={2} 
          cursor="pointer" 
          onClick={() => onGroupSelect(group._id)}
          _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
        >
          <Text>{group.name}</Text>
        </Box>
      ))}
    </Box>
  );
};

const GroupStatistics = ({ groupId }) => {
  const { get } = useFetch();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      if (!groupId) {
        setStats([]);
        return;
      }
      const data = await get(`/api/reviewer-groups/${groupId}/stats`);
      setStats(data || []);
    };
    loadStats();
  }, [groupId, get]);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Reviewer</Th>
          <Th>Total</Th>
          <Th>Approved</Th>
          <Th>Rejected</Th>
          <Th>Last Activity</Th>
        </Tr>
      </Thead>
      <Tbody>
        {stats.length > 0 ? (
          stats.map(reviewer => (
            <Tr key={reviewer._id}>
              <Td>
                <Flex align="center">
                  <Avatar size="sm" name={reviewer.username} src={reviewer.profilePic} mr={2} />
                  {reviewer.username}
                </Flex>
              </Td>
              <Td>{reviewer.totalDecisions || 0}</Td>
              <Td>{reviewer.approvals || 0}</Td>
              <Td>{reviewer.rejections || 0}</Td>
              <Td>
                {reviewer.lastDecision ? 
                  new Date(reviewer.lastDecision).toLocaleDateString() : 
                  'N/A'}
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5} textAlign="center">
              {groupId ? "No statistics available" : "Select a group to view statistics"}
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

const AdminDashboard = () => {
  const user = useRecoilValue(userAtom);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const tabBgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // If user is not admin, redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <Box 
      w="full" 
      p={4} 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="sm"
      maxW={{ base: "100%", md: "800px", lg: "1000px" }}
      mx="auto"
    >
      <Flex align="center" mb={6} gap={3}>
        <Icon as={BsShieldLockFill} boxSize={6} color="teal.500" />
        <Heading size="lg">Admin Dashboard</Heading>
      </Flex>

      <Text mb={6} color={useColorModeValue("gray.600", "gray.400")}>
        Manage reviewer groups and review pending content
      </Text>

      <Tabs 
        variant="enclosed" 
        colorScheme="teal" 
        onChange={(index) => setActiveTab(index)}
        mb={4}
      >
        <TabList>
          <Tab 
            bg={activeTab === 0 ? bgColor : tabBgColor}
            borderTopRadius="md"
            borderColor={borderColor}
            _selected={{ borderColor: borderColor, borderBottomColor: bgColor }}
          >
            Reviewer Groups
          </Tab>
          <Tab 
            bg={activeTab === 1 ? bgColor : tabBgColor}
            borderTopRadius="md"
            borderColor={borderColor}
            _selected={{ borderColor: borderColor, borderBottomColor: bgColor }}
          >
            Review Queue
          </Tab>
          <Tab 
            bg={activeTab === 2 ? bgColor : tabBgColor}
            borderTopRadius="md"
            borderColor={borderColor}
            _selected={{ borderColor: borderColor, borderBottomColor: bgColor }}
          >
            Group Statistics
          </Tab>
        </TabList>

        <TabPanels 
          borderWidth="1px" 
          borderTop="none"
          borderColor={borderColor}
          borderBottomRadius="md"
        >
          <TabPanel p={0}>
            <ReviewerGroups onGroupSelect={setSelectedGroupId} />
          </TabPanel>
          <TabPanel p={0}>
            <ReviewQueue />
          </TabPanel>
          <TabPanel p={0}>
            <GroupStatistics groupId={selectedGroupId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;