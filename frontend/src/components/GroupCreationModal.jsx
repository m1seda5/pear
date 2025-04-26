import { useState, useEffect } from "react";
import { 
  Box, Flex, Image, Text, Badge, IconButton, 
  Drawer, DrawerOverlay, DrawerContent, useDisclosure, 
  useMediaQuery, Button, Avatar, Tag, Stack, useColorModeValue 
} from "@chakra-ui/react";
import { CloseIcon, ChevronUpIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GameModal from "./GameModal";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const GameWidget = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

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
    const interval = setInterval(fetchGames, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusProps = (status) => {
    switch (status) {
      case "live": return { color: "green.500", label: "Live" };
      case "upcoming": return { color: "orange.500", label: "Upcoming" };
      default: return { color: "gray.500", label: "Completed" };
    }
  };

  const GameCard = ({ game, onClick, isMobile }) => {
    const status = getStatusProps(game.status);
    const isAdmin = user?.role === "admin";
    const isPast = game.status === "past";
    
    return (
      <Box
        p={4}
        mb={4}
        borderRadius="lg"
        borderWidth="1px"
        cursor="pointer"
        _hover={{ bg: hoverBg }}
        onClick={() => onClick(game)}
        position="relative"
      >
        {isAdmin && (
          <IconButton
            aria-label="Delete game"
            icon={<CloseIcon />}
            size="sm"
            position="absolute"
            top={2}
            right={2}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteGame(game._id);
            }}
          />
        )}
        <Flex justify="space-between" align="center" mb={2}>
          <Flex align="center" gap={2}>
            <Avatar src={game.teamA.logo} name={game.teamA.name} size="sm" />
            <Text fontWeight="bold">{game.teamA.name}</Text>
          </Flex>
          <Text fontSize="xl" fontWeight="bold">
            {game.status === "live" ? `${game.scoreA || 0} - ${game.scoreB || 0}` : "VS"}
          </Text>
          <Flex align="center" gap={2}>
            <Text fontWeight="bold">{game.teamB.name}</Text>
            <Avatar src={game.teamB.logo} name={game.teamB.name} size="sm" />
          </Flex>
        </Flex>
        <Flex justify="space-between" align="center">
          <Badge colorScheme={status.color.replace(".500", "")}>{status.label}</Badge>
          <Text fontSize="sm">
            {game.status === "past" 
              ? new Date(game.endTime).toLocaleDateString()
              : new Date(game.startTime).toLocaleTimeString()}
          </Text>
        </Flex>
      </Box>
    );
  };

  return (
    <>
      {/* Desktop/Tablet View */}
      {!isMobile && (
        <Box
          position="fixed"
          right="4"
          top="20"
          w="300px"
          bg={bgColor}
          borderRadius="lg"
          boxShadow="xl"
          p="4"
          zIndex="docked"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold">Live Scores</Text>
            {user?.role === "admin" && (
              <IconButton
                icon={<AddIcon />}
                size="sm"
                onClick={() => navigate("/create-game")}
              />
            )}
          </Flex>
          {games.map((game) => (
            <GameCard key={game._id} game={game} onClick={handleGameClick} />
          ))}
        </Box>
      )}

      {/* Mobile Floating Button & Bottom Sheet */}
      {isMobile && (
        <>
          <Box
            position="fixed"
            bottom="4"
            right="4"
            zIndex="overlay"
          >
            <Button
              colorScheme="green"
              borderRadius="full"
              boxShadow="lg"
              onClick={onOpen}
              leftIcon={<ChevronUpIcon />}
            >
              Game Scores
            </Button>
          </Box>

          <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius="lg" maxH="85vh">
              <Flex justify="space-between" align="center" p={4}>
                <Text fontWeight="bold">Live Scores</Text>
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={onClose}
                />
              </Flex>
              <Box overflowY="auto" px={4}>
                {games.map((game) => (
                  <GameCard key={game._id} game={game} isMobile onClick={handleGameClick} />
                ))}
              </Box>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {selectedGame && (
        <GameModal 
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          isMobile={isMobile}
          isAdmin={user?.role === "admin"}
        />
      )}
    </>
  );
};