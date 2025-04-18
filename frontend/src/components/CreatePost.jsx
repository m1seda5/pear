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
  ModalCloseButton, FormControl, Textarea, Input, useDisclosure, Progress, Box,
  Text, useColorModeValue, Alert, AlertIcon, Flex, Image, CloseButton, keyframes,
  Tooltip, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, Menu, MenuButton,
  MenuList, MenuItem, IconButton, Stack
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from "react-i18next";
import CreateGroup from "./CreateGroup";


const MAX_CHAR = 500;

const pulseKeyframes = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(49, 130, 206, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
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
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const progressColor = useColorModeValue("gray.200", "gray.600");
  const { t } = useTranslation();
  const [isPulsing, setIsPulsing] = useState(false);
  const buttonBg = useColorModeValue("blue.500", "blue.200");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.300");
  const tagBg = useColorModeValue("blue.100", "blue.700");
  const menuBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/groups/my-groups", {
          credentials: "include", // Ensure auth token is sent
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch groups: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        setAvailableGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch groups error:", error);
        showToast("Error", "Failed to load groups", "error");
        setAvailableGroups([]);
      }
    };
    fetchGroups();
  }, [user, showToast]);

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

  const handleGroupToggle = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleGroupDetails = (group) => {
    // Placeholder for group details functionality
    console.log("Group details:", group);
  };

  const handleAddYearGroup = (value) => {
    if (value === "all") {
      setTargetYearGroups(["all"]);
      return;
    }
    const newGroups = targetYearGroups.filter(group => group !== "all");
    if (!newGroups.includes(value)) {
      setTargetYearGroups([...newGroups, value]);
    }
  };

  const handleRemoveYearGroup = (value) => {
    setTargetYearGroups(targetYearGroups.filter(group => group !== value));
  };

  const handleAddDepartment = (value) => {
    if (value === "tv") {
      setTargetDepartments(["tv"]);
      return;
    }
    const newDepts = targetDepartments.filter(dept => dept !== "tv");
    if (!newDepts.includes(value)) {
      setTargetDepartments([...newDepts, value]);
    }
  };

  const handleRemoveDepartment = (value) => {
    setTargetDepartments(targetDepartments.filter(dept => dept !== value));
  };

  const handleGroupCreated = (newGroup) => {
    setAvailableGroups(prev => [...prev, newGroup]);
    setSelectedGroups(prev => [...prev, newGroup._id]);
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
          postData.targetAudience = 
            targetYearGroups.length > 0 ? targetYearGroups[0] :
            targetDepartments.length > 0 ? targetDepartments[0] : "all";
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
      console.error("Create post error:", error);
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

  const availableYearGroupsList = YEAR_GROUPS.filter(
    group => !targetYearGroups.includes(group.value) || 
    (targetYearGroups.includes("all") && group.value === "all")
  );

  const availableDepartmentsList = DEPARTMENTS.filter(
    dept => !targetDepartments.includes(dept.value) ||
    (targetDepartments.includes("tv") && dept.value === "tv")
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
          animation={isPulsing ? `${pulseKeyframes} 1s ease-in-out` : undefined}
          _hover={{ bg: buttonHoverBg }}
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
              <Stack spacing={4}>
                <Box>
                  <Textarea
                    placeholder={t("Write your post...")}
                    value={postText}
                    onChange={handleTextChange}
                    resize="vertical"
                    minH="100px"
                  />
                  <Flex justify="space-between" align="center" mt={1}>
                    <Text fontSize="xs" fontWeight="bold" color={remainingChar < 0 ? "red.500" : "gray.500"}>
                      {remainingChar}/{MAX_CHAR}
                    </Text>
                    <Tooltip label="Add Image" placement="top" hasArrow>
                      <Box as="span">
                        <BsFillImageFill
                          style={{ cursor: "pointer" }}
                          size={16}
                          onClick={() => imageRef.current.click()}
                          aria-label={t("Add Image")}
                        />
                      </Box>
                    </Tooltip>
                    <Input
                      type="file"
                      hidden
                      ref={imageRef}
                      onChange={handleImageChange}
                    />
                  </Flex>
                </Box>

                {(user.role === "teacher" || user.role === "admin") && (
                  <>
                    <Box>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="medium">{t("Year Groups")}</Text>
                        <Menu placement="bottom-end">
                          <MenuButton
                            as={IconButton}
                            size="sm"
o                            colorScheme="blue"
                            variant="outline"
                            icon={<AddIcon />}
                            isDisabled={availableYearGroupsList.length === 0 || targetYearGroups.includes("all")}
                          />
                          <MenuList bg={menuBg} maxH="200px" overflowY="auto">
                            {availableYearGroupsList.map((group) => (
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
                      <Wrap spacing={2}>
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
                                <TagLabel>{t(YEAR_GROUPS.find(g => g.value === group)?.label || group)}</TagLabel>
                                <TagCloseButton onClick={() => handleRemoveYearGroup(group)} />
                              </Tag>
                            </WrapItem>
                          ))
                        )}
                      </Wrap>
                    </Box>
                  </>
                )}

                {user.role === "admin" && (
                  <Box>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="medium">{t("Departments")}</Text>
                      <Menu placement="bottom-end">
                        <MenuButton
                          as={IconButton}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          icon={<AddIcon />}
                          isDisabled={availableDepartmentsList.length === 0 || targetDepartments.includes("tv")}
                        />
                        <MenuList bg={menuBg} maxH="200px" overflowY="auto">
                          {availableDepartmentsList.map((dept) => (
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
                              <TagLabel>{t(DEPARTMENTS.find(d => d.value === dept)?.label || dept)}</TagLabel>
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
                    <Image src={imgUrl} alt={t("Uploaded Image")} borderRadius="md" />
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
                      colorScheme="blue"
                      borderRadius="full"
                    />
                  </Box>
                )}

                {availableGroups.length > 0 && (
                  <Box>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="medium">{t("Post to Group")}</Text>
                      <CreateGroup onGroupCreated={handleGroupCreated} />
                    </Flex>
                    <Wrap spacing={2}>
                      {availableGroups.map(group => (
                        <WrapItem key={group._id}>
                          <Tag
                            size="md"
                            variant={selectedGroups.includes(group._id) ? "solid" : "outline"}
                            colorScheme="blue"
                            cursor="pointer"
                            onClick={() => handleGroupToggle(group._id)}
                            onDoubleClick={() => handleGroupDetails(group)}
                            bg={selectedGroups.includes(group._id) ? group.color : undefined}
                            _hover={{ opacity: 0.8 }}
                          >
                            <TagLabel>{group.name}</TagLabel>
                            {selectedGroups.includes(group._id) && (
                              <TagCloseButton onClick={() => handleGroupToggle(group._id)} />
                            )}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}
              </Stack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={resetForm} isDisabled={isLoading}>
              {t("Cancel")}
            </Button>
            <Button
              colorScheme="blue"
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