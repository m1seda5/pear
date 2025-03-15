import { useState } from "react";
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
  Icon
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { BsShieldLockFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import ReviewerGroups from "../components/ReviewerGroups";
import ReviewQueue from "../components/ReviewQueue";

const AdminDashboard = () => {
  const user = useRecoilValue(userAtom);
  const [activeTab, setActiveTab] = useState(0);
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
        </TabList>

        <TabPanels 
          borderWidth="1px" 
          borderTop="none"
          borderColor={borderColor}
          borderBottomRadius="md"
        >
          <TabPanel p={0}>
            <ReviewerGroups />
          </TabPanel>
          <TabPanel p={0}>
            <ReviewQueue />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;