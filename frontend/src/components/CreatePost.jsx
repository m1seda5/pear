// // original
// import { AddIcon } from "@chakra-ui/icons";
// import {
//     Button,
//     CloseButton,
//     Flex,
//     FormControl,
//     Image,
//     Input,
//     Modal,
//     ModalBody,
//     ModalCloseButton,
//     ModalContent,
//     ModalFooter,
//     ModalHeader,
//     ModalOverlay,
//     Text,
//     Textarea,
//     Select,
//     useColorModeValue,
//     useDisclosure,
// } from "@chakra-ui/react";
// import { useRef, useState } from "react";
// import usePreviewImg from "../hooks/usePreviewImg";
// import { BsFillImageFill } from "react-icons/bs";
// import { useRecoilState, useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import useShowToast from "../hooks/useShowToast";
// import postsAtom from "../atoms/postsAtom";
// import { useParams } from "react-router-dom";
// import { useTranslation } from 'react-i18next';

// const MAX_CHAR = 500;

// const CreatePost = () => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [postText, setPostText] = useState("");
//     const [targetAudience, setTargetAudience] = useState("all"); // Default to 'all'
//     const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
//     const imageRef = useRef(null);
//     const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
//     const user = useRecoilValue(userAtom);
//     const showToast = useShowToast();
//     const [loading, setLoading] = useState(false);
//     const [posts, setPosts] = useRecoilState(postsAtom);
//     const { username } = useParams();
//     const { t } = useTranslation();

//     const handleTextChange = (e) => {
//         const inputText = e.target.value;
//         if (inputText.length > MAX_CHAR) {
//             const truncatedText = inputText.slice(0, MAX_CHAR);
//             setPostText(truncatedText);
//             setRemainingChar(0);
//         } else {
//             setPostText(inputText);
//             setRemainingChar(MAX_CHAR - inputText.length);
//         }
//     };

//     const handleCreatePost = async () => {
//         setLoading(true);
//         try {
//             // Create the payload for the post
//             const payload = {
//                 postedBy: user._id,
//                 text: postText,
//                 img: imgUrl,
//             };

//             // Only include targetAudience for teachers, set it to null for students
//             if (user.role === "teacher") {
//                 payload.targetAudience = targetAudience;
//             } else {
//                 payload.targetAudience = null; // Set to null for students
//             }

//             // Send the post request to the server
//             const res = await fetch("/api/posts/create", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const data = await res.json();
//             if (data.error) {
//                 showToast(t("Error"), data.error, "error");
//                 return;
//             }
//             showToast(t("Success"), t("Post created successfully"), "success");

//             // Add the new post to the state if it should be visible to the user
//             if (
//                 data.targetAudience === "all" ||
//                 data.targetAudience === user.yearGroup ||
//                 user.role === "student"
//             ) {
//                 if (username === user.username) {
//                     setPosts([data, ...posts]);
//                 }
//             }

//             // Reset form states after posting
//             onClose();
//             setPostText("");
//             setImgUrl("");
//             setTargetAudience(user.role === "teacher" ? "all" : ""); // Reset based on role

//         } catch (error) {
//             showToast(t("Error"), error.message, "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Button
//                 position={"fixed"}
//                 bottom={10}
//                 right={5}
//                 bg={useColorModeValue("gray.300", "gray.dark")}
//                 onClick={onOpen}
//                 size={{ base: "sm", sm: "md" }}
//                 aria-label={t("Create Post")}
//             >
//                 <AddIcon />
//             </Button>

//             <Modal isOpen={isOpen} onClose={onClose}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>{t("Create Post")}</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody pb={6}>
//                         <FormControl>
//                             <Textarea
//                                 placeholder={t('Post content goes here..')}
//                                 onChange={handleTextChange}
//                                 value={postText}
//                             />
//                             <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
//                                 {remainingChar}/{MAX_CHAR}
//                             </Text>

//                             <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
//                             <BsFillImageFill
//                                 style={{ marginLeft: "5px", cursor: "pointer" }}
//                                 size={16}
//                                 onClick={() => imageRef.current.click()}
//                                 aria-label={t("Add Image")}
//                             />

//                             {/* Dropdown for Target Audience */}
//                             {user.role === "teacher" && (
//                                 <Select
//                                     mt={4}
//                                     value={targetAudience}
//                                     onChange={(e) => setTargetAudience(e.target.value)}
//                                 >
//                                     <option value="all">{t("All Students")}</option>
//                                     <option value="Year 12">{t("Year 12")}</option>
//                                     <option value="Year 13">{t("Year 13")}</option>
//                                 </Select>
//                             )}
//                         </FormControl>

//                         {imgUrl && (
//                             <Flex mt={5} w={"full"} position={"relative"}>
//                                 <Image src={imgUrl} alt={t('Selected img')} />
//                                 <CloseButton
//                                     onClick={() => setImgUrl("")}
//                                     bg={"gray.800"}
//                                     position={"absolute"}
//                                     top={2}
//                                     right={2}
//                                 />
//                             </Flex>
//                         )}
//                     </ModalBody>

//                     <ModalFooter>
//                         <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
//                             {t("Post")}
//                         </Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// };

// export default CreatePost;

// oldhand create post function not working i think
// const handleCreatePost = async () => {
//     try {
//         const payload = {
//             postedBy: user._id,
//             text: postText,
//             img: imgUrl,
//             targetYearGroups: targetYearGroups.length ? targetYearGroups : ["all"],
//             targetDepartments: targetDepartments.length ? targetDepartments : [],
//         };

//         console.log("Posting payload:", payload);  // Add this line to log the payload

//         const res = await fetch("/api/posts/create", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         const data = await res.json();
//         if (data.error) throw new Error(data.error);

//         showToast(t("Success"), t("Post created successfully"), "success");
//         onClose();
//         setPostText("");
//         setImgUrl("");
//         setTargetYearGroups([]);
//         setTargetDepartments([]);
//     } catch (error) {
//         showToast(t("Error"), error.message, "error");
//     }
// };

// admin role update(working)
// import { AddIcon } from "@chakra-ui/icons";
// import {
//   Button,
//   CloseButton,
//   Flex,
//   FormControl,
//   Image,
//   Input,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Text,
//   Textarea,
//   useColorModeValue,
//   useDisclosure,
//   Select,
// } from "@chakra-ui/react";
// import { useRef, useState } from "react";
// import usePreviewImg from "../hooks/usePreviewImg";
// import { BsFillImageFill } from "react-icons/bs";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import useShowToast from "../hooks/useShowToast";
// import { useTranslation } from "react-i18next";

// const MAX_CHAR = 500;

// const CreatePost = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [postText, setPostText] = useState("");
//   const [targetYearGroups, setTargetYearGroups] = useState([]);
//   const [targetDepartments, setTargetDepartments] = useState([]);
//   const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
//   const imageRef = useRef(null);
//   const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
//   const user = useRecoilValue(userAtom);
//   const showToast = useShowToast();
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleTextChange = (e) => {
//     const inputText = e.target.value;
//     setPostText(inputText.slice(0, MAX_CHAR));
//     setRemainingChar(MAX_CHAR - inputText.length);
//   };

//   const handleCreatePost = async () => {
//     setIsLoading(true);
//     try {
//       // Default payload for all users, with special handling for different roles
//       const payload = {
//         postedBy: user._id,
//         text: postText,
//         targetAudience: "all",
//         targetYearGroups: [],
//         targetDepartments: [],
//       };

//       // Role-specific modifications
//       if (user.role === "teacher") {
//         if (targetYearGroups.length === 0) {
//           showToast(t("Error"), t("Teachers must specify year groups"), "error");
//           setIsLoading(false);
//           return;
//         }
//         payload.targetYearGroups = targetYearGroups;
//       }

//       if (user.role === "admin") {
//         if (!targetYearGroups.length && !targetDepartments.length) {
//           showToast(
//             t("Error"),
//             t("Admins must specify target year groups or departments"),
//             "error"
//           );
//           setIsLoading(false);
//           return;
//         }
//         payload.targetYearGroups = targetYearGroups;
//         payload.targetDepartments = targetDepartments;
//       }

//       if (imgUrl) payload.img = imgUrl;

//       const res = await fetch("/api/posts/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.error) {
//         showToast(t("Error"), data.error, "error");
//         return;
//       }

//       showToast(t("Success"), t("Post created successfully"), "success");

//       // Reset form
//       setPostText("");
//       setImgUrl("");
//       setTargetYearGroups([]);
//       setTargetDepartments([]);
//       onClose();
//     } catch (error) {
//       showToast(t("Error"), error.message, "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         position="fixed"
//         bottom={10}
//         right={5}
//         bg={useColorModeValue("gray.300", "gray.dark")}
//         onClick={onOpen}
//         size="md"
//         aria-label={t("Create Post")}
//       >
//         <AddIcon />
//       </Button>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>{t("Create Post")}</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl>
//               <Textarea
//                 placeholder={t("Write your post...")}
//                 value={postText}
//                 onChange={handleTextChange}
//               />
//               <Text fontSize="xs" fontWeight="bold" textAlign="right" m="1">
//                 {remainingChar}/{MAX_CHAR}
//               </Text>
//               <Input
//                 type="file"
//                 hidden
//                 ref={imageRef}
//                 onChange={handleImageChange}
//               />
//               <BsFillImageFill
//                 style={{ marginLeft: "5px", cursor: "pointer" }}
//                 size={16}
//                 onClick={() => imageRef.current.click()}
//                 aria-label={t("Add Image")}
//               />

//               {/* Role-specific Target Options */}
//               {user.role === "teacher" && (
//                 <Select
//                   mt={4}
//                   placeholder={t("Select Year Group(s)")}
//                   multiple
//                   value={targetYearGroups}
//                   onChange={(e) =>
//                     setTargetYearGroups(
//                       [...e.target.selectedOptions].map((o) => o.value)
//                     )
//                   }
//                 >
//                   <option value="all">{t("All Year Groups")}</option>
//                   <option value="Year 9">{t("Year 9")}</option>
//                   <option value="Year 10">{t("Year 10")}</option>
//                   <option value="Year 11">{t("Year 11")}</option>
//                   <option value="Year 12">{t("Year 12")}</option>
//                   <option value="Year 13">{t("Year 13")}</option>
//                 </Select>
//               )}

//               {user.role === "admin" && (
//                 <>
//                   <Select
//                     mt={4}
//                     placeholder={t("Select Year Group(s)")}
//                     multiple
//                     value={targetYearGroups}
//                     onChange={(e) =>
//                       setTargetYearGroups(
//                         [...e.target.selectedOptions].map((o) => o.value)
//                       )
//                     }
//                   >
//                     <option value="all">{t("All Year Groups")}</option>
//                     <option value="Year 9">{t("Year 9")}</option>
//                     <option value="Year 10">{t("Year 10")}</option>
//                     <option value="Year 11">{t("Year 11")}</option>
//                     <option value="Year 12">{t("Year 12")}</option>
//                     <option value="Year 13">{t("Year 13")}</option>
//                   </Select>

//                   <Select
//                     mt={4}
//                     placeholder={t("Select Department(s)")}
//                     multiple
//                     value={targetDepartments}
//                     onChange={(e) =>
//                       setTargetDepartments(
//                         [...e.target.selectedOptions].map((o) => o.value)
//                       )
//                     }
//                   >
//                     <option value="Math">{t("Math")}</option>
//                     <option value="Physics">{t("Physics")}</option>
//                     <option value="Chemistry">{t("Chemistry")}</option>
//                     <option value="Biology">{t("Biology")}</option>
//                     <option value="Geography">{t("Geography")}</option>
//                     <option value="Computer Science">
//                       {t("Computer Science")}
//                     </option>
//                     <option value="Arts">{t("Arts")}</option>
//                     <option value="History">{t("History")}</option>
//                     <option value="Psychology">{t("Psychology")}</option>
//                     <option value="Sociology">{t("Sociology")}</option>
//                     <option value="Economics">{t("Economics")}</option>
//                     <option value="Business">{t("Business")}</option>
//                     <option value="BTEC Business">{t("BTEC Business")}</option>
//                     <option value="BTEC Business">BTEC Business</option>
//                     <option value="tv">tv</option>
//                   </Select>
//                 </>
//               )}
//             </FormControl>

//             {imgUrl && (
//               <Flex mt={5} w="full" position="relative">
//                 <Image src={imgUrl} alt={t("Uploaded Image")} />
//                 <CloseButton
//                   position="absolute"
//                   top={2}
//                   right={2}
//                   onClick={() => setImgUrl("")}
//                 />
//               </Flex>
//             )}
//           </ModalBody>

//           <ModalFooter>
//             <Button
//               colorScheme="blue"
//               mr={3}
//               isLoading={isLoading}
//               onClick={handleCreatePost}
//             >
//               {t("Post")}
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default CreatePost;

// post review system
import { useState, useRef, useEffect } from 'react';
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  FormControl, Textarea, Input, useDisclosure, Progress, Box, Text, useColorModeValue,
  Alert, AlertIcon, Flex, Image, CloseButton, keyframes, Tooltip, Tag, TagLabel,
  TagCloseButton, Wrap, WrapItem, Menu, MenuButton, MenuList, MenuItem, IconButton,
  Stack, VStack
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from "react-i18next";
import { PiTelevisionSimpleBold } from "react-icons/pi";

const MAX_CHAR = 500;

const glowKeyframes = keyframes`
  0% { box-shadow: 0 0 5px rgba(56, 161, 105, 0.5); }
  50% { box-shadow: 0 0 15px rgba(56, 161, 105, 0.8); }
  100% { box-shadow: 0 0 5px rgba(56, 161, 105, 0.5); }
`;

const YEAR_GROUPS = [
  { value: "all", label: "All Year Groups" },
  { value: "Year 9", label: "Year 9" },
  { value: "Year 10", label: "Year 10" },
  { value: "Year 11", label: "Year 11" },
  { value: "Year 12", label: "Year 12" },
  { value: "Year 13", label: "Year 13" }
];

const DEPARTMENTS = [
  { value: "Math", label: "Math" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Geography", label: "Geography" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Arts", label: "Arts" },
  { value: "History", label: "History" },
  { value: "Psychology", label: "Psychology" },
  { value: "Sociology", label: "Sociology" },
  { value: "Economics", label: "Economics" },
  { value: "Business", label: "Business" },
  { value: "BTEC Business", label: "BTEC Business" },
  { value: "Physical Education", label: "Physical Education" },
  { value: "BTEC Sport", label: "BTEC Sport" },
  { value: "Music", label: "Music" },
  { value: "BTEC Music", label: "BTEC Music" },
  { value: "BTEC Art", label: "BTEC Art" },
  { value: "English", label: "English" },
  { value: "tv", label: "TV" }
];

const CreatePost = ({ triggerAnimation, animationStyle, showTutorial, onTutorialComplete, blurActive }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [targetYearGroups, setTargetYearGroups] = useState([]);
  const [targetDepartments, setTargetDepartments] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const { t } = useTranslation();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  const buttonBg = useColorModeValue("blue.500", "blue.200");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.300");

  const teacherAdminFeatures = [
    {
      title: "Select Year Group",
      description: "Post to specific year groups for targeted announcements.",
      content: (
        <Menu>
          <MenuButton as={Button} variant="outline" colorScheme="green">
            Select Year Groups
          </MenuButton>
          <MenuList>
            {YEAR_GROUPS.map((group) => (
              <MenuItem key={group.value}>{group.label}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      )
    },
    {
      title: "Posting Groups",
      description: "Customize a unique audience to reach specific groups.",
      content: (
        <Menu>
          <MenuButton as={Button} variant="outline" colorScheme="green">
            Select Groups
          </MenuButton>
          <MenuList>
            <MenuItem>Class Announcements</MenuItem>
            <MenuItem>Club Updates</MenuItem>
            <MenuItem>Event Notices</MenuItem>
          </MenuList>
        </Menu>
      )
    },
    {
      title: "Security",
      description: "Everything is saved and completely secure.",
      content: <FaLock size={24} color="#38A169" />
    },
    {
      title: "TV Posting",
      description: "Post directly to the screens, only on Pear.",
      content: <PiTelevisionSimpleBold size={24} color="#38A169" />
    }
  ];

  const studentFeatures = [
    {
      title: "Custom Feed",
      description: "Announcements, general posts, and events are all sent to your custom feed.",
      content: (
        <Box>
          <Text fontSize="sm" color="gray.400">Example Feed:</Text>
          <Text>Interhouse Rugby Next Week</Text>
        </Box>
      )
    },
    {
      title: "Security",
      description: "Everything is saved and completely secure.",
      content: <FaLock size={24} color="#38A169" />
    }
  ];

  const features = user?.role === "student" ? studentFeatures : teacherAdminFeatures;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (showTutorial) {
      const interval = setInterval(() => {
        setCurrentFeatureIndex((prev) => {
          if (prev === features.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              onTutorialComplete();
              onClose();
            }, 3000);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
      onOpen();
      return () => clearInterval(interval);
    }
  }, [showTutorial, features, onTutorialComplete, onOpen, onClose]);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setPostText(inputText.slice(0, MAX_CHAR));
    setRemainingChar(MAX_CHAR - inputText.length);
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      if (!postText.trim()) {
        showToast("Error", "Post text cannot be empty", "error");
        return;
      }
      const postData = {
        postedBy: user._id,
        text: postText,
        img: imgUrl || undefined,
        targetGroups: selectedGroups,
        isGeneral: selectedGroups.length === 0,
        targetYearGroups: targetYearGroups.length > 0 ? targetYearGroups : [],
        targetDepartments: targetDepartments.length > 0 ? targetDepartments : [],
      };
      switch (user.role) {
        case "student":
          postData.targetAudience = "all";
          postData.targetYearGroups = [];
          postData.targetDepartments = [];
          break;
        case "teacher":
          if (!targetYearGroups.length && !selectedGroups.length) {
            showToast("Error", "Please select at least one year group or posting group", "error");
            return;
          }
          postData.targetAudience = targetYearGroups.length > 0 ? targetYearGroups[0] : "all";
          break;
        case "admin":
          if (!targetYearGroups.length && !targetDepartments.length && !selectedGroups.length) {
            showToast("Error", "Please select at least one target audience", "error");
            return;
          }
          postData.targetAudience = targetYearGroups.length > 0 ? targetYearGroups[0] : targetDepartments.length > 0 ? targetDepartments[0] : "all";
          break;
        default:
          showToast("Error", "Invalid user role", "error");
          return;
      }
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      setPostStatus(data.reviewStatus || "approved");
      showToast("Success", "Post created successfully", "success");
      resetForm();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPostText("");
    setImgUrl("");
    setTargetYearGroups([]);
    setTargetDepartments([]);
    setSelectedGroups([]);
    setPostStatus(null);
    onClose();
  };

  const isMobile = screenSize.width < 768;
  const cardWidth = isMobile ? Math.min(320, screenSize.width * 0.85) : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile ? Math.min(480, screenSize.height * 0.7) : Math.min(550, screenSize.height * 0.7);
  const offsetMultiplier = isMobile ? 0.4 : 0.55;

  const getFeaturePosition = (index) => {
    if (index === currentFeatureIndex) return "center";
    if (index === currentFeatureIndex - 1) return "left";
    if (index === currentFeatureIndex + 1) return "right";
    return "hidden";
  };

  if (user?.isFrozen) return (
    <Button position="fixed" bottom={10} right={5} bg={buttonBg} _hover={{ bg: buttonHoverBg }} color="white" size="lg" aria-label="Account Frozen" zIndex={999}>
      <Flex align="center" gap={2}><FaLock /> {t("Account Frozen")}</Flex>
    </Button>
  );

  return (
    <>
      <Tooltip label="Create Post" placement="left" hasArrow openDelay={300}>
        <Button
          position="fixed"
          bottom={10}
          right={5}
          bg={buttonBg}
          color="white"
          onClick={onOpen}
          size="lg"
          aria-label={t("Create Post")}
          zIndex={999}
          _hover={{ bg: buttonHoverBg }}
          sx={animationStyle}
        >
          <AddIcon />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="none">
        {showTutorial && blurActive && (
          <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0, 0, 0, 0.4)" />
        )}
        {showTutorial ? (
          <>
            <Button
              position="absolute"
              top={isMobile ? "16px" : "20px"}
              right={isMobile ? "16px" : "20px"}
              width={isMobile ? "32px" : "36px"}
              height={isMobile ? "32px" : "36px"}
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              zIndex="1003"
              _hover={{ transform: "rotate(90deg)" }}
              onClick={() => {
                onTutorialComplete();
                onClose();
              }}
              p="0"
            >
              <Icon as={CloseIcon} />
            </Button>
            <Flex
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="100%"
              height="100%"
              justify="center"
              align="center"
              zIndex="1002"
              sx={{ perspective: "1000px" }}
            >
              {features.map((feature, index) => {
                const position = getFeaturePosition(index);
                let transform, opacity, zIndex;
                switch (position) {
                  case "left":
                    transform = `translateX(-${cardWidth * offsetMultiplier}px) rotateY(30deg) scale(0.9)`;
                    opacity = 0.7;
                    zIndex = 1;
                    break;
                  case "center":
                    transform = "translateX(0) rotateY(0deg) scale(1)";
                    opacity = 1;
                    zIndex = 2;
                    break;
                  case "right":
                    transform = `translateX(${cardWidth * offsetMultiplier}px) rotateY(-30deg) scale(0.9)`;
                    opacity = 0.7;
                    zIndex = 1;
                    break;
                  default:
                    transform = `translateX(${cardWidth * 1.1}px) rotateY(-30deg) scale(0.9)`;
                    opacity = 0;
                    zIndex = 0;
                    break;
                }
                return (
                  <Box
                    key={index}
                    position="absolute"
                    width={`${cardWidth}px`}
                    height={`${cardHeight}px`}
                    borderRadius="20px"
                    boxShadow="0 8px 16px rgba(0, 0, 0, 0.3)"
                    display="flex"
                    flexDirection="column"
                    overflow="hidden"
                    transition="transform 0.5s ease, opacity 0.5s ease"
                    transform={transform}
                    opacity={opacity}
                    zIndex={zIndex}
                    animation={`${glowKeyframes} 1.5s infinite`}
                  >
                    <Box position="relative" width="100%" height="100%" overflow="hidden" borderRadius="20px" bg="gray.800">
                      <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        width="100%"
                        height="70%"
                        background="linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0))"
                        zIndex="1"
                        pointerEvents="none"
                      />
                      {index === currentFeatureIndex && (
                        <Box position="absolute" top="20px" left="20px" bg="rgba(0, 0, 0, 0.5)" color="white" padding="8px 16px" borderRadius="20px" fontSize="14px" zIndex="3">
                          New
                        </Box>
                      )}
                      <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        width="100%"
                        height="50%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        padding="30px 20px"
                        color="white"
                        zIndex="2"
                      >
                        <Box as="h2" fontSize="32px" margin="0 0 10px 0" fontWeight="700" textShadow="0 2px 4px rgba(0, 0, 0, 0.8)">
                          {feature.title}
                        </Box>
                        <Box as="p" fontSize="16px" margin="0" textShadow="0 1px 3px rgba(0, 0, 0, 0.9)" lineHeight="1.6" fontWeight="500">
                          {feature.description}
                        </Box>
                      </Box>
                      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="3">
                        {feature.content}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          </>
        ) : (
          <ModalContent
            maxW="600px"
            borderRadius="20px"
            bg="gray.800"
            color="white"
          >
            <ModalHeader>{t("Create Post")}</ModalHeader>
            <ModalBody>
              <FormControl>
                <Textarea placeholder={t("Write your post...")} value={postText} onChange={handleTextChange} resize="vertical" minH="100px" />
                <Flex justify="space-between" align="center" mt={1}>
                  <Text fontSize="xs" fontWeight="bold" color={remainingChar < 0 ? "red.500" : "gray.500"}>{remainingChar}/{MAX_CHAR}</Text>
                  <Tooltip label="Add Image"><BsFillImageFill style={{ cursor: "pointer" }} size={16} onClick={() => imageRef.current.click()} /></Tooltip>
                  <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                </Flex>
                {user?.role !== "student" && (
                  <>
                    <Menu>
                      <MenuButton as={Button} variant="outline" mt={4} mr={2}>
                        Select Year Groups
                      </MenuButton>
                      <MenuList>
                        {YEAR_GROUPS.map((group) => (
                          <MenuItem key={group.value} onClick={() => setTargetYearGroups([group.value])}>
                            {group.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <Menu>
                      <MenuButton as={Button} variant="outline" mt={4}>
                        Select Departments
                      </MenuButton>
                      <MenuList>
                        {DEPARTMENTS.map((dept) => (
                          <MenuItem key={dept.value} onClick={() => setTargetDepartments([dept.value])}>
                            {dept.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCreatePost} isLoading={isLoading}>
                Post
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default CreatePost;