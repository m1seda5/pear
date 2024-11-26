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


// admin role update
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
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
  Checkbox,
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
import { useTranslation } from "react-i18next";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [isTargetStudents, setIsTargetStudents] = useState(false);
  const [isTargetTeachers, setIsTargetTeachers] = useState(false);
  const [targetYearGroups, setTargetYearGroups] = useState([]);
  const [targetDepartments, setTargetDepartments] = useState([]);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const { t } = useTranslation();

  const yearGroups = ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"];
  const departments = [
    "Math",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "Computer Science",
    "Arts",
    "History",
    "Psychology",
    "Sociology",
    "Economics",
    "Business",
    "BTEC Business",
  ];

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const payload = {
        postedBy: user._id,
        text: postText,
        img: imgUrl,
        targetYearGroups: targetYearGroups.length ? targetYearGroups : ["all"],
        targetDepartments: targetDepartments.length ? targetDepartments : [],
      };

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) {
        showToast(t("Error"), data.error, "error");
        return;
      }

      showToast(t("Success"), t("Post created successfully"), "success");
      setPosts([data, ...posts]);
      onClose();
      setPostText("");
      setImgUrl("");
      setIsTargetStudents(false);
      setIsTargetTeachers(false);
      setTargetYearGroups([]);
      setTargetDepartments([]);
    } catch (error) {
      showToast(t("Error"), error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position="fixed"
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
                placeholder={t("Post content goes here..")}
                onChange={(e) => setPostText(e.target.value)}
                value={postText}
              />
              <Text fontSize="xs" textAlign="right" mt={1}>
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
                aria-label={t("Add Image")}
              />

              <FormControl mt={4}>
                <Checkbox
                  isChecked={isTargetStudents}
                  onChange={(e) => setIsTargetStudents(e.target.checked)}
                >
                  Target Students
                </Checkbox>
                <Checkbox
                  isChecked={isTargetTeachers}
                  onChange={(e) => setIsTargetTeachers(e.target.checked)}
                >
                  Target Teachers
                </Checkbox>
              </FormControl>

              {isTargetStudents && (
                <FormControl mt={4}>
                  <FormLabel>Year Group</FormLabel>
                  <Select
                    multiple
                    value={targetYearGroups}
                    onChange={(e) =>
                      setTargetYearGroups(
                        Array.from(e.target.selectedOptions).map((opt) => opt.value)
                      )
                    }
                  >
                    {yearGroups.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {isTargetTeachers && (
                <FormControl mt={4}>
                  <FormLabel>Department</FormLabel>
                  <Select
                    multiple
                    value={targetDepartments}
                    onChange={(e) =>
                      setTargetDepartments(
                        Array.from(e.target.selectedOptions).map((opt) => opt.value)
                      )
                    }
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
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

