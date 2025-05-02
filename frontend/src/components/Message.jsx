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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";

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

const Message = React.memo(({ ownMessage, message, onDelete }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (message.text && isMessageRestricted(message.text)) {
    return (
      <div className="friendkit-message-restricted">Message contains inappropriate content and was not sent.</div>
    );
  }

  return (
    <div className={`friendkit-message-item${ownMessage ? ' is-sent' : ' is-received'}`}> 
      {!ownMessage && (
        <img className="friendkit-message-avatar" src={selectedConversation.userProfilePic || '/default-avatar.png'} alt="avatar" />
      )}
      <div className="friendkit-message-bubble-wrap">
        <div className={`friendkit-message-bubble${ownMessage ? ' is-sent' : ' is-received'}`}> 
          {message.text && <span className="friendkit-message-text">{message.text}</span>}
          {message.img && (
            <span className="friendkit-message-image-wrap">
              <img
                src={message.img}
                alt="Message image"
                className="friendkit-message-image"
                style={{ display: imgLoaded ? 'block' : 'none' }}
                onLoad={() => setImgLoaded(true)}
              />
              {!imgLoaded && <span className="friendkit-message-image-loading">Loading...</span>}
            </span>
          )}
          {ownMessage && (
            <button className="button is-icon is-danger is-tiny friendkit-message-delete" onClick={() => onDelete(message._id)} title="Delete">
              <i data-feather="x"></i>
            </button>
          )}
        </div>
        <div className="friendkit-message-meta">
          <span className="friendkit-message-time">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {ownMessage && message.seen && <span className="friendkit-message-seen">✓✓</span>}
        </div>
      </div>
      {ownMessage && (
        <img className="friendkit-message-avatar" src={user.profilePic || '/default-avatar.png'} alt="avatar" />
      )}
    </div>
  );
});

export default Message;