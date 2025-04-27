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
  <Box 
    p={4} 
    bg={useColorModeValue('#EDF2F7', '#0F0F0F')} 
    borderRadius="lg"
    boxShadow="sm"
    mb={3}
  >
    <Skeleton height="20px" width="60%" mb={2} />
    <Flex justify="space-between" align="center" my={3}>
      <SkeletonCircle size="10" />
      <Skeleton height="30px" width="80px" />
      <SkeletonCircle size="10" />
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
    bg={useColorModeValue('#EDF2F7', '#0F0F0F')}
    borderRadius="lg"
    boxShadow="sm"
  >
    <Text fontSize="xl" mb={4}>🏀 No games scheduled</Text>
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
    bg={useColorModeValue('#EDF2F7', '#0F0F0F')}
    borderRadius="lg"
    border="2px dashed" 
    borderColor="red.200"
  >
    <Text color="red.500">⚠️ Error loading games: {message}</Text>
  </Flex>
);

// Game Card Component
const GameCard = ({ game, onClick, isCompact }) => {
  const bgColor = useColorModeValue('#EDF2F7', '#0F0F0F');
  const textColor = useColorModeValue('#1A202C', '#E2E8F0');
  const { status } = game;
  const statusProps = getStatusProps(status);
  
  // Determine which team is winning
  const homeWinning = game.homeScore > game.awayScore;
  const awayWinning = game.awayScore > game.homeScore;
  const isTie = game.homeScore === game.awayScore;
  
  return (
    <Box 
      p={4} 
      bg={bgColor}
      color={textColor}
      borderRadius="lg" 
      boxShadow="sm"
      _hover={{ boxShadow: "md", cursor: "pointer" }}
      onClick={() => onClick(game)}
      mb={3}
      position="relative"
      overflow="hidden"
    >
      {/* Header with game status and time */}
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm">
          {status === "completed" ? "Final" : status === "live" ? "Live" : "Today"}
        </Text>
        <Badge colorScheme={statusProps.color} px={2} borderRadius="full">
          {status === "live" ? 
            `${game.currentPeriod} · ${game.timeRemaining}` : 
            new Date(game.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        </Badge>
      </Flex>
      
      {/* Teams and Score */}
      <Flex justify="space-between" align="center" my={3}>
        {/* Home Team */}
        <Flex align="center" direction="column" width="40%">
          <Image 
            src={game.homeTeam.logo} 
            boxSize={isCompact ? "40px" : "60px"} 
            borderRadius="full" 
            mb={2}
          />
          <Text 
            fontWeight={homeWinning ? "bold" : "normal"} 
            fontSize={isCompact ? "sm" : "md"}
            textAlign="center"
          >
            {isCompact ? formatTeamName(game.homeTeam.name, true) : game.homeTeam.name}
          </Text>
          <Text fontSize="xs" color="gray.500">({game.homeTeam.record || "0-0"})</Text>
        </Flex>
        
        {/* Score */}
        <Flex direction="column" align="center">
          <Text fontSize={isCompact ? "2xl" : "4xl"} fontWeight="bold">
            {game.homeScore} - {game.awayScore}
          </Text>
          {status === "live" && (
            <Badge colorScheme="red" mt={1}>LIVE</Badge>
          )}
        </Flex>
        
        {/* Away Team */}
        <Flex align="center" direction="column" width="40%">
          <Image 
            src={game.awayTeam.logo} 
            boxSize={isCompact ? "40px" : "60px"} 
            borderRadius="full" 
            mb={2}
          />
          <Text 
            fontWeight={awayWinning ? "bold" : "normal"}
            fontSize={isCompact ? "sm" : "md"}
            textAlign="center"
          >
            {isCompact ? formatTeamName(game.awayTeam.name, true) : game.awayTeam.name}
          </Text>
          <Text fontSize="xs" color="gray.500">({game.awayTeam.record || "0-0"})</Text>
        </Flex>
      </Flex>
      
      {/* Game series info, if applicable */}
      {game.seriesInfo && (
        <Text fontSize="sm" textAlign="center" mt={2} color="gray.500">
          {game.seriesInfo}
        </Text>
      )}
    </Box>
  );
};

// Game Modal Component
const GameModal = ({ game, isOpen, onClose, isMobile, navigate }) => {
  if (!isOpen) return null;
  
  const bgColor = useColorModeValue('#EDF2F7', '#0F0F0F');
  const textColor = useColorModeValue('#1A202C', '#E2E8F0');
  const statusProps = getStatusProps(game.status);
  
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
        bg={bgColor}
        color={textColor}
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
            bg="transparent"
          />
        </Flex>
        
        <Flex direction="column" align="center" mb={6}>
          <Flex width="100%" justify="center" mb={2}>
            <Text fontSize="sm">{game.status === "live" ? "Live" : game.status === "completed" ? "Final" : "Today"}</Text>
          </Flex>
          
          <Flex width="100%" justify="space-between" align="center">
            <Flex direction="column" align="center" width="40%">
              <Image src={game.homeTeam.logo} boxSize="80px" mb={2} />
              <Text fontWeight="bold" fontSize="lg">{game.homeTeam.name}</Text>
              <Text fontSize="sm" color="gray.500">({game.homeTeam.record || "0-0"})</Text>
            </Flex>
            
            <Flex direction="column" align="center">
              <Text fontSize="4xl" fontWeight="bold">
                {game.homeScore} - {game.awayScore}
              </Text>
              {game.status === "live" && (
                <Badge colorScheme="red" mt={1}>
                  {game.currentPeriod} · {game.timeRemaining}
                </Badge>
              )}
            </Flex>
            
            <Flex direction="column" align="center" width="40%">
              <Image src={game.awayTeam.logo} boxSize="80px" mb={2} />
              <Text fontWeight="bold" fontSize="lg">{game.awayTeam.name}</Text>
              <Text fontSize="sm" color="gray.500">({game.awayTeam.record || "0-0"})</Text>
            </Flex>
          </Flex>
          
          {game.seriesInfo && (
            <Text fontSize="md" fontWeight="medium" mt={4}>
              {game.seriesInfo}
            </Text>
          )}
        </Flex>
        
        {/* Game Details Section */}
        <Box bg={useColorModeValue('white', 'gray.800')} p={4} borderRadius="md" boxShadow="sm">
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
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
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

  // Add demo data for series info
  const addSeriesInfo = (game) => {
    if (game.status === "completed" || game.status === "live") {
      return {
        ...game,
        seriesInfo: `Playoffs Round 1 · Game ${Math.floor(Math.random() * 7) + 1} (Series tied 2-2)`
      };
    }
    return game;
  };

  // Example games with series info for demonstration
  const gamesWithSeriesInfo = games.map(addSeriesInfo);

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <Box
          position="fixed"
          right="4"
          top="20"
          w="350px"
          bg={useColorModeValue('#EDF2F7', '#0F0F0F')}
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
          ) : gamesWithSeriesInfo.length === 0 ? (
            <EmptyGames />
          ) : (
            <AnimatePresence>
              {gamesWithSeriesInfo.map((game) => (
                <MotionBox
                  key={game._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
          bg={useColorModeValue('#EDF2F7', '#0F0F0F')}
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
              <SimpleGrid columns={1} gap={2} px={2}>
                <GameSkeleton />
                <GameSkeleton />
              </SimpleGrid>
            ) : error ? (
              <ErrorState message={error} />
            ) : gamesWithSeriesInfo.length === 0 ? (
              <EmptyGames />
            ) : (
              <Box px={2}>
                {gamesWithSeriesInfo.slice(0,3).map((game) => (
                  <GameCard 
                    key={game._id}
                    game={game}
                    onClick={handleGameClick}
                    isCompact={true}
                  />
                ))}
              </Box>
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
    'BGE (Brookhouse Girls\' Enrichment?)': 'BGE',
    'LA Clippers': 'LAC',
    'Denver Nuggets': 'DEN',
  };
  
  return abbreviations[name] || name.substring(0, 3).toUpperCase();
};

// Utility function for status colors and labels
const getStatusProps = (status) => {
  switch (status) {
    case "live": return { color: "red", label: "Live" };
    case "upcoming": return { color: "orange", label: "Upcoming" };
    case "completed": return { color: "gray", label: "Final" };
    default: return { color: "gray", label: "Completed" };
  }
};

export default GameWidget;
