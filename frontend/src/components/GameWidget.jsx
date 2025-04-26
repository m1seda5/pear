import { useState, useEffect } from "react";
import { 
  Box, Flex, Image, Text, Badge, IconButton, 
  Collapse, SimpleGrid, useDisclosure, 
  useMediaQuery, Skeleton, SkeletonCircle, useColorModeValue 
} from "@chakra-ui/react";
import { CloseIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

const MotionBox = motion(Box);

// Skeleton Component
const GameSkeleton = () => (
  <Box p={4} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
    <Skeleton height="20px" width="60%" mb={2} />
    <Flex justify="space-between">
      <SkeletonCircle size="8" />
      <Skeleton height="20px" width="20%" />
      <SkeletonCircle size="8" />
    </Flex>
    <Skeleton height="15px" mt={2} width="80%" />
  </Box>
);

// Empty State Component
const EmptyGames = () => (
  <Flex 
    direction="column" 
    align="center" 
    justify="center" 
    height="200px"
    bg={useColorModeValue('gray.50', 'gray.800')}
    borderRadius="lg"
  >
    <Text fontSize="xl" mb={4}>🎮 No games scheduled</Text>
    <Text color="gray.500">Check back later for upcoming matches!</Text>
  </Flex>
);

// Error Handling Component
const ErrorState = ({ message }) => (
  <Flex 
    direction="column" 
    align="center" 
    justify="center" 
    height="200px"
    bg={useColorModeValue('gray.50', 'gray.800')}
    borderRadius="lg"
    border="2px dashed" 
    borderColor="red.200"
  >
    <Text color="red.500">⚠️ Error loading games: {message}</Text>
  </Flex>
);

// Game Card Component
const GameCard = ({ game, onClick, isCompact }) => {
  const { status } = game;
  const statusProps = getStatusProps(status);
  
  return (
    <Box 
      p={3} 
      bg={useColorModeValue('white', 'gray.700')} 
      borderRadius="md" 
      boxShadow="sm"
      borderWidth="1px"
      _hover={{ boxShadow: "md", cursor: "pointer" }}
      onClick={() => onClick(game)}
      mb={2}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Badge colorScheme={statusProps.color} variant="subtle" px={2}>
          {statusProps.label}
        </Badge>
        <Text fontSize="sm" color="gray.500">
          {new Date(game.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Flex>
      
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={2}>
          <Image src={game.homeTeam.logo} boxSize="30px" borderRadius="full" />
          <Text fontWeight={game.homeScore > game.awayScore ? "bold" : "normal"}>
            {formatTeamName(game.homeTeam.name, isCompact)}
          </Text>
        </Flex>
        
        <Text fontWeight="bold">
          {game.homeScore} - {game.awayScore}
        </Text>
        
        <Flex align="center" gap={2}>
          <Text fontWeight={game.awayScore > game.homeScore ? "bold" : "normal"}>
            {formatTeamName(game.awayTeam.name, isCompact)}
          </Text>
          <Image src={game.awayTeam.logo} boxSize="30px" borderRadius="full" />
        </Flex>
      </Flex>
      
      {game.status === "live" && (
        <Text fontSize="sm" color="gray.500" mt={1}>
          {game.currentPeriod} · {game.timeRemaining}
        </Text>
      )}
    </Box>
  );
};

// Game Modal Component
const GameModal = ({ game, isOpen, onClose, isMobile, navigate }) => {
  if (!isOpen) return null;
  
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0,0,0,0.7)"
      zIndex="modal"
      onClick={onClose}
    >
      <MotionBox
        position="relative"
        width={isMobile ? "95%" : "600px"}
        maxHeight="80vh"
        margin="10vh auto"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="lg"
        p={4}
        overflow="auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Flex justify="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Game Details</Text>
          <IconButton 
            icon={<CloseIcon />} 
            size="sm" 
            onClick={onClose} 
            aria-label="Close modal"
          />
        </Flex>
        
        <Flex direction="column" align="center" mb={6}>
          <Badge 
            colorScheme={getStatusProps(game.status).color} 
            fontSize="md" 
            py={1} 
            px={3} 
            borderRadius="full"
            mb={3}
          >
            {getStatusProps(game.status).label}
          </Badge>
          
          <Flex width="100%" justify="space-between" align="center">
            <Flex direction="column" align="center" width="40%">
              <Image src={game.homeTeam.logo} boxSize="80px" mb={2} />
              <Text fontWeight="bold" fontSize="lg">{game.homeTeam.name}</Text>
              <Text fontSize="sm" color="gray.500">{game.homeTeam.record}</Text>
            </Flex>
            
            <Flex direction="column" align="center">
              <Text fontSize="3xl" fontWeight="bold">
                {game.homeScore} - {game.awayScore}
              </Text>
              {game.status === "live" && (
                <Text color="red.500" fontWeight="semibold">
                  {game.currentPeriod} · {game.timeRemaining}
                </Text>
              )}
            </Flex>
            
            <Flex direction="column" align="center" width="40%">
              <Image src={game.awayTeam.logo} boxSize="80px" mb={2} />
              <Text fontWeight="bold" fontSize="lg">{game.awayTeam.name}</Text>
              <Text fontSize="sm" color="gray.500">{game.awayTeam.record}</Text>
            </Flex>
          </Flex>
        </Flex>
        
        {/* Game Details Section */}
        <Box bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="md">
          <Text fontWeight="semibold" mb={2}>Game Information</Text>
          <SimpleGrid columns={2} spacing={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">Date & Time</Text>
              <Text>{new Date(game.scheduledTime).toLocaleString()}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Venue</Text>
              <Text>{game.venue}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Broadcast</Text>
              <Text>{game.broadcast || "Not available"}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Attendance</Text>
              <Text>{game.attendance || "TBD"}</Text>
            </Box>
          </SimpleGrid>
        </Box>
        
        <Flex justify="center" mt={4}>
          <IconButton
            colorScheme="blue"
            onClick={() => {
              navigate(`/games/${game._id}`);
              onClose();
            }}
            icon={<ChevronUpIcon />}
            aria-label="View full details"
          />
        </Flex>
      </MotionBox>
    </Box>
  );
};

const GameWidget = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onToggle } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  // Fetch initial games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/games");
        setGames(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Set up Socket.IO listeners with environment variable
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL, {
      withCredentials: true,
      autoConnect: true
    });

    socket.on('gameAdded', handleGameUpdate);
    socket.on('gameModified', handleGameUpdate);
    socket.on('gameRemoved', handleGameRemove);
    
    // Add real-time score updates
    socket.on('scoreUpdate', (updatedGame) => {
      setGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g));
    });

    socket.on('gameUpdated', (updatedGame) => {
      setGames(prev => prev.map(g => 
        g._id === updatedGame._id ? updatedGame : g
      ));
    });

    return () => {
      socket.off('gameAdded', handleGameUpdate);
      socket.off('gameModified', handleGameUpdate);
      socket.off('gameRemoved', handleGameRemove);
      socket.off('scoreUpdate');
      socket.disconnect();
    };
  }, []);

  const handleGameUpdate = (updatedGame) => {
    setGames(prev => {
      const existing = prev.find(g => g._id === updatedGame._id);
      return existing 
        ? prev.map(g => g._id === updatedGame._id ? updatedGame : g)
        : [updatedGame, ...prev];
    });
  };

  const handleGameRemove = (removedGameId) => {
    setGames(prev => prev.filter(g => g._id !== removedGameId));
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const getStatusProps = (status) => {
    switch (status) {
      case "live": return { color: "green", label: "Live" };
      case "upcoming": return { color: "orange", label: "Upcoming" };
      default: return { color: "gray", label: "Completed" };
    }
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <Box
          position="fixed"
          right="4"
          top="20"
          w="300px"
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="lg"
          p="4"
          zIndex="docked"
        >
          <Text fontSize="xl" fontWeight="bold" mb="4">Live Scores</Text>
          {loading ? (
            <>
              <GameSkeleton />
              <GameSkeleton />
            </>
          ) : error ? (
            <ErrorState message={error} />
          ) : games.length === 0 ? (
            <EmptyGames />
          ) : (
            <AnimatePresence>
              {games.map((game) => (
                <MotionBox
                  key={game._id}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCard 
                    game={game} 
                    onClick={handleGameClick}
                    isCompact={false}
                  />
                </MotionBox>
              ))}
            </AnimatePresence>
          )}
        </Box>
      )}

      {/* Mobile Sticky Header + Collapse */}
      {isMobile && (
        <Box
          position="sticky"
          top="0"
          zIndex="sticky"
          bg={useColorModeValue('white', 'gray.800')}
          pb={2}
          borderBottomWidth="1px"
        >
          <Flex justify="space-between" align="center" p={2}>
            <Text fontSize="lg" fontWeight="bold">Live Scores</Text>
            <IconButton
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggle}
              variant="ghost"
              aria-label="Toggle scores"
            />
          </Flex>
          
          <Collapse in={isOpen}>
            {loading ? (
              <SimpleGrid columns={2} gap={2} px={2}>
                <GameSkeleton />
                <GameSkeleton />
              </SimpleGrid>
            ) : error ? (
              <ErrorState message={error} />
            ) : games.length === 0 ? (
              <EmptyGames />
            ) : (
              <SimpleGrid columns={2} gap={2} px={2}>
                {games.slice(0,2).map((game) => (
                  <GameCard 
                    key={game._id}
                    game={game}
                    onClick={handleGameClick}
                    isCompact={true}
                  />
                ))}
              </SimpleGrid>
            )}
          </Collapse>
        </Box>
      )}

      {/* Game Modal */}
      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          isMobile={isMobile}
          navigate={navigate}
        />
      )}
    </>
  );
};

// Utility function for formatting team names
const formatTeamName = (name, isCompact) => {
  if (!isCompact) return name;
  const abbreviations = {
    'Brookhouse International School': 'BIS',
    'Runda Campus': 'RND',
    'Karen Campus': 'KRN',
    'Hillcrest International School': 'HIL',
    'Peponi School': 'PPI',
    'Rosslyn Academy': 'ROS',
    'Nairobi Academy': 'NAC',
    'Crawford International School': 'CRW',
    'Light Academy': 'LGT',
    'St. Christophers School': 'STC',
    'BGE (Brookhouse Girls’ Enrichment?)': 'BGE',
  };
  
  return abbreviations[name] || name.substring(0, 3).toUpperCase();
};

export default GameWidget;
