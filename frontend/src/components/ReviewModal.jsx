import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  useColorModeValue,
  Image,
  VStack,
  Divider,
  Badge,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  const checkForPendingReviews = async () => {
    if (isFetching) return; // Prevent multiple simultaneous requests
    
    setIsFetching(true);
    try {
      console.log("Checking for pending reviews...");
      const res = await fetch("/api/posts/pending-reviews", {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include' // Important for authentication
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Pending reviews response:", data);

      if (data.length > 0 && !isOpen) {
        console.log("Found pending review, opening modal");
        setCurrentReview(data[0]);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error checking reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending reviews",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkForPendingReviews();

    // Set up polling interval
    const interval = setInterval(checkForPendingReviews, 30000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const handleReview = async (decision) => {
    if (!currentReview?._id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/review/${currentReview._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ decision })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      toast({
        title: "Success",
        description: `Post ${decision === 'approved' ? 'approved' : 'rejected'} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setCurrentReview(null);
      
      // Check for more pending reviews
      setTimeout(checkForPendingReviews, 1000);
    } catch (error) {
      console.error("Error submitting review:", error);
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

  if (!currentReview) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Review Post</ModalHeader>
        <ModalBody>
          {isFetching ? (
            <VStack spacing={4}>
              <Spinner />
              <Text>Loading review...</Text>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Posted by: {currentReview.postedBy?.username || 'Unknown'}
                </Text>
                <Badge colorScheme="blue">Student Post</Badge>
              </Box>
              
              <Text>{currentReview.text}</Text>
              
              {currentReview.img && (
                <Image src={currentReview.img} alt="Post content" borderRadius="md" />
              )}
              
              <Divider />
              
              <Text fontSize="sm" color="gray.500">
                As a {user.role}, your review decision will help determine if this post should be published.
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            isLoading={isLoading}
            onClick={() => handleReview('rejected')}
          >
            Reject
          </Button>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={() => handleReview('approved')}
          >
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;