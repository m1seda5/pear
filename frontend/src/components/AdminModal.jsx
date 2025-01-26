import React from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

const AdminModal = ({ userId, onClose, onFreeze, onDelete }) => {
  return (
    <Box
      position="absolute"
      mt={2}
      bg="gray.700"
      p={3}
      borderRadius="md"
      boxShadow="md"
      zIndex={10} // Ensure the modal appears above other elements
    >
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          Admin Actions
        </Text>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            onFreeze(userId);
            onClose();
          }}
        >
          Freeze Account
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => {
            onDelete(userId);
            onClose();
          }}
        >
          Delete Account
        </Button>
        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </VStack>
    </Box>
  );
};

export default AdminModal;