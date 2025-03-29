import { useEffect, useState } from "react";
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
  Spinner,
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

  // Check if user is authenticated
  const checkAuthStatus = () => {
    if (!user || !user._id) {
      console.error("User not authenticated");
      return false;
    }
    return true;
  };

  const checkForPendingReviews = async () => {
    if (isFetching || !checkAuthStatus()) return;

    setIsFetching(true);
    try {
      const res = await fetch("/api/posts/pending-reviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 401) {
        console.error("Authentication error - user not authorized");
        toast({
          title: "Authentication Error",
          description: "Please try logging out and logging back in",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Pending reviews response:", data);

      if (data.length > 0 && !isOpen) {
        setCurrentReview(data[0]);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error checking reviews:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch pending reviews",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsFetching(false);
    }
  };
  const handleReview = async (decision) => {
    if (!currentReview?._id || !checkAuthStatus()) return;

    setIsLoading(true);
    try {
        const res = await fetch(`/api/posts/review/${currentReview._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ decision }), // Removed reviewerId from body
            credentials: "include"
        });

        if (res.status === 401) {
            throw new Error("Authentication error - please log in again");
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        toast({
            title: "Success",
            description: `Post ${decision === "approved" ? "approved" : "rejected"} successfully`,
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
  // Prioritize reviewer groups, then admins, then teachers
  useEffect(() => {
    const checkReviewerAccess = () => {
      if (!user) return;

      const hasReviewPermission = user.reviewerGroups?.some(
        (group) => group.permissions?.postReview
      );
      
      if (hasReviewPermission || user.role === "admin" || user.role === "teacher") {
        checkForPendingReviews();
        const interval = setInterval(checkForPendingReviews, 30000);
        return () => clearInterval(interval);
      }
    };

    checkReviewerAccess();
  }, [user]);

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
                  Posted by: {currentReview.postedBy?.username || "Unknown"}
                </Text>
                <Badge colorScheme="blue">Student Post</Badge>
              </Box>

              <Text>{currentReview.text}</Text>

              {currentReview.img && (
                <Image src={currentReview.img} alt="Post content" borderRadius="md" />
              )}

              <Divider />

              <Text fontSize="sm" color="gray.500">
                As a reviewer, your decision will determine if this post should be published.
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} isLoading={isLoading} onClick={() => handleReview("rejected")}>
            Reject
          </Button>
          <Button colorScheme="green" isLoading={isLoading} onClick={() => handleReview("approved")}>
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
