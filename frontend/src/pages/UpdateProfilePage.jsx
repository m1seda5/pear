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
	CloseButton,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom';
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from 'react-i18next';
import { Navigate } from "react-router-dom";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user?.name || "",
		username: user?.username || "",
		email: user?.email || "",
		bio: user?.bio || "",
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const navigate = useNavigate();
	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);

	// Add authentication check
	if (!user || !user.token) {
		return <Navigate to="/auth" />;
	}

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
				showToast(t("Error"), data.error, "error");
				return;
			}
			showToast(t("Success"), t("Profile updated successfully"), "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast(t("Error"), error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	// Handle delete button click
	const handleDelete = () => {
		navigate(`/${user.username}`);
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
					position="relative"
				>
					<CloseButton
						position="absolute"
						top={2}
						right={2}
						onClick={handleDelete}
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
