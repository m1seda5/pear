import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    Badge,
    VStack,
    HStack,
    Spinner,
    useToast,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";

const GameDetailsPage = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const toast = useToast();
    const { t } = useTranslation();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await fetch(`/api/games/${gameId}`);
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setGame(data);
            } catch (error) {
                toast({
                    title: t("Error"),
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGame();

        // Initialize socket connection
        const newSocket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [gameId, toast, t]);

    useEffect(() => {
        if (!socket) return;

        socket.on("gameUpdate", (updatedGame) => {
            if (updatedGame._id === gameId) {
                setGame(updatedGame);
            }
        });

        return () => {
            socket.off("gameUpdate");
        };
    }, [socket, gameId]);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!game) {
        return (
            <Box p={4}>
                <Text>{t("Game not found")}</Text>
            </Box>
        );
    }

    return (
        <Box p={4} maxW="1200px" mx="auto">
            <VStack spacing={6} align="stretch">
                <Heading size="xl">{game.category}</Heading>
                
                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={6}
                    p={6}
                    bg={bgColor}
                    borderRadius="lg"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    {/* Team A */}
                    <VStack flex={1} spacing={4}>
                        <Image
                            src={game.teamA.logo || "/default-team-logo.png"}
                            alt={game.teamA.name}
                            boxSize="100px"
                            objectFit="contain"
                        />
                        <Heading size="lg">{game.teamA.name}</Heading>
                        <Text fontSize="4xl" fontWeight="bold">
                            {game.teamA.score || 0}
                        </Text>
                    </VStack>

                    {/* Game Status */}
                    <VStack justify="center" spacing={2}>
                        <Badge
                            colorScheme={
                                game.status === "live"
                                    ? "green"
                                    : game.status === "upcoming"
                                    ? "blue"
                                    : "gray"
                            }
                            fontSize="lg"
                            p={2}
                        >
                            {game.status}
                        </Badge>
                        <Text fontSize="xl">VS</Text>
                        <Text>{new Date(game.startTime).toLocaleString()}</Text>
                    </VStack>

                    {/* Team B */}
                    <VStack flex={1} spacing={4}>
                        <Image
                            src={game.teamB.logo || "/default-team-logo.png"}
                            alt={game.teamB.name}
                            boxSize="100px"
                            objectFit="contain"
                        />
                        <Heading size="lg">{game.teamB.name}</Heading>
                        <Text fontSize="4xl" fontWeight="bold">
                            {game.teamB.score || 0}
                        </Text>
                    </VStack>
                </Flex>

                {/* Game Details */}
                <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
                    <Heading size="md" mb={4}>
                        {t("Game Details")}
                    </Heading>
                    <Text>{game.description}</Text>
                </Box>

                {/* Players */}
                <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
                    <Heading size="md" mb={4}>
                        {t("Players")}
                    </Heading>
                    <HStack spacing={8} justify="space-around">
                        <VStack align="start">
                            <Text fontWeight="bold">{game.teamA.name}</Text>
                            {game.teamA.players.map((player, index) => (
                                <Text key={index}>{player}</Text>
                            ))}
                        </VStack>
                        <VStack align="start">
                            <Text fontWeight="bold">{game.teamB.name}</Text>
                            {game.teamB.players.map((player, index) => (
                                <Text key={index}>{player}</Text>
                            ))}
                        </VStack>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default GameDetailsPage; 