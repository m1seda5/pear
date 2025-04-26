import { 
  Box, Flex, Tab, Tabs, TabList, TabPanel, TabPanels, 
  SimpleGrid, Text, Badge, IconButton, Button, useMediaQuery 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import GameCard from "../components/GameCard";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const MotionBox = motion(Box);

const GamePage = () => {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const getGamesByStatus = (status) => 
    games.filter(game => game.status === status);

  const statusTabs = [
    { label: "Live Games", status: "live", color: "green" },
    { label: "Upcoming", status: "upcoming", color: "orange" },
    { label: "Past Games", status: "past", color: "gray" }
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("/api/games");
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  const handleEditGame = (game) => {
    navigate(`/edit-game/${game._id}`);
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get('/api/games/export');
      const csvContent = res.data;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game-stats.csv';
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Box p={isMobile ? 2 : 4}>
      <Flex align="center" mb={6} gap={2} justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Game Center
        </Text>
        <Flex>
          {user?.role === "admin" && (
            <IconButton
              icon={<AddIcon />}
              aria-label="Create Game"
              colorScheme="green"
              size="sm"
              onClick={() => navigate("/create-game")}
            />
          )}
          <Button onClick={handleExportCSV} ml={2} colorScheme="blue" size="sm">
            Export CSV
          </Button>
        </Flex>
      </Flex>

      <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)}>
        <TabList mb={4}>
          {statusTabs.map((tab, idx) => (
            <Tab key={idx} _selected={{ color: `${tab.color}.500`, borderColor: `${tab.color}.500` }}>
              <Badge colorScheme={tab.color}>{tab.label}</Badge>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {statusTabs.map((tab, idx) => (
            <TabPanel key={idx}>
              <SimpleGrid columns={isMobile ? 1 : 2} spacing={4}>
                {getGamesByStatus(tab.status).map(game => (
                  <MotionBox
                    key={game._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GameCard 
                      game={game} 
                      isAdmin={user?.role === "admin"}
                      onEdit={() => handleEditGame(game)}
                      isDetailedView
                    />
                  </MotionBox>
                ))}
              </SimpleGrid>
              {!getGamesByStatus(tab.status).length && (
                <Text textAlign="center" color="gray.500" py={8}>
                  No {tab.label.toLowerCase()} found
                </Text>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GamePage;