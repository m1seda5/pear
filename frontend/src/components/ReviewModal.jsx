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
  useToast
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    checkForPendingReviews();
    // Poll for new reviews every 30 seconds
    const interval = setInterval(checkForPendingReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkForPendingReviews = async () => {
    try {
      const res = await fetch("/api/posts/pending-reviews");
      const data = await res.json();
      
      if (data.length > 0 && !isOpen) {
        setCurrentReview(data[0]);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error checking reviews:", error);
    }
  };

  const handleReview = async (decision) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/review/${currentReview._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const data = await res.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Send email notification about the review decision
      await fetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: currentReview.postedBy.email,
          subject: `Post Review ${decision === 'approved' ? 'Approved' : 'Rejected'} 🍐`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4CAF50;">Post Review Update</h2>
              <p>Your post has been ${decision === 'approved' ? 'approved' : 'rejected'} by a reviewer.</p>
              ${decision === 'approved' 
                ? '<p>Your post is now visible to other users.</p>' 
                : '<p>Please review our posting guidelines and try again.</p>'}
            </div>
          `
        })
      });

      toast({
        title: "Success",
        description: `Post ${decision === 'approved' ? 'approved' : 'rejected'} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setCurrentReview(null);
      checkForPendingReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentReview) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Review Post</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" color="gray.500">
                Posted by: {currentReview.postedBy.username}
              </Text>
              <Badge colorScheme="blue">Student Post</Badge>
            </Box>
            
            <Text>{currentReview.text}</Text>
            
            {currentReview.img && (
              <Image src={currentReview.img} alt="Post content" borderRadius="md" />
            )}
            
            <Divider />
            
            <Text fontSize="sm" color="gray.500">
              Please review this post according to our community guidelines.
            </Text>
          </VStack>
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