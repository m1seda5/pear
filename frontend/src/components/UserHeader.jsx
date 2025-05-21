// with updated profile  this is working version
// import { Avatar, Box, Flex, Link, Text, VStack, useToast } from "@chakra-ui/react";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button } from "@chakra-ui/react";
// import { MdVideoCall } from "react-icons/md";
// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";
// import { useTranslation } from 'react-i18next';
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// const MotionAvatar = motion(Avatar);

// const UserHeader = ({ user }) => {
//   const toast = useToast();
//   const currentUser = useRecoilValue(userAtom); // logged in user
//   const navigate = useNavigate(); // For navigation
//   const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
//   const { t, i18n } = useTranslation();
//   const [language, setLanguage] = useState(i18n.language);

//   useEffect(() => {
//     const handleLanguageChange = (lng) => {
//       setLanguage(lng);
//     };

//     i18n.on('languageChanged', handleLanguageChange);

//     return () => {
//       i18n.off('languageChanged', handleLanguageChange);
//     };
//   }, [i18n]);

//   const copyURL = () => {
//     const currentURL = window.location.href;
//     navigator.clipboard.writeText(currentURL).then(() => {
//       toast({
//         title: t("Success."),
//         status: "success",
//         description: t("Profile link copied."),
//         duration: 3000,
//         isClosable: true,
//       });
//     });
//   };

//   const handleProfileClick = () => {
//     navigate('/update'); // Redirect to UpdateProfilePage
//   };

//   return (
//     <VStack gap={4} alignItems={"start"}>
//       <Flex justifyContent={"space-between"} w={"full"}>
//         <Box>
//           <Text fontSize={"2xl"} fontWeight={"bold"}>
//             {user.name}
//           </Text>
//           <Flex gap={2} alignItems={"center"}>
//             <Text fontSize={"sm"}>{user.username}</Text>
//             <Text
//               fontSize={"xs"}
//               bg={"gray.dark"}
//               color={"gray.light"}
//               p={1}
//               borderRadius={"full"}
//             >
//               brookhouse
//             </Text>
//           </Flex>
//         </Box>
//         <Box>
//           {user.profilePic && (
//             <MotionAvatar
//               name={user.name}
//               src={user.profilePic}
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//               onClick={handleProfileClick}
//               cursor="pointer"
//               whileHover={{ scale: 1.05 }} // Popout animation
//               transition={{ duration: 0.2 }} // Duration of the animation
//             />
//           )}
//           {!user.profilePic && (
//             <MotionAvatar
//               name={user.name}
//               src="https://bit.ly/broken-link"
//               size={{
//                 base: "md",
//                 md: "xl",
//               }}
//               onClick={handleProfileClick}
//               cursor="pointer"
//               whileHover={{ scale: 1.05 }} // Popout animation
//               transition={{ duration: 0.2 }} // Duration of the animation
//             />
//           )}
//         </Box>
//       </Flex>

//       <Text>{user.bio}</Text>

//       {currentUser?._id === user._id && (
//         <Link as={RouterLink} to="/update">
//           <Button size={"sm"}>{t("Edit Profile")}</Button>
//         </Link>
//       )}
//       {currentUser?._id !== user._id && (
//         <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
//           {following ? t("Unfollow") : t("Follow")}
//         </Button>
//       )}
//       <Flex w={"full"} justifyContent={"space-between"}>
//         <Flex gap={2} alignItems={"center"}>
//           <Link color={"gray.light"}>Pear</Link>
//           <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
//           <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
//             meet.com
//           </Link>
//         </Flex>
//         <Flex>
//           <Box className="icon-container">
//             <Link href="https://pearmeet.onrender.com" isExternal>
//               <MdVideoCall size={24} cursor={"pointer"} />
//             </Link>
//           </Box>
//           <Box className="icon-container">
//             <Menu>
//               <MenuButton>
//                 <CgMoreO size={24} cursor={"pointer"} />
//               </MenuButton>
//               <Portal>
//                 <MenuList bg={"gray.dark"}>
//                   <MenuItem bg={"gray.dark"} onClick={copyURL}>
//                     {t("Copy link")}
//                   </MenuItem>
//                 </MenuList>
//               </Portal>
//             </Menu>
//           </Box>
//         </Flex>
//       </Flex>

//       <Flex w={"full"}>
//         <Flex
//           flex={1}
//           borderBottom={"1.2px solid gray"}
//           justifyContent={"center"}
//           pb="3"
//           cursor={"pointer"}
//         >
//           <Text fontWeight={"bold"}>{t("Feed")}</Text>
//         </Flex>
//       </Flex>
//     </VStack>
//   );
// };

// export default UserHeader;


// this updated version with verification(working)
import { Avatar, Box, Flex, Link, Text, VStack, useToast, IconButton, Image, useColorModeValue, Menu, MenuButton, MenuItem, MenuList, Portal, Button } from "@chakra-ui/react";
import { MdVideoCall } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDisclosure } from "@chakra-ui/hooks";
import BadgeDisplay from "./BadgeDisplay";
import { useContext } from "react";
import { CompetitionContext } from "../context/CompetitionContext";

const MotionAvatar = motion(Avatar);

const badgeImages = {
  champion: "/championbadge.png",
  sapphire: "/saphirebadge.png",
  emerald: "/emeraldbadge.png",
  ruby: "/rubybadge.png",
  gold: "/goldbadge.png",
  silver: "/silverbadge.png",
  bronze: "/bronzebadge.png",
  wood: "/woodbadge.png",
};

const BADGE_THRESHOLDS = {
  champion: 5000,
  sapphire: 4000,
  emerald: 3000,
  ruby: 2000,
  gold: 1000,
  silver: 500,
  bronze: 100,
  wood: 0
};

const getCurrentBadge = (points) => {
  for (const [badge, threshold] of Object.entries(BADGE_THRESHOLDS)) {
    if (points >= threshold) {
      return badge;
    }
  }
  return "wood";
};

const specialBadges = ["ruby", "emerald", "sapphire"];

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { competitionActive, badge } = useContext(CompetitionContext) || { competitionActive: true, badge: 'wood' };
  const bgColor = useColorModeValue("white", "#18181b");
  const borderColor = useColorModeValue("gray.200", "#232325");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(user.outOfCompetition);
  const [eligibleBadge, setEligibleBadge] = useState(null);
  const [isFirst, setIsFirst] = useState(false);
  const [error, setError] = useState("");
  const { setCompetitionActive } = useContext(CompetitionContext) || {};

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    if (!competitionActive) return;
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, [competitionActive]);

  useEffect(() => {
    // Only check for special badge eligibility if this is the profile owner and a special badge
    if (currentUser?._id !== user._id) return;
    const lastBadge = user.lastBadge;
    if (!specialBadges.includes(lastBadge) || user.outOfCompetition) return;
    fetch(`/api/badges/first/${lastBadge}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setIsFirst(data.isFirst);
        setEligibleBadge(lastBadge);
      })
      .catch(() => setIsFirst(false));
  }, [user, currentUser]);

  const handleProfileClick = () => {
    navigate('/update'); // Redirect to UpdateProfilePage
  };

  const showToast = (title, description, status) => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(t("Success."), t("Profile link copied."), "success");
    });
  };

  const handleAdminAction = async (action) => {
    try {
      const res = await fetch(`/api/users/admin/${action}-user`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      showToast("Success", `User ${action === 'delete' ? 'deleted' : 'frozen'} successfully`, "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleRedeem = async (badge) => {
    setRedeeming(true);
    setError("");
    try {
      const res = await fetch(`/api/badges/redeem`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, badge }),
      });
      const data = await res.json();
      if (data.message) {
        setRedeemed(true);
        setCompetitionActive && setCompetitionActive(false);
      } else {
        setError(data.error || "Redemption failed.");
      }
    } catch (e) {
      setError("Redemption failed.");
    } finally {
      setRedeeming(false);
    }
  };

  // Mock badges if not present
  const badges = user.badges || ["wood", "bronze", "silver", "gold", "ruby", "emerald", "sapphire", "champion"];

  return (
    <VStack gap={4} alignItems={"start"} w="full">
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
          <Flex gap={2} alignItems={"center"} flexWrap="wrap">
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>brookhouse</Text>
            {/* Badges row, slightly larger, right of username, wrap if needed */}
            <Flex gap={4} align="center" ml={2} flexWrap="wrap">
              {competitionActive
                ? (user.badges || ["wood", "bronze", "silver", "gold", "ruby", "emerald", "sapphire", "champion"]).map((badge) => {
                const isSpecial = specialBadges.includes(badge);
                const canRedeem =
                  currentUser?._id === user._id &&
                  isSpecial &&
                  !redeemed &&
                  eligibleBadge === badge &&
                  isFirst;
                return (
                  <Image
                    key={badge}
                    src={badgeImages[badge]}
                    alt={badge + " badge"}
                    boxSize="48px"
                    title={badge.charAt(0).toUpperCase() + badge.slice(1) + " Badge"}
                    style={canRedeem ? { cursor: 'pointer', border: '2px solid #7F53AC', boxShadow: '0 0 12px #7F53AC' } : {}}
                    onClick={canRedeem ? () => handleRedeem(badge) : undefined}
                  />
                );
                  })
                : user.lastBadge && (
                    <Image
                      key={user.lastBadge}
                      src={badgeImages[user.lastBadge]}
                      alt={user.lastBadge + " badge"}
                      boxSize="48px"
                      title={user.lastBadge.charAt(0).toUpperCase() + user.lastBadge.slice(1) + " Badge"}
                    />
                  )}
            </Flex>
          </Flex>
          {error && <Text color="red.400" fontSize="sm" mt={2}>{error}</Text>}
          {redeeming && <Text color="purple.500" fontSize="sm" mt={2}>Redeeming...</Text>}
        </Box>
        <Box>
          {user.profilePic ? (
            <MotionAvatar
              name={user.name}
              src={user.profilePic}
              size={{ base: "md", md: "xl" }}
              onClick={handleProfileClick}
              cursor="pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <MotionAvatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{ base: "md", md: "xl" }}
              onClick={handleProfileClick}
              cursor="pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>{t("Edit Profile")}</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? t("Unfollow") : t("Follow")}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Link color={"gray.light"}>Pear</Link>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link href="https://pearmeet.onrender.com" isExternal color={"gray.light"}>
            meet.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Link href="https://pearmeet.onrender.com" isExternal>
              <MdVideoCall size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    {t("Copy link")}
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.2px solid gray"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>{t("Feed")}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;