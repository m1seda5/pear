import { Box, Flex, Text, useBreakpointValue, Avatar } from "@chakra-ui/react";

const placeholderUsers = [
  { name: "ABI", points: 4000, badge: "emerald" },
  { name: "SCARLET", points: 2000, badge: "ruby" },
  { name: "MUNO", points: 1300, badge: "gold" },
  { name: "BOMBOGIKUHI", points: 700, badge: "silver" },
  { name: "IMRAN", points: 300, badge: "bronze" },
  { name: "MISEDA", points: 0, badge: "wood" },
  { name: "EXTRA", points: 0, badge: "wood" },
];

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

const LeaderboardWidget = () => {
  const show = useBreakpointValue({ base: false, md: true });
  if (!show) return null;
  return (
    <Box
      bgGradient="linear(to-br, #7F53AC 0%, #647DEE 100%)"
      color="white"
      borderRadius="32px"
      p={8}
      mb={6}
      w="370px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="2px solid #fff3"
      fontFamily="'Montserrat', 'Inter', sans-serif"
    >
      <Text fontSize="2.2rem" fontWeight="extrabold" mb={1} letterSpacing="0.08em" textAlign="center" textShadow="0 0 16px #fff8, 0 2px 8px #0008">CHAMPIONS</Text>
      <Text fontSize="1.1rem" fontWeight="bold" mb={5} textAlign="center" letterSpacing="0.12em" color="#FFD700" textShadow="0 1px 4px #0006">QUALIFICATION 1</Text>
      {placeholderUsers.map((user, i) => (
        <Flex key={user.name} align="center" justify="space-between" mb={i === placeholderUsers.length - 1 ? 0 : 3}>
          <Flex align="center" gap={3} minW="0">
            <Avatar size="sm" src={badgeImages[user.badge]} name={user.name} bg="transparent" boxSize="36px" />
            <Text fontWeight="bold" fontSize="1.15rem" isTruncated>{user.name}</Text>
          </Flex>
          <Text fontWeight="extrabold" fontSize="1.35rem" letterSpacing="0.04em">
            {user.points} <Box as="span" fontSize="0.8em" fontWeight="semibold" color="#B0B0B0">PTS</Box>
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default LeaderboardWidget; 