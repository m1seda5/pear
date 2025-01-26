import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, LockIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminUserModal = ({ user, isOpen, onClose }) => {
  const toast = useToast();

  const handleFreeze = async () => {
    try {
      const response = await axios.patch(`/api/users/${user._id}/freeze`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast({
        title: response.data.isFrozen
          ? "User account frozen successfully."
          : "User account unfrozen successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error freezing account.",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast({
        title: "User account deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error deleting account.",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Admin Actions</ModalHeader>
        <ModalBody>
          <Button
            leftIcon={<LockIcon />}
            colorScheme={user.isFrozen ? "green" : "blue"}
            onClick={handleFreeze}
          >
            {user.isFrozen ? "Unfreeze Account" : "Freeze Account"}
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            mt={4}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminUserModal;
