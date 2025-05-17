import { Box, Flex, Text, useBreakpointValue, Avatar } from "@chakra-ui/react";

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

const PersonalPointsWidget = () => {
  const show = useBreakpointValue({ base: false, md: true });
  if (!show) return null;
  // Placeholder data
  const user = { name: "MISEDA", points: 180, badge: "wood" };
  return (
    <Box
      bgGradient="linear(to-br, #7F53AC 0%, #647DEE 100%)"
      color="white"
      borderRadius="28px"
      p={7}
      mb={6}
      w="300px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="2px solid #fff3"
      textAlign="center"
      fontFamily="'Montserrat', 'Inter', sans-serif"
    >
      <Text fontSize="2rem" fontWeight="extrabold" mb={2} letterSpacing="0.08em" textShadow="0 0 16px #fff8, 0 2px 8px #0008">MY POINTS</Text>
      <Flex align="center" justify="center" gap={4} mb={2}>
        <Avatar size="lg" src={badgeImages[user.badge]} name={user.name} bg="transparent" boxSize="48px" />
        <Text fontWeight="bold" fontSize="1.3rem">{user.name}</Text>
      </Flex>
      <Text fontWeight="extrabold" fontSize="2.1rem" letterSpacing="0.04em">
        {user.points} <Box as="span" fontSize="0.8em" fontWeight="semibold" color="#B0B0B0">PTS</Box>
      </Text>
    </Box>
  );
};

export default PersonalPointsWidget; 