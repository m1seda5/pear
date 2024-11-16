// this is the originl
// import {
// 	Flex,
// 	Box,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	InputGroup,
// 	HStack,
// 	InputRightElement,
// 	Stack,
// 	Button,
// 	Heading,
// 	Text,
// 	useColorModeValue,
// 	Link,
// 	Select,
// 	Checkbox,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { useSetRecoilState } from "recoil";
// import authScreenAtom from "../atoms/authAtom";
// import useShowToast from "../hooks/useShowToast";
// import userAtom from "../atoms/userAtom";

// export default function SignupCard() {
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [isStudent, setIsStudent] = useState(false);
// 	const [yearGroup, setYearGroup] = useState("");
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);
// 	const [inputs, setInputs] = useState({
// 		name: "",
// 		username: "",
// 		email: "",
// 		password: "",
// 	});

// 	const showToast = useShowToast();
// 	const setUser = useSetRecoilState(userAtom);

// 	const handleSignup = async () => {
// 		try {
// 			const res = await fetch("/api/users/signup", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					...inputs,
// 					yearGroup: isStudent ? yearGroup : null, // Include year group only if they are a student
// 				}),
// 			});
// 			const data = await res.json();

// 			if (data.error) {
// 				showToast("Error", data.error, "error");
// 				return;
// 			}

// 			localStorage.setItem("user-threads", JSON.stringify(data));
// 			setUser(data);
// 		} catch (error) {
// 			showToast("Error", error, "error");
// 		}
// 	};

// 	return (
// 		<Flex align={"center"} justify={"center"}>
// 			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
// 				<Stack align={"center"}>
// 					<Heading fontSize={"4xl"} textAlign={"center"}>
// 						Sign up
// 					</Heading>
// 				</Stack>
// 				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
// 					<Stack spacing={4}>
// 						<HStack>
// 							<Box>
// 								<FormControl isRequired>
// 									<FormLabel>Full name</FormLabel>
// 									<Input
// 										type='text'
// 										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
// 										value={inputs.name}
// 									/>
// 								</FormControl>
// 							</Box>
// 							<Box>
// 								<FormControl isRequired>
// 									<FormLabel>Username</FormLabel>
// 									<Input
// 										type='text'
// 										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
// 										value={inputs.username}
// 									/>
// 								</FormControl>
// 							</Box>
// 						</HStack>
// 						<FormControl isRequired>
// 							<FormLabel>Email address</FormLabel>
// 							<Input
// 								type='email'
// 								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
// 								value={inputs.email}
// 							/>
// 						</FormControl>
// 						<FormControl isRequired>
// 							<FormLabel>Password</FormLabel>
// 							<InputGroup>
// 								<Input
// 									type={showPassword ? "text" : "password"}
// 									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 									value={inputs.password}
// 								/>
// 								<InputRightElement h={"full"}>
// 									<Button
// 										variant={"ghost"}
// 										onClick={() => setShowPassword((showPassword) => !showPassword)}
// 									>
// 										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
// 									</Button>
// 								</InputRightElement>
// 							</InputGroup>
// 						</FormControl>

// 						{/* Checkbox for Are You a Student? */}
// 						<FormControl>
// 							<Checkbox isChecked={isStudent} onChange={(e) => setIsStudent(e.target.checked)}>
// 								Are you a student?
// 							</Checkbox>
// 						</FormControl>

// 						{/* Year Group Selection */}
// 						{isStudent && (
// 							<FormControl isRequired>
// 								<FormLabel>Select Year Group</FormLabel>
// 								<Select
// 									placeholder="Select Year Group"
// 									onChange={(e) => setYearGroup(e.target.value)}
// 								>
// 									<option value="Year 12">Year 12</option>
// 									<option value="Year 13">Year 13</option>
// 								</Select>
// 							</FormControl>
// 						)}

// 						<Stack spacing={10} pt={2}>
// 							<Button
// 								loadingText='Submitting'
// 								size='lg'
// 								bg={useColorModeValue("gray.600", "gray.700")}
// 								color={"white"}
// 								_hover={{
// 									bg: useColorModeValue("gray.700", "gray.800"),
// 								}}
// 								onClick={handleSignup}
// 							>
// 								Sign up
// 							</Button>
// 						</Stack>
// 						<Stack pt={6}>
// 							<Text align={"center"}>
// 								Already a user?{" "}
// 								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
// 									Login
// 								</Link>
// 							</Text>
// 						</Stack>
// 					</Stack>
// 				</Box>
// 			</Stack>
// 		</Flex>
// 	);
// }


// admin role update
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Select,
	Checkbox,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useSetRecoilState } from "recoil";
  import authScreenAtom from "../atoms/authAtom";
  import useShowToast from "../hooks/useShowToast";
  import userAtom from "../atoms/userAtom";
  
  export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const [isStudent, setIsStudent] = useState(false);
	const [isTeacher, setIsTeacher] = useState(false);
	const [yearGroup, setYearGroup] = useState("");
	const [department, setDepartment] = useState("");
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
	  name: "",
	  username: "",
	  email: "",
	  password: "",
	});
  
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
  
	const handleRoleSelection = (role) => {
	  if (role === "student") {
		setIsStudent(true);
		setIsTeacher(false);
		setInputs({ ...inputs, role: "student" });
	  } else if (role === "teacher") {
		setIsTeacher(true);
		setIsStudent(false);
		setInputs({ ...inputs, role: "teacher" });
	  }
	};
  
	const handleSignup = async () => {
	  // Check if student has selected a year group and teacher has selected a department
	  if (isStudent && !yearGroup) {
		showToast("Error", "Please select a year group.", "error");
		return;
	  }
	  if (isTeacher && !department) {
		showToast("Error", "Please select a department.", "error");
		return;
	  }
  
	  try {
		const res = await fetch("/api/users/signup", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			...inputs,
			isStudent,  // Send the isStudent flag
			isTeacher,  // Send the isTeacher flag
			yearGroup: isStudent ? yearGroup : null,  // Only send yearGroup if student
			department: isTeacher ? department : null,  // Only send department if teacher
		  }),
		});
  
		const data = await res.json();
  
		if (data.error) {
		  showToast("Error", data.error, "error");
		  return;
		}
  
		localStorage.setItem("user-threads", JSON.stringify(data));
		setUser(data);
	  } catch (error) {
		showToast("Error", error.message, "error");
	  }
	};
  
	return (
	  <Flex align={"center"} justify={"center"}>
		<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
		  <Stack align={"center"}>
			<Heading fontSize={"4xl"} textAlign={"center"}>
			  Sign up
			</Heading>
		  </Stack>
		  <Box
			rounded={"lg"}
			bg={useColorModeValue("white", "gray.dark")}
			boxShadow={"lg"}
			p={8}
		  >
			<Stack spacing={4}>
			  <HStack>
				<Box>
				  <FormControl isRequired>
					<FormLabel>Full name</FormLabel>
					<Input
					  type="text"
					  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
					  value={inputs.name}
					/>
				  </FormControl>
				</Box>
				<Box>
				  <FormControl isRequired>
					<FormLabel>Username</FormLabel>
					<Input
					  type="text"
					  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					  value={inputs.username}
					/>
				  </FormControl>
				</Box>
			  </HStack>
			  <FormControl isRequired>
				<FormLabel>Email address</FormLabel>
				<Input
				  type="email"
				  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				  value={inputs.email}
				/>
			  </FormControl>
			  <FormControl isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
				  <Input
					type={showPassword ? "text" : "password"}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					value={inputs.password}
				  />
				  <InputRightElement h={"full"}>
					<Button
					  variant={"ghost"}
					  onClick={() => setShowPassword((show) => !show)}
					>
					  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				  </InputRightElement>
				</InputGroup>
			  </FormControl>
  
			  {/* Role Selection */}
			  <FormControl>
				<Checkbox
				  isChecked={isStudent}
				  onChange={() => handleRoleSelection("student")}
				>
				  Are you a student?
				</Checkbox>
				<Checkbox
				  isChecked={isTeacher}
				  onChange={() => handleRoleSelection("teacher")}
				>
				  Are you a teacher?
				</Checkbox>
			  </FormControl>
  
			  {/* Year Group Selection for Students */}
			  {isStudent && (
				<FormControl isRequired>
				  <FormLabel>Select Year Group</FormLabel>
				  <Select
					placeholder="Select Year Group"
					onChange={(e) => setYearGroup(e.target.value)}
				  >
					<option value="Year 9">Year 9</option>
					<option value="Year 10">Year 10</option>
					<option value="Year 11">Year 11</option>
					<option value="Year 12">Year 12</option>
					<option value="Year 13">Year 13</option>
				  </Select>
				</FormControl>
			  )}
  
			  {/* Department Selection for Teachers */}
			  {isTeacher && (
				<FormControl isRequired>
				  <FormLabel>Select Department</FormLabel>
				  <Select
					placeholder="Select Department"
					onChange={(e) => setDepartment(e.target.value)}
				  >
					<option value="Math">Math</option>
					<option value="Science">Science</option>
					<option value="English">English</option>
					<option value="Geography">Geography</option>
					<option value="History">History</option>
					<option value="Art">Art</option>
					<option value="PE">Physical Education</option>
					<option value="Music">Music</option>
					<option value="ICT">ICT</option>
				  </Select>
				</FormControl>
			  )}
  
			  <Stack spacing={10} pt={2}>
				<Button
				  loadingText="Submitting"
				  size="lg"
				  bg={useColorModeValue("gray.600", "gray.700")}
				  color={"white"}
				  _hover={{
					bg: useColorModeValue("gray.700", "gray.800"),
				  }}
				  onClick={handleSignup}
				>
				  Sign up
				</Button>
			  </Stack>
			  <Stack pt={6}>
				<Text align={"center"}>
				  Already a user?{" "}
				  <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
					Login
				  </Link>
				</Text>
			  </Stack>
			</Stack>
		  </Box>
		</Stack>
	  </Flex>
	);
  }
  



