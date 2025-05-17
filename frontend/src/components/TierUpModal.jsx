import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Box, Text, Button, useBreakpointValue, Image } from "@chakra-ui/react";

const badgeImages = {
  champion: "/assets/images/championbadge.png",
  sapphire: "/assets/images/saphirebadge.png",
  emerald: "/assets/images/emeraldbadge.png",
  ruby: "/assets/images/rubybadge.png",
  gold: "/assets/images/goldbadge.png",
  silver: "/assets/images/silverbadge.png",
  bronze: "/assets/images/bronzebadge.png",
  wood: "/assets/images/woodbadge.png",
};

const tierColors = {
  champion: "linear(to-r, #ff00cc, #3333ff, #00ffcc, #ffcc00)",
  sapphire: "#3a8dde",
  emerald: "#2ecc71",
  ruby: "#e74c3c",
  gold: "#f1c40f",
  silver: "#bdc3c7",
  bronze: "#cd7f32",
  wood: "#a0522d",
};

const tierNames = {
  champion: "Champion",
  sapphire: "Sapphire",
  emerald: "Emerald",
  ruby: "Ruby",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  wood: "Wood",
};

const TierUpModal = ({ isOpen, onClose, newTier }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="scale">
      <ModalOverlay
        bg="rgba(0,0,0,0.6)"
        backdropFilter="blur(6px)"
      />
      <ModalContent bg="white" borderRadius="2xl" boxShadow="2xl" textAlign="center" p={8}>
        {!isMobile && <ModalCloseButton />}
        <ModalBody>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={6}>
            <Image src={badgeImages[newTier]} alt={newTier} boxSize="120px" mb={2} />
            <Text fontSize="2xl" fontWeight="extrabold" color={tierColors[newTier]}>
              Welcome! You are now in the {tierNames[newTier]} League!
            </Text>
            {isMobile && (
              <Button mt={6} colorScheme="purple" onClick={onClose} w="full">Done</Button>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TierUpModal; 