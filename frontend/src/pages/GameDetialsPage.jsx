import { Box, Flex, Heading, Avatar, Text, Badge, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`/api/games/${gameId}`);
        setGame(res.data);
      } catch (err) {
        console.error("Error fetching game:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  return (
    <Box p={4}>
      {loading ? (
        <Skeleton height="400px" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Flex direction="column" gap={6}>
            {/* Header Section */}
            <Flex align="center" gap={4}>
              <Avatar src={game.teamA.logo} size="xl" />
              <Heading size="xl">vs</Heading>
              <Avatar src={game.teamB.logo} size="xl" />
            </Flex>

            {/* Game Status Badge */}
            <Badge 
              colorScheme={
                game.status === 'live' ? 'green' : 
                game.status === 'upcoming' ? 'orange' : 'gray'
              }
              width="fit-content"
              mx="auto"
              px={4}
              py={2}
              borderRadius="full"
            >
              {game.status.toUpperCase()}
            </Badge>

            {/* Detailed Game Info */}
            <SimpleGrid columns={[1, 2]} gap={8}>
              {/* Add detailed sections here */}
              <GameTeamDetails team={game.teamA} />
              <GameTeamDetails team={game.teamB} />
              <GameStatsSection game={game} />
              <GameTimeline game={game} />
            </SimpleGrid>
          </Flex>
        </motion.div>
      )}
    </Box>
  );
};

export default GameDetailsPage;