import {
  Flex,
  Avatar,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
  useMediaQuery,
  Box,
  Tooltip,
  Skeleton,
  SkeletonCircle
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGesture } from '@use-gesture/react';

const MotionFlex = motion(Flex);

const GameCard = ({
  game,
  isAdmin = false,
  onEdit,
  onDelete,
  isDetailed = false,
  loading = false,
  onClick
}) => {
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isHovered, setIsHovered] = useState(false);
  const [showScore, setShowScore] = useState(false);

  const bind = useGesture({
    onDragEnd: ({ direction: [dx] }) => {
      if (Math.abs(dx) > 20 && game?._id) {
        navigate(`/games/${game._id}`);
      }
    }
  });

  const statusColors = {
    live: "green",
    upcoming: "orange",
    past: "gray"
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverShadow = useColorModeValue("lg", "dark-lg");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScore(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [game?.status]);

  const handleDoubleClick = () => {
    if (!isAdmin && game?._id) {
      navigate(`/games/${game._id}`);
    }
  };

  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else if (!isAdmin && game?._id) {
      navigate(`/games/${game._id}`);
    }
  };

  const getTeamAbbreviation = (name) => {
    const abbreviations = {
      cavaliers: "CLE",
      lakers: "LAL",
      warriors: "GSW",
      celtics: "BOS",
      // Add more if needed
    };
    return abbreviations[name?.toLowerCase()] || name?.slice(0, 3).toUpperCase();
  };

  if (loading) {
    return (
      <Flex
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={cardBg}
        mb={4}
        gap={4}
        align="center"
        role="region"
        aria-label="Loading game card"
      >
        <SkeletonCircle size={isMobile ? "8" : "12"} />
        <Box flex={1}>
          <Skeleton height="20px" mb={2} width="60%" />
          <Skeleton height="20px" width="40%" />
        </Box>
      </Flex>
    );
  }

  const gameTitle = game?.teamA?.name && game?.teamB?.name 
    ? `${game.teamA.name} vs ${game.teamB.name}` 
    : "Game details";

  return (
    <Box 
      {...bind()}
      onClick={handleViewDetails}
      onDoubleClick={handleDoubleClick}
      cursor={!isAdmin ? "pointer" : "default"}
      role="region"
      aria-live={game?.status === "live" ? "polite" : "off"}
      aria-label={`${gameTitle} - ${game?.status || ""} game`}
    >
      <MotionFlex
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={cardBg}
        borderColor={borderColor}
        mb={4}
        gap={4}
        align="center"
        justify="space-between"
        position="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition="0.2s ease"
        boxShadow={isHovered ? hoverShadow : "md"}
        _hover={{ transform: "translateY(-2px)" }}
      >
        {/* Status Badge */}
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={statusColors[game?.status]}
          variant="subtle"
          px={2}
          py={1}
          borderRadius="full"
        >
          {game?.status?.toUpperCase()}
        </Badge>

        {/* Admin Controls */}
        {isAdmin && (
          <Flex position="absolute" top={2} left={2} gap={1}>
            <Tooltip label="Edit Game">
              <IconButton
                icon={<EditIcon />}
                size="xs"
                onClick={onEdit}
                aria-label={`Edit ${game?.teamA?.name || 'Team A'} vs ${game?.teamB?.name || 'Team B'}`}
                variant="ghost"
              />
            </Tooltip>
            <Tooltip label="Delete Game">
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                onClick={onDelete}
                aria-label={`Delete ${game?.teamA?.name || 'Team A'} vs ${game?.teamB?.name || 'Team B'}`}
                colorScheme="red"
                variant="ghost"
              />
            </Tooltip>
          </Flex>
        )}

        {/* Team A */}
        <Flex direction="column" align="center" flex={1}>
          <Avatar
            size={isMobile ? "md" : "lg"}
            src={game?.teamA?.logo}
            name={game?.teamA?.name}
            mb={2}
            icon={<FaRegClock fontSize="1.5rem" />}
          />
          <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"} textAlign="center">
            {isMobile ? getTeamAbbreviation(game?.teamA?.name) : game?.teamA?.name}
          </Text>
          {isDetailed && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              {game?.teamA?.players?.length || 0} players
            </Text>
          )}
        </Flex>

        {/* Score / VS */}
        <Flex direction="column" align="center" mx={4} aria-live={game?.status === "live" ? "assertive" : "off"}>
          {game?.status === "upcoming" ? (
            <Text fontSize={isMobile ? "sm" : "lg"} color="gray.500">
              VS
            </Text>
          ) : (
            <Flex align="center" gap={2} aria-label={`Score: ${game?.scoreA || 0} to ${game?.scoreB || 0}`}>
              <Text fontSize={isMobile ? "xl" : "2xl"} fontWeight="bold">
                {showScore ? game?.scoreA || 0 : "-"}
              </Text>
              <Text fontSize={isMobile ? "lg" : "xl"}>:</Text>
              <Text fontSize={isMobile ? "xl" : "2xl"} fontWeight="bold">
                {showScore ? game?.scoreB || 0 : "-"}
              </Text>
            </Flex>
          )}
          <Text fontSize="xs" color="gray.500" mt={1}>
            {new Date(game?.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </Flex>

        {/* Team B */}
        <Flex direction="column" align="center" flex={1}>
          <Avatar
            size={isMobile ? "md" : "lg"}
            src={game?.teamB?.logo}
            name={game?.teamB?.name}
            mb={2}
            icon={<FaRegClock fontSize="1.5rem" />}
          />
          <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"} textAlign="center">
            {isMobile ? getTeamAbbreviation(game?.teamB?.name) : game?.teamB?.name}
          </Text>
          {isDetailed && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              {game?.teamB?.players?.length || 0} players
            </Text>
          )}
        </Flex>

        {/* Hover Overlay */}
        {!isAdmin && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.100"
            opacity={isHovered ? 1 : 0}
            transition="0.2s ease"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color="white"
              fontWeight="bold"
              bg="blackAlpha.600"
              px={3}
              py={1}
              borderRadius="full"
            >
              {game?.status === "live" ? "Watch Live" : "View Details"}
            </Text>
          </Box>
        )}
      </MotionFlex>
    </Box>
  );
};

export default GameCard;
