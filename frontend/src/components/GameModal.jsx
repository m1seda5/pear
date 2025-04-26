import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Flex, Image, Text, Badge, Avatar, Stack, Button, SimpleGrid, useColorModeValue
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

const MotionModalContent = motion(ModalContent);

const GameModal = ({ game, onClose, isMobile, isAdmin, loading, SkeletonComponent }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

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
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Stack spacing={4}>
                    <SimpleGrid columns={2} spacing={4}>
                      <TeamSection team={game.teamA} />
                      <TeamSection team={game.teamB} />
                    </SimpleGrid>

                    <Stack>
                      <Text fontWeight="bold">Match Details</Text>
                      <Text>{game.description}</Text>
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
      {team.players.map((player, index) => (
        <Flex key={index} align="center" gap={2}>
          <Avatar name={player} size="sm" />
          <Text>{player}</Text>
        </Flex>
      ))}
    </Stack>
  </Stack>
);

export default GameModal;