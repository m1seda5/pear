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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  Textarea,
  Input,
  useDisclosure,
  Progress,
  Box,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  Flex,
  Image,
  CloseButton,
  keyframes,
  Tooltip,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from "react-i18next";

const MAX_CHAR = 500;

// Define the pulse animation
const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.4);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 20px 10px rgba(49, 130, 206, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(49, 130, 206, 0);
  }
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

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [targetYearGroups, setTargetYearGroups] = useState([]);
  const [targetDepartments, setTargetDepartments] = useState([]);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const progressColor = useColorModeValue("gray.200", "gray.600");
  const progressFilledColor = useColorModeValue("gray.500", "gray.300");
  const { t } = useTranslation();
  const [isPulsing, setIsPulsing] = useState(false);
  const buttonBg = useColorModeValue("blue.500", "blue.200");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.300");
  const tagBg = useColorModeValue("blue.100", "blue.700");
  const menuBg = useColorModeValue("white", "gray.700");

  // Add pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setPostText(inputText.slice(0, MAX_CHAR));
    setRemainingChar(MAX_CHAR - inputText.length);
  };

  const handleAddYearGroup = (value) => {
    // If all is selected, clear other selections
    if (value === "all") {
      setTargetYearGroups(["all"]);
      return;
    }
    
    // If adding a specific year group, remove "all" if present
    const newGroups = targetYearGroups.filter(group => group !== "all");
    
    // Add the new year group if not already selected
    if (!newGroups.includes(value)) {
      setTargetYearGroups([...newGroups, value]);
    }
  };

  const handleRemoveYearGroup = (value) => {
    setTargetYearGroups(targetYearGroups.filter(group => group !== value));
  };

  const handleAddDepartment = (value) => {
    // If tv is selected, clear other selections
    if (value === "tv") {
      setTargetDepartments(["tv"]);
      return;
    }
    
    // If adding a department, remove "tv" if present
    const newDepts = targetDepartments.filter(dept => dept !== "tv");
    
    // Add the new department if not already selected
    if (!newDepts.includes(value)) {
      setTargetDepartments([...newDepts, value]);
    }
  };

  const handleRemoveDepartment = (value) => {
    setTargetDepartments(targetDepartments.filter(dept => dept !== value));
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      if (!postText.trim()) {
        showToast("Error", "Post text cannot be empty", "error");
        setIsLoading(false);
        return;
      }
  
      // Base payload structure
      const payload = {
        postedBy: user._id,
        text: postText,
        img: imgUrl || undefined
      };
  
      // Role-specific payload modifications
      switch (user.role) {
        case "student":
          // Students can only post to everyone
          payload.targetAudience = "all";
          payload.targetYearGroups = [];
          payload.targetDepartments = [];
          break;
  
        case "teacher":
          // Teachers must specify year groups
          if (!targetYearGroups.length) {
            showToast("Error", "Please select at least one year group", "error");
            setIsLoading(false);
            return;
          }
  
          // If "all" is selected, that's the only target
          if (targetYearGroups.includes("all")) {
            payload.targetAudience = "all";
            payload.targetYearGroups = [];
          } else {
            // Otherwise use specific year groups
            payload.targetAudience = targetYearGroups[0]; // Primary target
            payload.targetYearGroups = targetYearGroups; // All selected groups
          }
          payload.targetDepartments = []; // Teachers can't target departments
          break;
  
        case "admin":
          // Admins must specify either year groups or departments
          if (!targetYearGroups.length && !targetDepartments.length) {
            showToast(
              "Error", 
              "Please select either year groups or departments to target", 
              "error"
            );
            setIsLoading(false);
            return;
          }
  
          // Handle year group targeting
          if (targetYearGroups.includes("all")) {
            payload.targetAudience = "all";
            payload.targetYearGroups = [];
          } else if (targetYearGroups.length) {
            payload.targetYearGroups = targetYearGroups;
            payload.targetAudience = targetYearGroups[0];
          }
  
          // Handle department targeting
          if (targetDepartments.length) {
            // If both year groups and departments are selected, 
            // departments take precedence
            payload.targetDepartments = targetDepartments;
            payload.targetAudience = targetDepartments[0];
          }
  
          // Handle TV targeting
          if (targetDepartments.includes("tv")) {
            payload.targetAudience = "tv";
            payload.targetDepartments = ["tv"];
            payload.targetYearGroups = [];
          }
          break;
  
        default:
          showToast("Error", "Invalid user role", "error");
          setIsLoading(false);
          return;
      }
  
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
  
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
  
      // Success handling
      showToast("Success", "Post created successfully", "success");
      
      // Reset form
      setPostText("");
      setImgUrl("");
      setTargetYearGroups([]);
      setTargetDepartments([]);
      onClose();
  
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
    onClose();
  };
  
  // Return frozen account button if account is frozen
  if (user?.isFrozen) {
    return (
      <Button
        position="fixed"
        bottom={10}
        right={5}
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
        color="white"
        size="lg"
        aria-label="Account Frozen"
        zIndex={999}
      >
        <Flex align="center" gap={2}>
          <FaLock /> {t("Account Frozen")}
        </Flex>
      </Button>
    );
  }

  // Get available year groups that aren't already selected
  const availableYearGroups = YEAR_GROUPS.filter(
    group => !targetYearGroups.includes(group.value) || 
    // If all is selected, no other options should be available
    (targetYearGroups.includes("all") && group.value === "all")
  );

  // Get available departments that aren't already selected
  const availableDepartments = DEPARTMENTS.filter(
    dept => !targetDepartments.includes(dept.value) ||
    // If TV is selected, no other options should be available
    (targetDepartments.includes("tv") && dept.value === "tv")
  );

  return (
    <>
      <Tooltip 
        label="Create Post" 
        placement="left" 
        hasArrow 
        openDelay={300}
      >
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
          animation={isPulsing ? `${pulseKeyframes} 1s ease-in-out` : undefined}
          transform="auto"
          _hover={{
            bg: buttonHoverBg,
          }}
        >
          <AddIcon />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Create Post")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder={t("Write your post...")}
                value={postText}
                onChange={handleTextChange}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign="right"
                m="1"
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <Tooltip label="Add Image" placement="top" hasArrow>
                <Box as="span" display="inline-block">
                  <BsFillImageFill
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                    size={16}
                    onClick={() => imageRef.current.click()}
                    aria-label={t("Add Image")}
                  />
                </Box>
              </Tooltip>

              {/* Year Group Selection for Teachers and Admins */}
              {(user.role === "teacher" || user.role === "admin") && (
                <Box mt={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="medium">{t("Year Groups")}</Text>
                    <Menu placement="bottom-end">
                      <MenuButton 
                        as={IconButton}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        icon={<AddIcon />}
                        isDisabled={
                          availableYearGroups.length === 0 || 
                          targetYearGroups.includes("all")
                        }
                      />
                      <MenuList bg={menuBg} maxH="200px" overflowY="auto">
                        {availableYearGroups.map((group) => (
                          <MenuItem 
                            key={group.value}
                            onClick={() => handleAddYearGroup(group.value)}
                          >
                            {t(group.label)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                  <Wrap spacing={2} mb={3}>
                    {targetYearGroups.length === 0 ? (
                      <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        {t("No year groups selected")}
                      </Text>
                    ) : (
                      targetYearGroups.map((group) => (
                        <WrapItem key={group}>
                          <Tag 
                            size="md" 
                            borderRadius="full" 
                            variant="solid" 
                            colorScheme="blue"
                            bg={tagBg}
                          >
                            <TagLabel>
                              {t(YEAR_GROUPS.find(g => g.value === group)?.label || group)}
                            </TagLabel>
                            <TagCloseButton onClick={() => handleRemoveYearGroup(group)} />
                          </Tag>
                        </WrapItem>
                      ))
                    )}
                  </Wrap>
                </Box>
              )}

              {/* Department Selection for Admins */}
              {user.role === "admin" && (
                <Box mt={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="medium">{t("Departments")}</Text>
                    <Menu placement="bottom-end">
                      <MenuButton 
                        as={IconButton}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        icon={<AddIcon />}
                        isDisabled={
                          availableDepartments.length === 0 || 
                          targetDepartments.includes("tv")
                        }
                      />
                      <MenuList bg={menuBg} maxH="200px" overflowY="auto">
                        {availableDepartments.map((dept) => (
                          <MenuItem 
                            key={dept.value}
                            onClick={() => handleAddDepartment(dept.value)}
                          >
                            {t(dept.label)}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                  <Wrap spacing={2}>
                    {targetDepartments.length === 0 ? (
                      <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        {t("No departments selected")}
                      </Text>
                    ) : (
                      targetDepartments.map((dept) => (
                        <WrapItem key={dept}>
                          <Tag 
                            size="md" 
                            borderRadius="full" 
                            variant="solid" 
                            colorScheme={dept === "tv" ? "red" : "green"}
                            bg={tagBg}
                          >
                            <TagLabel>
                              {t(DEPARTMENTS.find(d => d.value === dept)?.label || dept)}
                            </TagLabel>
                            <TagCloseButton onClick={() => handleRemoveDepartment(dept)} />
                          </Tag>
                        </WrapItem>
                      ))
                    )}
                  </Wrap>
                </Box>
              )}

              {imgUrl && (
                <Flex mt={5} w="full" position="relative">
                  <Image src={imgUrl} alt={t("Uploaded Image")} />
                  <CloseButton
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => setImgUrl("")}
                  />
                </Flex>
              )}

              {postStatus === 'pending' && (
                <Box mt={4}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    {t("Your post is being reviewed")}
                  </Alert>
                  <Progress
                    mt={2}
                    size="xs"
                    isIndeterminate
                    bg={progressColor}
                    color={progressFilledColor}
                    borderRadius="full"
                  />
                </Box>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isLoading}
              onClick={handleCreatePost}
              isDisabled={postStatus === 'pending'}
            >
              {t("Post")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;