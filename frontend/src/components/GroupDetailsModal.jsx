import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Flex,
  Avatar,
  Divider,
  useColorModeValue,
  Spinner,
  Badge,
  IconButton,
  useToast,
  Tooltip
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";

const GroupDetails = ({ isOpen, onClose, group }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  
  // Theme colors
  const modalBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const creatorBadgeBg = useColorModeValue("blue.100", "blue.800");
  const creatorBadgeColor = useColorModeValue("blue.800", "blue.100");
  
  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?._id) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/groups/${group._id}/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Failed to load group members");
        }
        
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchMembers();
    }
  }, [group?._id, isOpen, currentUser.token, toast]);
  
  const handleLeaveGroup = async () => {
    if (!group?._id) return;
    
    setIsLeaving(true);
    try {
      const res = await fetch(`/api/groups/${group._id}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to leave group");
      }
      
      toast({
        title: "Success",
        description: group.creator._id === currentUser._id 
          ? t("Group deleted successfully") 
          : t("Left group successfully"),
        status: "success",
        duration: 3000,
        isClosable: true
      });
      
      // Close modal and reload groups in parent component
      onClose(true); // Pass true to indicate that a refresh is needed
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLeaving(false);
    }
  };
  
  const handleProfileClick = (username) => {
    onClose();
    navigate(`/${username}`);
  };
  
  if (!group) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={modalBg}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
      >
        <Box bg={group?.color || "blue.500"} py={3} px={4}>
          <ModalHeader p={0} color="white" fontSize="lg">
            {group?.name}
          </ModalHeader>
          <ModalCloseButton color="white" />
        </Box>
        
        <ModalBody p={4}>
          {group?.description && (
            <Box mb={4}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {t("Description")}
              </Text>
              <Text fontSize="md">{group.description}</Text>
            </Box>
          )}
          
          <Box mb={4}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {t("Members")} • {members.length}
              </Text>
              {currentUser._id === group?.creator?._id && (
                <Badge colorScheme="blue" variant="subtle">
                  {t("Creator")}
                </Badge>
              )}
            </Flex>
            
            <Divider mb={3} />
            
            {isLoading ? (
              <Flex justify="center" py={4}>
                <Spinner size="sm" />
              </Flex>
            ) : (
              <Box maxH="200px" overflowY="auto" pr={2}>
                {members.map((member) => (
                  <Flex
                    key={member._id}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: hoverBg }}
                    cursor="pointer"
                    align="center"
                    justify="space-between"
                    onClick={() => handleProfileClick(member.username)}
                  >
                    <Flex align="center">
                      <Avatar size="sm" src={member.profilePic} name={member.username} mr={2} />
                      <Text fontSize="md">{member.username}</Text>
                    </Flex>
                    
                    {member._id === group?.creator?._id && (
                      <Badge bg={creatorBadgeBg} color={creatorBadgeColor} fontSize="xs">
                        {t("Creator")}
                      </Badge>
                    )}
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
          
          <Divider my={3} />
          
          <Flex justify="center" pt={1}>
            <Tooltip label={currentUser._id === group?.creator?._id ? t("Delete Group") : t("Leave Group")}>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                leftIcon={<CloseIcon />}
                onClick={handleLeaveGroup}
                isLoading={isLeaving}
                loadingText={currentUser._id === group?.creator?._id ? t("Deleting...") : t("Leaving...")}
              >
                {currentUser._id === group?.creator?._id ? t("Delete Group") : t("Leave Group")}
              </Button>
            </Tooltip>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GroupDetails;