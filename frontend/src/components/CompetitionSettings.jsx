import { Box, Button, Flex, useToast, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useCompetition } from "../context/CompetitionContext";

const CompetitionSettings = () => {
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const { isOpen: isEndOpen, onOpen: onEndOpen, onClose: onEndClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const { competitionActive, setCompetitionActive } = useCompetition();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetCompetition = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/competition/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to reset competition");
      
      toast({
        title: "Competition Reset",
        description: "All users have been reset to wood badge.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onResetClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCompetition = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/competition/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to end competition");
      
      setCompetitionActive(false);
      toast({
        title: "Competition Ended",
        description: "Competition has ended. All widgets have been hidden.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onEndClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Flex gap={4}>
        <Button
          colorScheme="red"
          onClick={onResetOpen}
          isLoading={isLoading}
        >
          Reset Competition
        </Button>
        <Button
          colorScheme="purple"
          onClick={onEndOpen}
          isLoading={isLoading}
        >
          End Competition
        </Button>
      </Flex>

      {/* Reset Competition Alert */}
      <AlertDialog
        isOpen={isResetOpen}
        leastDestructiveRef={cancelRef}
        onClose={onResetClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Competition
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to reset the competition? This will:
              - Reset all users to wood badge
              - Clear all points
              - Start the competition from scratch
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onResetClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleResetCompetition} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* End Competition Alert */}
      <AlertDialog
        isOpen={isEndOpen}
        leastDestructiveRef={cancelRef}
        onClose={onEndClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              End Competition
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to end the competition? This will:
              - Keep users' highest achieved badges
              - Hide all competition widgets
              - Stop point tracking
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onEndClose}>
                Cancel
              </Button>
              <Button colorScheme="purple" onClick={handleEndCompetition} ml={3}>
                End Competition
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CompetitionSettings; 