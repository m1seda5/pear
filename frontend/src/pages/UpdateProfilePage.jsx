// version one is working 
// import {
// 	Button,
// 	Flex,
// 	FormControl,
// 	FormLabel,
// 	Heading,
// 	Input,
// 	Stack,
// 	useColorModeValue,
// 	Avatar,
// 	Center,
// } from "@chakra-ui/react";
// import { useRef, useState } from "react";
// import { useRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import usePreviewImg from "../hooks/usePreviewImg";
// import useShowToast from "../hooks/useShowToast";

// export default function UpdateProfilePage() {
// 	const [user, setUser] = useRecoilState(userAtom);
// 	const [inputs, setInputs] = useState({
// 		name: user.name,
// 		username: user.username,
// 		email: user.email,
// 		bio: user.bio,
// 		password: "",
// 	});
// 	const fileRef = useRef(null);
// 	const [updating, setUpdating] = useState(false);

// 	const showToast = useShowToast();

// 	const { handleImageChange, imgUrl } = usePreviewImg();

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (updating) return;
// 		setUpdating(true);
// 		try {
// 			const res = await fetch(`/api/users/update/${user._id}`, {
// 				method: "PUT",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
// 			});
// 			const data = await res.json(); // updated user object
// 			if (data.error) {
// 				showToast("Error", data.error, "error");
// 				return;
// 			}
// 			showToast("Success", "Profile updated successfully", "success");
// 			setUser(data);
// 			localStorage.setItem("user-threads", JSON.stringify(data));
// 		} catch (error) {
// 			showToast("Error", error, "error");
// 		} finally {
// 			setUpdating(false);
// 		}
// 	};
// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<Flex align={"center"} justify={"center"} my={6}>
// 				<Stack
// 					spacing={4}
// 					w={"full"}
// 					maxW={"md"}
// 					bg={useColorModeValue("white", "gray.dark")}
// 					rounded={"xl"}
// 					boxShadow={"lg"}
// 					p={6}
// 				>
// 					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
// 						User Profile Edit
// 					</Heading>
// 					<FormControl id='userName'>
// 						<Stack direction={["column", "row"]} spacing={6}>
// 							<Center>
// 								<Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
// 							</Center>
// 							<Center w='full'>
// 								<Button w='full' onClick={() => fileRef.current.click()}>
// 									Change Avatar
// 								</Button>
// 								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
// 							</Center>
// 						</Stack>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>Full name</FormLabel>
// 						<Input
// 							placeholder='John Doe'
// 							value={inputs.name}
// 							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>User name</FormLabel>
// 						<Input
// 							placeholder='johndoe'
// 							value={inputs.username}
// 							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>Email address</FormLabel>
// 						<Input
// 							placeholder='your-email@example.com'
// 							value={inputs.email}
// 							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='email'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>Bio</FormLabel>
// 						<Input
// 							placeholder='Your bio.'
// 							value={inputs.bio}
// 							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>Password</FormLabel>
// 						<Input
// 							placeholder='password'
// 							value={inputs.password}
// 							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='password'
// 						/>
// 					</FormControl>
// 					<Stack spacing={6} direction={["column", "row"]}>
// 						<Button
// 							bg={"red.400"}
// 							color={"white"}
// 							w='full'
// 							_hover={{
// 								bg: "red.500",
// 							}}
// 						>
// 							Cancel
// 						</Button>
// 						<Button
// 							bg={"green.400"}
// 							color={"white"}
// 							w='full'
// 							_hover={{
// 								bg: "green.500",
// 							}}
// 							type='submit'
// 							isLoading={updating}
// 						>
// 							Submit
// 						</Button>
// 					</Stack>
// 				</Stack>
// 			</Flex>
// 		</form>
// 	);
// }


// this is version with updated trabsaltions  working 
// import {
// 	Button,
// 	Flex,
// 	FormControl,
// 	FormLabel,
// 	Heading,
// 	Input,
// 	Stack,
// 	useColorModeValue,
// 	Avatar,
// 	Center,
// } from "@chakra-ui/react";
// import { useRef, useState, useEffect } from "react";
// import { useRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import usePreviewImg from "../hooks/usePreviewImg";
// import useShowToast from "../hooks/useShowToast";
// import { useTranslation } from 'react-i18next'; // Import useTranslation

// export default function UpdateProfilePage() {
// 	const [user, setUser] = useRecoilState(userAtom);
// 	const [inputs, setInputs] = useState({
// 		name: user.name,
// 		username: user.username,
// 		email: user.email,
// 		bio: user.bio,
// 		password: "",
// 	});
// 	const fileRef = useRef(null);
// 	const [updating, setUpdating] = useState(false);

// 	const showToast = useShowToast();
// 	const { handleImageChange, imgUrl } = usePreviewImg();
// 	const { t, i18n } = useTranslation(); // Initialize the translation hook
// 	const [language, setLanguage] = useState(i18n.language); // Add a state for language

// 	// Handle language change
// 	useEffect(() => {
// 		const handleLanguageChange = (lng) => {
// 			setLanguage(lng);
// 		};

// 		i18n.on('languageChanged', handleLanguageChange);

// 		return () => {
// 			i18n.off('languageChanged', handleLanguageChange);
// 		};
// 	}, [i18n]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (updating) return;
// 		setUpdating(true);
// 		try {
// 			const res = await fetch(`/api/users/update/${user._id}`, {
// 				method: "PUT",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
// 			});
// 			const data = await res.json();
// 			if (data.error) {
// 				showToast(t("Error"), data.error, "error"); // Translate error message
// 				return;
// 			}
// 			showToast(t("Success"), t("Profile updated successfully"), "success"); // Translate success message
// 			setUser(data);
// 			localStorage.setItem("user-threads", JSON.stringify(data));
// 		} catch (error) {
// 			showToast(t("Error"), error.message, "error"); // Translate error message
// 		} finally {
// 			setUpdating(false);
// 		}
// 	};

// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<Flex align={"center"} justify={"center"} my={6}>
// 				<Stack
// 					spacing={4}
// 					w={"full"}
// 					maxW={"md"}
// 					bg={useColorModeValue("white", "gray.dark")}
// 					rounded={"xl"}
// 					boxShadow={"lg"}
// 					p={6}
// 				>
// 					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
// 						{t("User Profile Edit")} 
// 					</Heading>
// 					<FormControl id='userName'>
// 						<Stack direction={["column", "row"]} spacing={6}>
// 							<Center>
// 								<Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
// 							</Center>
// 							<Center w='full'>
// 								<Button w='full' onClick={() => fileRef.current.click()}>
// 									{t("Change Avatar")} 
// 								</Button>
// 								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
// 							</Center>
// 						</Stack>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>{t("Full name")}</FormLabel> 
// 						<Input
// 							placeholder={t("John Doe")} 
// 							value={inputs.name}
// 							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>{t("User name")}</FormLabel> 
// 						<Input
// 							placeholder={t("johndoe")} 
// 							value={inputs.username}
// 							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>{t("Email address")}</FormLabel> 
// 						<Input
// 							placeholder={t("your-email@example.com")} 
// 							value={inputs.email}
// 							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='email'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>{t("Bio")}</FormLabel> 
// 						<Input
// 							placeholder={t("Your bio.")} 
// 							value={inputs.bio}
// 							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='text'
// 						/>
// 					</FormControl>
// 					<FormControl>
// 						<FormLabel>{t("Password")}</FormLabel>
// 						<Input
// 							placeholder={t("password")} 
// 							value={inputs.password}
// 							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 							_placeholder={{ color: "gray.500" }}
// 							type='password'
// 						/>
// 					</FormControl>
// 					<Stack spacing={6} direction={["column", "row"]}>
// 						<Button
// 							bg={"red.400"}
// 							color={"white"}
// 							w='full'
// 							_hover={{ bg: "red.500" }}
// 						>
// 							{t("Cancel")} 
// 						</Button>
// 						<Button
// 							bg={"green.400"}
// 							color={"white"}
// 							w='full'
// 							_hover={{ bg: "green.500" }}
// 							type='submit'
// 							isLoading={updating}
// 						>
// 							{t("Submit")} 
// 						</Button>
// 					</Stack>
// 				</Stack>
// 			</Flex>
// 		</form>
// 	);
// }

// delte butoon update

import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	CloseButton, // Import CloseButton
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const navigate = useNavigate(); // Initialize useNavigate
	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();
	const { t, i18n } = useTranslation(); // Initialize the translation hook
	const [language, setLanguage] = useState(i18n.language); // Add a state for language

	// Handle language change
	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setLanguage(lng);
		};

		i18n.on('languageChanged', handleLanguageChange);

		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast(t("Error"), data.error, "error"); // Translate error message
				return;
			}
			showToast(t("Success"), t("Profile updated successfully"), "success"); // Translate success message             
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast(t("Error"), error.message, "error"); // Translate error message
		} finally {
			setUpdating(false);
		}
	};

	// Handle delete button click
	const handleDelete = () => {
		// Redirect to the user profile page
		navigate(`/${user.username}`); // Use the username to navigate to the profile page
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={6}
					position="relative" // Set position relative for CloseButton positioning
				>
					<CloseButton
						position="absolute"
						top={2}
						right={2}
						onClick={handleDelete} // Add the delete button handler
					/>

					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						{t("User Profile Edit")} 
					</Heading>
					<FormControl id='userName'>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
							</Center>
							<Center w='full'>
								<Button w='full' onClick={() => fileRef.current.click()}>
									{t("Change Avatar")} 
								</Button>
								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>{t("Full name")}</FormLabel> 
						<Input
							placeholder={t("John Doe")} 
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>{t("User name")}</FormLabel> 
						<Input
							placeholder={t("johndoe")} 
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>{t("Email address")}</FormLabel> 
						<Input
							placeholder={t("your-email@example.com")} 
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='email'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>{t("Bio")}</FormLabel> 
						<Input
							placeholder={t("Your bio.")} 
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
						/>
					</FormControl>
					<FormControl>
						<FormLabel>{t("Password")}</FormLabel>
						<Input
							placeholder={t("password")} 
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='password'
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w='full'
							_hover={{ bg: "red.500" }}
						>
							{t("Cancel")} 
						</Button>
						<Button
							bg={"green.400"}
							color={"white"}
							w='full'
							_hover={{ bg: "green.500" }}
							type='submit'
							isLoading={updating}
						>
							{t("Submit")} 
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
