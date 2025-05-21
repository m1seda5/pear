import { Flex, Image, Text, Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CompetitionContext } from "../context/CompetitionContext";

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

const badgeOrder = [
  "wood",
  "bronze",
  "silver",
  "gold",
  "ruby",
  "emerald",
  "sapphire",
  "champion",
];

const sizeMap = {
  sm: 28,
  md: 40,
  lg: 64,
};

const rainbowGlow =
  "0 0 12px 2px #ff00cc, 0 0 24px 4px #3333ff, 0 0 36px 8px #00ffcc, 0 0 48px 12px #ffcc00";

const BadgeDisplay = ({ badges = [], currentTier = "wood", size = "md", showAll = false, showTierName = false, champion = false }) => {
  const { competitionActive, badge } = useContext(CompetitionContext) || { competitionActive: true, badge: 'wood' };
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!competitionActive) return;
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, [competitionActive]);

  const maxIndex = badgeOrder.indexOf(currentTier);
  const displayBadges = showAll ? badgeOrder.slice(0, maxIndex + 1) : [currentTier];

  return (
    <Flex gap={2} align="center">
      {displayBadges.map((badge) => (
        <Box key={badge} position="relative">
          <Image
            src={badgeImages[badge]}
            alt={badge}
            boxSize={sizeMap[size]}
            filter={badgeOrder.indexOf(badge) > maxIndex ? "grayscale(1) opacity(0.5)" : "none"}
            style={champion && badge === "champion" ? { boxShadow: rainbowGlow, borderRadius: "50%" } : {}}
          />
          {showTierName && (
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={badge === "champion" ? "#ff00cc" : badge === currentTier ? "#7F53AC" : "gray.400"}
              ml={1}
              mt={1}
              textShadow={badge === "champion" ? "0 0 8px #fff, 0 0 16px #ff00cc" : "none"}
            >
              {tierNames[badge]}
            </Text>
          )}
        </Box>
      ))}
    </Flex>
  );
};

export default BadgeDisplay; 