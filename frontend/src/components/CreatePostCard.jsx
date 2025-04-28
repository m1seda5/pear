import { useState, useRef } from 'react';
import {
  Box, Flex, Avatar, Button, Textarea, Input, Text, useColorModeValue, Image, CloseButton, Stack, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, Menu, MenuButton, MenuList, MenuItem, IconButton, Tooltip, Select
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { AddIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from "react-i18next";

const MAX_CHAR = 500;
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

export default function CreatePostCard({ onPostCreated }) {
  const user = useRecoilValue(userAtom);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [targetYearGroups, setTargetYearGroups] = useState([]);
  const [targetDepartments, setTargetDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();
  const { t } = useTranslation();

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setPostText(inputText.slice(0, MAX_CHAR));
    setRemainingChar(MAX_CHAR - inputText.length);
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

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      if (!postText.trim()) {
        showToast("Error", "Post text cannot be empty", "error");
        setIsLoading(false);
        return;
      }
      const postData = {
        postedBy: user._id,
        text: postText,
        img: imgUrl || undefined,
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
          if (!targetYearGroups.length) {
            showToast("Error", "Please select at least one year group", "error");
            setIsLoading(false);
            return;
          }
          postData.targetAudience = targetYearGroups[0];
          break;
        case "admin":
          if (!targetYearGroups.length && !targetDepartments.length) {
            showToast("Error", "Please select at least one year group or department", "error");
            setIsLoading(false);
            return;
          }
          postData.targetAudience = targetYearGroups[0] || targetDepartments[0];
          break;
        default:
          showToast("Error", "Invalid user role", "error");
          setIsLoading(false);
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
      showToast("Success", "Post created successfully", "success");
      setPostText("");
      setImgUrl("");
      setTargetYearGroups([]);
      setTargetDepartments([]);
      setRemainingChar(MAX_CHAR);
      if (onPostCreated) onPostCreated(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const availableYearGroupsList = YEAR_GROUPS.filter(
    group => !targetYearGroups.includes(group.value) || 
    (targetYearGroups.includes("all") && group.value === "all")
  );
  const availableDepartmentsList = DEPARTMENTS.filter(
    dept => !targetDepartments.includes(dept.value) ||
    (targetDepartments.includes("tv") && dept.value === "tv")
  );

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={6}
      boxShadow="sm"
      maxW="800px"
      mx="auto"
      bg={useColorModeValue("white", "gray.800")}
    >
      <Flex align="center" mb={4} gap={3}>
        <Avatar src={user?.profilePic || "/user-profile.png"} size="md" />
        <Text fontWeight="bold" fontSize="lg">{user?.username}</Text>
      </Flex>
      <Stack spacing={4}>
        <Textarea
          placeholder={"Share some what you are thinking?"}
          value={postText}
          onChange={handleTextChange}
          resize="vertical"
          minH="80px"
        />
        <Flex justify="space-between" align="center">
          <Text fontSize="xs" color="gray.500">{remainingChar}/{MAX_CHAR}</Text>
          <Flex gap={2}>
            <Tooltip label="Add Image" placement="top" hasArrow>
              <Box as="span">
                <BsFillImageFill
                  style={{ cursor: "pointer" }}
                  size={20}
                  onClick={() => imageRef.current.click()}
                  aria-label="Add Image"
                />
                <Input
                  type="file"
                  hidden
                  ref={imageRef}
                  onChange={handleImageChange}
                />
              </Box>
            </Tooltip>
          </Flex>
        </Flex>
        {imgUrl && (
          <Flex mt={2} w="full" position="relative">
            <Image src={imgUrl} alt="Uploaded" borderRadius="md" maxH="200px" />
            <CloseButton
              position="absolute"
              top={2}
              right={2}
              onClick={() => setImgUrl("")}
            />
          </Flex>
        )}
        {(user.role === "teacher" || user.role === "admin") && (
          <Box>
            <Text fontWeight="medium" mb={1}>Year Groups</Text>
            <Wrap spacing={2} mb={2}>
              {targetYearGroups.length === 0 ? (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  No year groups selected
                </Text>
              ) : (
                targetYearGroups.map((group) => (
                  <WrapItem key={group}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{YEAR_GROUPS.find(g => g.value === group)?.label || group}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveYearGroup(group)} />
                    </Tag>
                  </WrapItem>
                ))
              )}
            </Wrap>
            <Menu>
              <MenuButton as={IconButton} icon={<AddIcon />} size="sm" colorScheme="blue" variant="outline" isDisabled={availableYearGroupsList.length === 0 || targetYearGroups.includes("all")} />
              <MenuList>
                {availableYearGroupsList.map((group) => (
                  <MenuItem key={group.value} onClick={() => handleAddYearGroup(group.value)}>
                    {group.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        )}
        {user.role === "admin" && (
          <Box>
            <Text fontWeight="medium" mb={1}>Departments</Text>
            <Wrap spacing={2} mb={2}>
              {targetDepartments.length === 0 ? (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  No departments selected
                </Text>
              ) : (
                targetDepartments.map((dept) => (
                  <WrapItem key={dept}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme={dept === "tv" ? "red" : "green"}>
                      <TagLabel>{DEPARTMENTS.find(d => d.value === dept)?.label || dept}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveDepartment(dept)} />
                    </Tag>
                  </WrapItem>
                ))
              )}
            </Wrap>
            <Menu>
              <MenuButton as={IconButton} icon={<AddIcon />} size="sm" colorScheme="blue" variant="outline" isDisabled={availableDepartmentsList.length === 0 || targetDepartments.includes("tv")} />
              <MenuList>
                {availableDepartmentsList.map((dept) => (
                  <MenuItem key={dept.value} onClick={() => handleAddDepartment(dept.value)}>
                    {dept.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        )}
        <Button colorScheme="blue" onClick={handleCreatePost} isLoading={isLoading} alignSelf="flex-end">
          Post
        </Button>
      </Stack>
    </Box>
  );
} 