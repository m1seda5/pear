import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Flex, Text, Badge, Avatar, Stack, Button, SimpleGrid, useColorModeValue
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionModalContent = motion(ModalContent);

const GameModal = ({ game, onClose, isMobile, isAdmin, loading, SkeletonComponent }) => {
  const bgColor = useColorModeValue("#EDF2F7", "#0F0F0F");
  const textColor = useColorModeValue("#1A202C", "#E2E8F0");
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "live": return "green";
      case "upcoming": return "orange";
      default: return "gray";
    }
  };

  return (
    <Modal isOpen={!!game} onClose={onClose} size={isMobile ? "full" : "lg"}>
      <ModalOverlay />
      <AnimatePresence>
        {game && (
          <MotionModalContent
            bg={bgColor}
            color={textColor}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <SkeletonComponent />
            ) : (
              <>
                <ModalHeader>
                  <Flex align="center" gap={2}>
                    <Text>{game.teamA.name} vs {game.teamB.name}</Text>
                    <Badge colorScheme={getStatusColor(game.status)}>
                      {game.status.toUpperCase()}
                    </Badge>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton borderRadius="full" />
                <ModalBody pb={6}>
                  <Stack spacing={4}>
                    <SimpleGrid columns={2} spacing={4}>
                      <TeamSection team={game.teamA} />
                      <TeamSection team={game.teamB} />
                    </SimpleGrid>
                    <Stack>
                      <Text fontWeight="bold">Match Details</Text>
                      <Text>{game.description || "No description provided."}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(game.startTime).toLocaleString()} - 
                        {game.endTime && new Date(game.endTime).toLocaleString()}
                      </Text>
                    </Stack>
                    <Button 
                      colorScheme={game.status === "live" ? "green" : "orange"}
                      size="lg"
                      isDisabled={game.status !== "live"}
                    >
                      {game.status === "live" ? "Watch Live" : "Coming Soon"}
                    </Button>
                    <Button
                      mt={2}
                      colorScheme="blue"
                      onClick={() => {
                        navigate("/games");
                        onClose();
                      }}
                    >
                      Go to Game Page
                    </Button>
                    {isAdmin && (
                      <Flex gap={2}>
                        <Button variant="outline" colorScheme="red">
                          Delete Game
                        </Button>
                        <Button colorScheme="blue">
                          Edit Game
                        </Button>
                      </Flex>
                    )}
                  </Stack>
                </ModalBody>
              </>
            )}
          </MotionModalContent>
        )}
      </AnimatePresence>
    </Modal>
  );
};

const TeamSection = ({ team }) => (
  <Stack align="center">
    <Avatar src={team.logo} size="xl" />
    <Text fontWeight="bold">{team.name}</Text>
    <Stack spacing={1}>
      {team.players && team.players.length > 0 ? (
        team.players.map((player, index) => (
          <Flex key={index} align="center" gap={2}>
            <Avatar name={player} size="sm" />
            <Text>{player}</Text>
          </Flex>
        ))
      ) : (
        <Text fontSize="sm" color="gray.400">No players provided.</Text>
      )}
    </Stack>
  </Stack>
);

export default GameModal;