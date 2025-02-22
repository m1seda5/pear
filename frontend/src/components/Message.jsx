
// // this is version one working
// import {
//   Avatar,
//   Box,
//   IconButton,
//   Flex,
//   Image,
//   Skeleton,
//   Text,
//  } from "@chakra-ui/react";
//  import { selectedConversationAtom } from "../atoms/messagesAtom";
//  import { useRecoilValue } from "recoil";
//  import userAtom from "../atoms/userAtom";
//  import { BsCheck2All } from "react-icons/bs";
//  import { CloseIcon } from "@chakra-ui/icons"; // Import the close icon
//  import { useState } from "react";
//  // List of restricted words
//  const restrictedWords = [
//   // Offensive language
//   "fuck",
//   "shit",
//   "bitch",
//   "cunt",
//   "motherfucker",
//   "asshole",
//   "dick",
//   "pussy",
//   "cock",
//   "slut",
//   "whore",
//   "faggot",
//   "nigger",
//   "chink",
//   "gook",
//   "spic",
//   "raghead",
//   "wetback",
 
 
//   // Derogatory terms
//   "retard",
//   "cripple",
//   "idiot",
//   "moron",
//   "dumbass",
//   "lame",
//   "loser",
 
 
//   // Hate speech
//   "terrorist",
//   "racist",
//   "bigot",
//   "sexist",
//   "homophobe",
//   "xenophobe",
 
 
//   // Insults and slurs
//   "bastard",
//   "scum",
//   "pig",
//   "skank",
//   "tramp",
//   "hoe",
//   "slut",
//   "bimbo",
 
 
//   // Drugs and alcohol
//   "crack",
//   "heroin",
//   "meth",
//   "cocaine",
//   "weed",
//   "marijuana",
//   "pot",
 
 
//   // Sexual content
//   "porn",
//   "sex",
//   "nude",
//   "orgy",
//   "rape",
//   "molest",
//   "incest",
 
 
//   // Offensive phrases
//   "go to hell",
//   "kill yourself",
//   "die",
//   "you're a loser",
//   "eat shit",
 
 
//   // Additional common bad phrases
//   "suck my dick",
//   "blow job",
//   "fist fuck",
//   "cock sucking",
//   "dickhead",
//  ];
 
 
//  // Function to check if a message contains any restricted words
//  const isMessageRestricted = (text) => {
//   return restrictedWords.some((word) => text.toLowerCase().includes(word));
//  };
//  const Message = ({ ownMessage, message, onDelete }) => {
//   const selectedConversation = useRecoilValue(selectedConversationAtom);
//   const user = useRecoilValue(userAtom);
//   const [imgLoaded, setImgLoaded] = useState(false);
//   // Check if the message contains restricted words
//   if (message.text && isMessageRestricted(message.text)) {
//     return (
//       <Flex justifyContent={"center"} p={2}>
//         <Text color={"red.500"}>
//           Message contains inappropriate content and was not sent.
//         </Text>
//       </Flex>
//     );
//   }
//   return (
//     <>
//       {ownMessage ? (
//         <Flex gap={2} alignSelf={"flex-end"} position="relative">
//           {message.text && (
//             <Flex
//               bg={"green.800"}
//               maxW={"350px"}
//               p={1}
//               borderRadius={"md"}
//               position="relative"
//             >
//               {/* Start of delete button */}
//               <IconButton
//                 icon={<CloseIcon />}
//                 size="xs" // Extra small button
//                 fontSize="10px" // Adjust the icon size to make it smaller
//                 variant="ghost" // No background or border
//                 colorScheme="whiteAlpha" // Transparent background
//                 position="absolute"
//                 top="-4px" // Adjust position to fit better
//                 right="-4px" // Adjust position to fit better
//                 onClick={() => onDelete(message._id)} // Call onDelete with message ID
//                 borderRadius="full"
//                 aria-label="Delete message"
//               />
//               {/* End of delete button */}
//               <Text color={"white"}>{message.text}</Text>
//               <Box
//                 alignSelf={"flex-end"}
//                 ml={1}
//                 color={message.seen ? "blue.400" : ""}
//                 fontWeight={"bold"}
//               >
//                 <BsCheck2All size={16} />
//               </Box>
//             </Flex>
//           )}
//           {message.img && !imgLoaded && (
//             <Flex mt={5} w={"200px"}>
//               <Image
//                 src={message.img}
//                 hidden
//                 onLoad={() => setImgLoaded(true)}
//                 alt="Message image"
//                 borderRadius={4}
//               />
//               <Skeleton w={"200px"} h={"200px"} />
//             </Flex>
//           )}
//           {message.img && imgLoaded && (
//             <Flex mt={5} w={"200px"} position="relative">
//               <Image src={message.img} alt="Message image" borderRadius={4} />
//               {/* Start of delete button */}
//               <IconButton
//                 icon={<CloseIcon />}
//                 size="2xs" // Smaller than extra small
//                 fontSize="6px" // Even smaller icon size
//                 variant="ghost" // No background or border
//                 colorScheme="whiteAlpha" // Transparent background
//                 position="absolute"
//                 top="-2px" // Keeps the current position
//                 right="-2px" // Keeps the current position
//                 onClick={() => onDelete(message._id)} // Call onDelete with message ID
//                 borderRadius="full"
//                 aria-label="Delete message"
//               />
//               {/* End of delete button */}
//               <Box
//                 alignSelf={"flex-end"}
//                 ml={1}
//                 color={message.seen ? "blue.400" : ""}
//                 fontWeight={"bold"}
//               >
//                 <BsCheck2All size={16} />
//               </Box>
//             </Flex>
//           )}
//           <Avatar src={user.profilePic} w="7" h={7} />
//         </Flex>
//       ) : (
//         <Flex gap={2} position="relative">
//           <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
//           {message.text && (
//             <Flex
//               position="relative"
//               maxW={"350px"}
//               bg={"gray.400"}
//               p={1}
//               borderRadius={"md"}
//             >
//               {/* Start of delete button */}
//               <IconButton
//                 icon={<CloseIcon />}
//                 size="2xs" // Smaller than extra small
//                 fontSize="6px" // Even smaller icon size
//                 variant="ghost" // No background or border
//                 colorScheme="whiteAlpha" // Transparent background
//                 position="absolute"
//                 top="-2px" // Keeps the current position
//                 right="-2px" // Keeps the current position
//                 onClick={() => onDelete(message._id)} // Call onDelete with message ID
//                 borderRadius="full"
//                 aria-label="Delete message"
//               />
//               {/* End of delete button */}
//               <Text color={"black"}>{message.text}</Text>
//             </Flex>
//           )}
//           {message.img && !imgLoaded && (
//             <Flex mt={5} w={"200px"}>
//               <Image
//                 src={message.img}
//                 hidden
//                 onLoad={() => setImgLoaded(true)}
//                 alt="Message image"
//                 borderRadius={4}
//               />
//               <Skeleton w={"200px"} h={"200px"} />
//             </Flex>
//           )}
//           {message.img && imgLoaded && (
//             <Flex mt={5} w={"200px"} position="relative">
//               <Image src={message.img} alt="Message image" borderRadius={4} />
//               {/* Start of delete button */}
//               <IconButton
//                 icon={<CloseIcon />}
//                 size="2xs" // Smaller than extra small
//                 fontSize="6px" // Even smaller icon size
//                 variant="ghost" // No background or border
//                 colorScheme="whiteAlpha" // Transparent background
//                 position="absolute"
//                 top="-2px" // Keeps the current position
//                 right="-2px" // Keeps the current position
//                 onClick={() => onDelete(message._id)} // Call onDelete with message ID
//                 borderRadius="full"
//                 aria-label="Delete message"
//               />
//               {/* End of delete button */}
//             </Flex>
//           )}
//         </Flex>
//       )}
//     </>
//   );
//  };
//  export default Message;
 
 
 

//  version 2 with translations
import {
  Avatar,
  Box,
  IconButton,
  Flex,
  Image,
  Skeleton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsThreeDotsVertical } from "react-icons/bs";
import { FiCopy, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import EmojiPicker from "emoji-picker-react";

const restrictedWords = [
  // Hate Speech & Discriminatory Terms  
  "nigger", "nigga", "faggot", "retard", "spic", "kike", "chink", "gook", "towelhead", 
  "sandnigger", "tranny", "heeb", "wetback", "beaner", "cracker", "white trash",
  "coon", "porch monkey", "jungle bunny", "slant eye", "yellow monkey", 
  "gypsy", "pikey", "dago", "wop", "zipperhead", "muzzie", "infidel",

  // Violent Threats  
  "kill yourself", "kys", "go die", "die in a fire", "an hero", "i will kill you", 
  "i'm going to kill you", "shoot up", "massacre", "school shooter", "columbine",
  "sandy hook", "uvalde", "bomb", "terrorist", "isis", "al qaeda", "9/11", 
  "behead", "decapitate", "lynch", "genocide", "rape", "r4pe", "rapist",
  "pedophile", "grooming", "child molester", "child predator", "hit list",
  "kill list", "manifesto", "dox", "swat", "swatting", "threat", "assassinate",
  "execute", "stab", "shoot", "murder", "suicide pact", "suicide bombing",

  // Criminal Activity  
  "drug dealer", "cartel", "trafficking", "human trafficking", "kidnap",
  "abduction", "slave trade", "cocaine", "heroin", "meth", "lsd", "shrooms",
  "fentanyl", "opioids", "xanax", "lean", "perc", "ecstasy", "molly", "crack",
  "overdose", "prostitute", "pimp", "sex trafficking", "extortion", "blackmail",
  "fraud", "scam", "bribe", "embezzlement", "money laundering", "wire fraud",
  "cyber attack", "hacking", "phishing", "identity theft", "credit card fraud",
  "counterfeit", "forgery", "insider trading", "arson", "robbery", "burglary",
  "theft", "grand theft", "carjacking", "vandalism", "looting", "riot", "gang",
  "crip", "blood", "ms-13", "norteño", "sureño", "aryan brotherhood", "klan",
  "kkk", "neo-nazi", "white supremacist", "black supremacist", "race war"
];

const isMessageRestricted = (text) => {
  return restrictedWords.some((word) => text.toLowerCase().includes(word));
};

const Message = ({ ownMessage, message, onDelete }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const bubbleBg = useColorModeValue(
    ownMessage ? "blue.500" : "gray.100",
    ownMessage ? "blue.600" : "gray.700"
  );
  
  const textColor = useColorModeValue(
    ownMessage ? "white" : "gray.800",
    ownMessage ? "white" : "gray.100"
  );

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  if (message.text && isMessageRestricted(message.text)) {
    return (
      <Flex justifyContent={"center"} p={2}>
        <Text color={"red.500"}>
          {t("Message contains inappropriate content and was not sent.")}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex 
      direction="column" 
      align={ownMessage ? "flex-end" : "flex-start"}
      gap={2}
      my={2}
      maxW="80%"
    >
      {!ownMessage && selectedConversation.isGroup && (
        <Text fontSize="xs" color="gray.500" pl={1}>
          {message.sender?.username}
        </Text>
      )}

      <Flex
        position="relative"
        bg={bubbleBg}
        color={textColor}
        borderRadius="2xl"
        p={3}
        boxShadow="md"
        _hover={{ transform: "translateY(-2px)" }}
        transition="all 0.2s ease"
      >
        <Menu placement={ownMessage ? "left-start" : "right-start"}>
          <MenuButton
            as={IconButton}
            icon={<BsThreeDotsVertical />}
            variant="ghost"
            size="xs"
            position="absolute"
            top={1}
            right={1}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            aria-label={t("Message actions")}
          />
          
          <MenuList>
            <MenuItem 
              icon={<FiCopy />} 
              onClick={() => navigator.clipboard.writeText(message.text)}
            >
              {t("Copy")}
            </MenuItem>
            <MenuItem icon={<FiCornerUpLeft />}>
              {t("Reply")}
            </MenuItem>
            <MenuItem 
              icon={<FiTrash2 />} 
              color="red.500"
              onClick={() => onDelete(message._id)}
            >
              {t("Delete")}
            </MenuItem>
          </MenuList>
        </Menu>

        {message.text && <Text fontSize="md">{message.text}</Text>}
        
        {message.img && !imgLoaded && (
          <Flex mt={5} w={"200px"}>
            <Image
              src={message.img}
              hidden
              onLoad={() => setImgLoaded(true)}
              alt={t("Message image")}
              borderRadius={4}
            />
            <Skeleton w={"200px"} h={"200px"} />
          </Flex>
        )}

        {message.img && imgLoaded && (
          <Flex mt={5} w={"200px"} position="relative">
            <Image 
              src={message.img} 
              alt={t("Message image")} 
              borderRadius={4} 
            />
          </Flex>
        )}

        <Flex align="center" gap={1} mt={1} ml={2}>
          <Text fontSize="xs" opacity={0.7}>
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          {ownMessage && (
            <BsCheck2All 
              color={message.seen ? "#48BB78" : "currentColor"} 
              size="14px" 
            />
          )}
        </Flex>
      </Flex>

      {ownMessage && (
        <Avatar src={user.profilePic} w="7" h={7} />
      )}
      {!ownMessage && (
        <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
      )}
    </Flex>
  );
};

export default Message;
