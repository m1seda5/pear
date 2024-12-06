// // original
import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    Select,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const [targetAudience, setTargetAudience] = useState("all"); // Default to 'all'
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();
    const { t } = useTranslation();

    const handleTextChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            // Create the payload for the post
            const payload = {
                postedBy: user._id,
                text: postText,
                img: imgUrl,
            };

            // Only include targetAudience for teachers, set it to null for students
            if (user.role === "teacher") {
                payload.targetAudience = targetAudience;
            } else {
                payload.targetAudience = null; // Set to null for students
            }

            // Send the post request to the server
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.error) {
                showToast(t("Error"), data.error, "error");
                return;
            }
            showToast(t("Success"), t("Post created successfully"), "success");

            // Add the new post to the state if it should be visible to the user
            if (
                data.targetAudience === "all" ||
                data.targetAudience === user.yearGroup ||
                user.role === "student"
            ) {
                if (username === user.username) {
                    setPosts([data, ...posts]);
                }
            }

            // Reset form states after posting
            onClose();
            setPostText("");
            setImgUrl("");
            setTargetAudience(user.role === "teacher" ? "all" : ""); // Reset based on role

        } catch (error) {
            showToast(t("Error"), error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
                aria-label={t("Create Post")}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t("Create Post")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder={t('Post content goes here..')}
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                                aria-label={t("Add Image")}
                            />

                            {/* Dropdown for Target Audience */}
                            {user.role === "teacher" && (
                                <Select
                                    mt={4}
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                >
                                    <option value="all">{t("All Students")}</option>
                                    <option value="Year 12">{t("Year 12")}</option>
                                    <option value="Year 13">{t("Year 13")}</option>
                                </Select>
                            )}
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt={t('Selected img')} />
                                <CloseButton
                                    onClick={() => setImgUrl("")}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            {t("Post")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;

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

// admin role update
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