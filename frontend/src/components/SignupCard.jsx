// // this is the originl
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

// admin role update(working)
// import React, { useState } from "react";
// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   InputGroup,
//   HStack,
//   InputRightElement,
//   Stack,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
//   Link,
//   Select,
//   Checkbox,
// } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { useSetRecoilState } from "recoil";
// import authScreenAtom from "../atoms/authAtom";
// import useShowToast from "../hooks/useShowToast";
// import userAtom from "../atoms/userAtom";

// const SignupCard = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isStudent, setIsStudent] = useState(false);
//   const [isTeacher, setIsTeacher] = useState(false);
//   const [yearGroup, setYearGroup] = useState("");
//   const [department, setDepartment] = useState("");
//   const [inputs, setInputs] = useState({
//     name: "",
//     username: "",
//     email: "",
//     password: "",
//   });

//   const setAuthScreen = useSetRecoilState(authScreenAtom);
//   const showToast = useShowToast();
//   const setUser = useSetRecoilState(userAtom);

//   const handleSignup = async () => {
//     try {
//       const role =
//         isStudent && yearGroup ? "student" :
//         isTeacher && department ? "teacher" :
//         (inputs.email.toLowerCase().includes("admin") ||
//          inputs.username.toLowerCase().includes("admin")) ? "admin" :
//         "student";

//       const signupData = {
//         name: inputs.name,
//         email: inputs.email,
//         username: inputs.username,
//         password: inputs.password,
//         role,
//         ...(role === "student" ? { yearGroup } : {}),
//         ...(role === "teacher" ? { department } : {}),
//       };

//       const res = await fetch("/api/users/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signupData),
//       });

//       const data = await res.json();

//       if (data.error) {
//         showToast("Error", data.error, "error");
//         return;
//       }

//       console.log("Signup successful:", data);
//       localStorage.setItem("user-threads", JSON.stringify(data));
//       setUser(data);
//     } catch (error) {
//       console.error("Error in handleSignup:", error);
//       showToast("Error", error.message, "error");
//     }
//   };

//   return (
//     <Flex align={"center"} justify={"center"}>
//       <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
//         <Stack align={"center"}>
//           <Heading fontSize={"4xl"} textAlign={"center"}>
//             Sign up
//           </Heading>
//         </Stack>
//         <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
//           <Stack spacing={4}>
//             <HStack>
//               <Box>
//                 <FormControl isRequired>
//                   <FormLabel>Full name</FormLabel>
//                   <Input
//                     type="text"
//                     onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
//                     value={inputs.name}
//                   />
//                 </FormControl>
//               </Box>
//               <Box>
//                 <FormControl isRequired>
//                   <FormLabel>Username</FormLabel>
//                   <Input
//                     type="text"
//                     onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
//                     value={inputs.username}
//                   />
//                 </FormControl>
//               </Box>
//             </HStack>
//             <FormControl isRequired>
//               <FormLabel>Email address</FormLabel>
//               <Input
//                 type="email"
//                 onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
//                 value={inputs.email}
//               />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
//                   value={inputs.password}
//                 />
//                 <InputRightElement h={"full"}>
//                   <Button
//                     variant={"ghost"}
//                     onClick={() => setShowPassword((showPassword) => !showPassword)}
//                   >
//                     {showPassword ? <ViewIcon /> : <ViewOffIcon />}
//                   </Button>
//                 </InputRightElement>
//               </InputGroup>
//             </FormControl>

//             {/* Role Selection */}
//             <FormControl>
//               <Checkbox isChecked={isStudent} onChange={(e) => setIsStudent(e.target.checked)}>
//                 Are you a student?
//               </Checkbox>
//               <Checkbox isChecked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)}>
//                 Are you a teacher?
//               </Checkbox>
//             </FormControl>

//             {/* Year Group Selection (Visible only for students) */}
//             {isStudent && (
//               <FormControl isRequired>
//                 <FormLabel>Select Year Group</FormLabel>
//                 <Select
//                   placeholder="Select Year Group"
//                   onChange={(e) => setYearGroup(e.target.value)}
//                 >
//                   <option value="Year 9">Year 9</option>
//                   <option value="Year 10">Year 10</option>
//                   <option value="Year 11">Year 11</option>
//                   <option value="Year 12">Year 12</option>
//                   <option value="Year 13">Year 13</option>
//                 </Select>
//               </FormControl>
//             )}
//             {/* Department Selection (Visible only for teachers) */}
//             {isTeacher && (
//               <FormControl isRequired>
//                 <FormLabel>Select Department</FormLabel>
//                 <Select
//                   placeholder="Select Department"
//                   onChange={(e) => setDepartment(e.target.value)}
//                 >
//                 <option value="Mathematics">Math</option>
//                 <option value="Chemistry">Chemistry</option>
//                 <option value="Biology">Biology</option>
//                 <option value="Physics">Science</option>
//                 <option value="Computer Science">Computer Science</option>
//                 <option value="BTEC Business">BTEC Business</option>
//                 <option value="BTEC Sport">BTEC Sport</option>
//                 <option value="BTEC Art">BTEC Art</option>
//                 <option value="BTEC Music">BTEC Music</option>
//                 <option value="Buisness">Business</option>
//                 <option value="Economics">Economics</option>
//                 <option value="English">English</option>
//                 <option value="History">History</option>
//                 <option value="Sociology">Sociology</option>
//                 <option value="Psychology">Psychology</option>
//                 <option value="Geography">Geography</option>
//                 <option value="Arts">Arts</option>
//                 <option value="Music">Music</option>
//                 <option value="Physical Education">Physical Education</option>
// </Select>
//               </FormControl>
//             )}

//             <Stack spacing={10} pt={2}>
//               <Button
//                 loadingText="Submitting"
//                 size="lg"
//                 bg={useColorModeValue("gray.600", "gray.700")}
//                 color={"white"}
//                 _hover={{
//                   bg: useColorModeValue("gray.700", "gray.800"),
//                 }}
//                 onClick={handleSignup}
//               >
//                 Sign up
//               </Button>
//             </Stack>
//             <Stack pt={6}>
//               <Text align={"center"}>
//                 Already a user?{" "}
//                 <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
//                   Login
//                 </Link>
//               </Text>
//             </Stack>
//           </Stack>
//         </Box>
//       </Stack>
//     </Flex>
//   );
// };

// export default SignupCard;

// // email verification update(working)
// import React, { useState, useEffect } from "react";
// import {
//   Flex,
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   InputGroup,
//   HStack,
//   InputRightElement,
//   Stack,
//   Button,
//   Heading,
//   Text,
//   useColorModeValue,
//   Link,
//   Select,
//   Checkbox,
// } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { useSetRecoilState } from "recoil";
// import authScreenAtom from "../atoms/authAtom";
// import useShowToast from "../hooks/useShowToast";
// import userAtom from "../atoms/userAtom";
// import axios from "axios";

// const SignupCard = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isStudent, setIsStudent] = useState(false);
//   const [isTeacher, setIsTeacher] = useState(false);
//   const [yearGroup, setYearGroup] = useState("");
//   const [department, setDepartment] = useState("");
//   const [inputs, setInputs] = useState({
//     name: "",
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [formData, setFormData] = useState({
//     otp: "",
//   });
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [timer, setTimer] = useState(120);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   const setAuthScreen = useSetRecoilState(authScreenAtom);
//   const showToast = useShowToast();
//   const setUser = useSetRecoilState(userAtom);

//   useEffect(() => {
//     let interval;
//     if (isOtpSent && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             setIsResendDisabled(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isOtpSent, timer]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const sendOtp = async (isResend = false) => {
//     try {
//       const role =
//         isStudent && yearGroup
//           ? "student"
//           : isTeacher && department
//           ? "teacher"
//           : inputs.email.toLowerCase().includes("pear")
//           ? "admin"
//           : "student";

//       const signupData = {
//         name: inputs.name,
//         email: inputs.email,
//         username: inputs.username,
//         password: inputs.password,
//         role,
//         ...(role === "student" ? { yearGroup } : {}),
//         ...(role === "teacher" ? { department } : {})
//       };

//       if (isResend) {
//         await axios.post("/api/users/resend-otp", { email: inputs.email });
//       } else {
//         await axios.post("/api/users/signup", signupData);
//       }

//       setIsOtpSent(true);
//       setTimer(120);
//       setIsResendDisabled(true);
//       showToast("Success", `OTP ${isResend ? 're-' : ''}sent to your email`, "success");
//     } catch (error) {
//       console.error("Error sending OTP:", error.response?.data || error.message);
//       setErrorMessage(error.response?.data?.error || "Error sending OTP");
//       showToast("Error", errorMessage, "error");
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const numericOTP = parseInt(formData.otp, 10);
//       if (isNaN(numericOTP)) {
//         setErrorMessage("OTP must be a numeric value");
//         return;
//       }

//       const response = await axios.post("/api/users/verify-otp", {
//         email: inputs.email,
//         otp: numericOTP,
//       });

//       setIsOtpVerified(true);
//       setErrorMessage("");
//       showToast("Success", "OTP verified successfully", "success");
//     } catch (error) {
//       console.error("Verify OTP error:", error.response?.data?.error || error.message);
//       setErrorMessage(error.response?.data?.error || "Failed to verify OTP");

//       if (error.response?.status === 429) {
//         setIsOtpSent(false);
//         setFormData({ otp: "" });
//       }
//     }
//   };

//   const handleSignup = async () => {
//     if (!isOtpVerified) {
//       setErrorMessage("Please verify your OTP before signing up");
//       return;
//     }

//     try {
//       const res = await fetch("/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: inputs.username,
//           password: inputs.password,
//         }),
//       });

//       const data = await res.json();

//       if (data.error) {
//         showToast("Error", data.error, "error");
//         return;
//       }

//       localStorage.setItem("user-threads", JSON.stringify(data));
//       setUser(data);
//       showToast("Success", "Signup successful!", "success");
//     } catch (error) {
//       showToast("Error", error.message, "error");
//     }
//   };

//   return (
//     <Flex align={"center"} justify={"center"}>
//       <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
//         <Stack align={"center"}>
//           <Heading fontSize={"4xl"} textAlign={"center"}>
//             Sign up
//           </Heading>
//         </Stack>
//         <Box
//           rounded={"lg"}
//           bg={useColorModeValue("white", "gray.dark")}
//           boxShadow={"lg"}
//           p={8}
//         >
//           <Stack spacing={4}>
//             <HStack>
//               <Box>
//                 <FormControl isRequired>
//                   <FormLabel>Full name</FormLabel>
//                   <Input
//                     type="text"
//                     onChange={(e) =>
//                       setInputs({ ...inputs, name: e.target.value })
//                     }
//                     value={inputs.name}
//                   />
//                 </FormControl>
//               </Box>
//               <Box>
//                 <FormControl isRequired>
//                   <FormLabel>Username</FormLabel>
//                   <Input
//                     type="text"
//                     onChange={(e) =>
//                       setInputs({ ...inputs, username: e.target.value })
//                     }
//                     value={inputs.username}
//                   />
//                 </FormControl>
//               </Box>
//             </HStack>
//             <FormControl isRequired>
//               <FormLabel>Email address</FormLabel>
//               <Input
//                 type="email"
//                 onChange={(e) =>
//                   setInputs({ ...inputs, email: e.target.value })
//                 }
//                 value={inputs.email}
//               />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Password</FormLabel>
//               <InputGroup>
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   onChange={(e) =>
//                     setInputs({ ...inputs, password: e.target.value })
//                   }
//                   value={inputs.password}
//                 />
//                 <InputRightElement h={"full"}>
//                   <Button
//                     variant={"ghost"}
//                     onClick={() =>
//                       setShowPassword((showPassword) => !showPassword)
//                     }
//                   >
//                     {showPassword ? <ViewIcon /> : <ViewOffIcon />}
//                   </Button>
//                 </InputRightElement>
//               </InputGroup>
//             </FormControl>

//             <FormControl>
//               <Checkbox
//                 isChecked={isStudent}
//                 onChange={(e) => setIsStudent(e.target.checked)}
//               >
//                 Are you a student?
//               </Checkbox>
//               <Checkbox
//                 isChecked={isTeacher}
//                 onChange={(e) => setIsTeacher(e.target.checked)}
//               >
//                 Are you a teacher?
//               </Checkbox>
//             </FormControl>

//             {isStudent && (
//               <FormControl isRequired>
//                 <FormLabel>Select Year Group</FormLabel>
//                 <Select
//                   placeholder="Select Year Group"
//                   onChange={(e) => setYearGroup(e.target.value)}
//                 >
//                   <option value="Year 9">Year 9</option>
//                   <option value="Year 10">Year 10</option>
//                   <option value="Year 11">Year 11</option>
//                   <option value="Year 12">Year 12</option>
//                   <option value="Year 13">Year 13</option>
//                 </Select>
//               </FormControl>
//             )}

//             {isTeacher && (
//               <FormControl isRequired>
//                 <FormLabel>Select Department</FormLabel>
//                 <Select
//                   placeholder="Select Department"
//                   onChange={(e) => setDepartment(e.target.value)}
//                 >
//                   <option value="Mathematics">Math</option>
//                   <option value="Chemistry">Chemistry</option>
//                   <option value="Biology">Biology</option>
//                   <option value="Physics">Science</option>
//                   <option value="Computer Science">Computer Science</option>
//                   <option value="BTEC Business">BTEC Business</option>
//                   <option value="BTEC Sport">BTEC Sport</option>
//                   <option value="BTEC Art">BTEC Art</option>
//                   <option value="BTEC Music">BTEC Music</option>
//                   <option value="Buisness">Business</option>
//                   <option value="Economics">Economics</option>
//                   <option value="English">English</option>
//                   <option value="History">History</option>
//                   <option value="Sociology">Sociology</option>
//                   <option value="Psychology">Psychology</option>
//                   <option value="Geography">Geography</option>
//                   <option value="Arts">Arts</option>
//                   <option value="Music">Music</option>
//                   <option value="Physical Education">Physical Education</option>
//                   <option value="media">Pear Media</option>
//                 </Select>
//               </FormControl>
//             )}

//             {!isOtpSent && (
//               <Button colorScheme="blue" onClick={() => sendOtp(false)}>
//                 Verify Email
//               </Button>
//             )}

//             {isOtpSent && (
//               <FormControl isRequired>
//                 <FormLabel>Enter OTP</FormLabel>
//                 <Input
//                   type="text"
//                   name="otp"
//                   value={formData.otp}
//                   onChange={handleChange}
//                   maxLength={4}
//                 />
//                 <Stack direction="row" spacing={4} mt={2}>
//                   <Button
//                     onClick={verifyOtp}
//                     disabled={isOtpVerified}
//                     colorScheme="green"
//                   >
//                     Verify OTP
//                   </Button>
//                   <Button
//                     onClick={() => sendOtp(true)}
//                     isDisabled={isResendDisabled || isOtpVerified}
//                   >
//                     Resend OTP {timer > 0 && `(${timer}s)`}
//                   </Button>
//                 </Stack>
//                 {errorMessage && <Text color="red.500">{errorMessage}</Text>}
//               </FormControl>
//             )}

//             <Stack spacing={10} pt={2}>
//               <Button
//                 size="lg"
//                 bg={useColorModeValue("gray.600", "gray.700")}
//                 color={"white"}
//                 _hover={{
//                   bg: useColorModeValue("gray.700", "gray.800"),
//                 }}
//                 onClick={handleSignup}
//                 disabled={!isOtpVerified}
//               >
//                 Sign up
//               </Button>
//             </Stack>

//             <Stack pt={6}>
//               <Text align={"center"}>
//                 Already a user?{" "}
//                 <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
//                   Login
//                 </Link>
//               </Text>
//             </Stack>
//           </Stack>
//         </Box>
//       </Stack>
//     </Flex>
//   );
// };

// export default SignupCard;

// this is the brookhouse update and stuff

import React, { useState, useEffect } from "react";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import axios from "axios";

const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [yearGroup, setYearGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(600); // 3 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [campus, setCampus] = useState("");
  const [response, setResponse] = useState(null);

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  // Keep all existing validation functions and effects
  const validateEmailFormat = (email) => {
    if (!email) return "Email is required";

    const emailLower = email.toLowerCase();

    // Allow pear admin emails
    if (emailLower.includes("pear")) {
      return "";
    }

    // Check for Brookhouse domain
    if (!emailLower.includes("brookhouse.ac.ke")) {
      return "Please use your Brookhouse email address";
    }

    return "";
  };

  const validateUsernameFormat = (username, email) => {
    if (!username || !email) return "";

    const emailLower = email.toLowerCase();

    // Special case for pear admin accounts
    if (emailLower.includes("pear")) {
      if (!username.toLowerCase().includes("pear")) {
        return 'Admin usernames must contain "pear"';
      }
      return "";
    }

    // Extract surname from email (everything after first letter before @)
    const userIdentifier = emailLower.split("@")[0];
    const surname = userIdentifier.slice(1);

    if (!username.toLowerCase().includes(surname.toLowerCase())) {
      return `Username must contain your surname (${surname})`;
    }

    return "";
  };

  useEffect(() => {
    if (inputs.email) {
      const error = validateEmailFormat(inputs.email);
      setEmailError(error);

      const email = inputs.email.toLowerCase();

      // Handle pear admin accounts
      if (email.includes("pear")) {
        setIsStudent(false);
        setIsTeacher(false);
        setIsAdmin(true);
        setCampus("admin");
        return;
      }

      setIsAdmin(false);

      // Determine campus and role for Brookhouse accounts
      const isRunda = email.includes("runda");
      setCampus(isRunda ? "runda" : "karen");

      const isStudentEmail = email.includes("students");
      setIsStudent(isStudentEmail);
      setIsTeacher(!isStudentEmail);
    }
  }, [inputs.email]);

  useEffect(() => {
    if (inputs.username && inputs.email) {
      const error = validateUsernameFormat(inputs.username, inputs.email);
      setUsernameError(error);
    }
  }, [inputs.username, inputs.email]);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // Replace the entire handleSignup function with:
  useEffect(() => {
    if (isOtpVerified && response) {
      // Automatically log user in after successful verification
      localStorage.setItem("user-threads", JSON.stringify(response.data));
      setUser(response.data);
      window.location.href = "/"; // Force refresh to trigger feed load
    }
  }, [isOtpVerified, response, setUser]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      setIsResendDisabled(true);
      setErrorMessage("");

      const response = await axios.post("/api/users/resend-otp", {
        email: inputs.email,
      });

      if (response.data.message) {
        setTimer(600); // Reset timer to 3 minutes
        setResendAttempts((prev) => prev + 1);
        showToast("Success", "New OTP sent successfully", "success");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to resend OTP";
      setErrorMessage(errorMsg);
      showToast("Error", errorMsg, "error");

      // If we got a 429 (too many attempts), keep the resend button disabled
      if (error.response?.status !== 429) {
        setIsResendDisabled(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (!inputs.email || !inputs.password || !inputs.name || !inputs.username) {
      showToast("Error", "All fields are required", "error");
      return false;
    }

    if (emailError) {
      showToast("Error", emailError, "error");
      return false;
    }

    if (usernameError) {
      showToast("Error", usernameError, "error");
      return false;
    }

    if (!isAdmin) {
      if (isStudent && !yearGroup) {
        showToast("Error", "Please select your year group", "error");
        return false;
      }

      if (isTeacher && !department) {
        showToast("Error", "Please select your department", "error");
        return false;
      }
    }

    return true;
  };

  const sendOtp = async (isResend = false) => {
    try {
      if (!validateForm()) return;

      let role = "admin";
      if (!isAdmin) {
        role = isStudent ? "student" : "teacher";
      }

      const signupData = {
        name: inputs.name,
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
        role,
        ...(campus !== "admin" ? { campus: campus.toLowerCase() } : {}),
        ...(role === "student" ? { yearGroup } : {}),
        ...(role === "teacher" ? { department } : {}),
      };

      if (isResend) {
        await axios.post("/api/users/resend-otp", { email: inputs.email });
      } else {
        await axios.post("/api/users/signup", signupData);
      }

      setIsOtpSent(true);
      setTimer(600); // Changed from 120 to 600 seconds (10 minutes)
      setIsResendDisabled(true);
      showToast(
        "Success",
        `OTP ${
          isResend ? "re-" : ""
        }sent to your email. Please verify within 10 minutes.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
      setErrorMessage(error.response?.data?.error || "Error sending OTP");
      showToast(
        "Error",
        error.response?.data?.error || "Error sending OTP",
        "error"
      );
    }
  };

  const verifyOtp = async () => {
    try {
      const numericOTP = parseInt(formData.otp, 10);
      if (isNaN(numericOTP)) {
        setErrorMessage("OTP must be a numeric value");
        return;
      }

      const response = await axios.post("/api/users/verify-otp", {
        email: inputs.email,
        otp: numericOTP,
      });

      if (response.data._id) {
        // Store the response for the useEffect to handle
        setResponse(response);
        setIsOtpVerified(true);

        // Show success message
        showToast("Success", "Account created successfully!", "success");
      } else {
        setIsOtpVerified(true);
        setErrorMessage("");
        showToast("Success", "OTP verified successfully", "success");
      }
    } catch (error) {
      // Error handling
      console.error(
        "Verify OTP error:",
        error.response?.data?.error || error.message
      );
      setErrorMessage(error.response?.data?.error || "Failed to verify OTP");

      if (error.response?.status === 429) {
        setIsOtpSent(false);
        setFormData({ otp: "" });
      }
    }
  };

  // Remove the entire handleSignup function and any related login calls
  // The OTP verification should handle complete login

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up {campus && `(${campus})`}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {/* Name and Username fields */}
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    value={inputs.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired isInvalid={!!usernameError}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    value={inputs.username}
                  />
                  {usernameError && (
                    <FormErrorMessage>{usernameError}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </HStack>

            {/* Email field */}
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
                placeholder={
                  isAdmin ? "example@pear.com" : "example@brookhouse.ac.ke"
                }
              />
              {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
            </FormControl>

            {/* Password field */}
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Role checkboxes */}
            {!isAdmin && (
              <FormControl>
                <Checkbox isChecked={isStudent} isDisabled={true}>
                  Student Account
                </Checkbox>
                <Checkbox isChecked={isTeacher} isDisabled={true}>
                  Teacher Account
                </Checkbox>
              </FormControl>
            )}

            {/* Year Group select for students */}
            {isStudent && !isAdmin && (
              <FormControl isRequired>
                <FormLabel>Select Year Group</FormLabel>
                <Select
                  placeholder="Select Year Group"
                  onChange={(e) => setYearGroup(e.target.value)}
                  value={yearGroup}
                >
                  <option value="Year 9">Year 9</option>
                  <option value="Year 10">Year 10</option>
                  <option value="Year 11">Year 11</option>
                  <option value="Year 12">Year 12</option>
                  <option value="Year 13">Year 13</option>
                </Select>
              </FormControl>
            )}

            {/* Department select for teachers */}
            {isTeacher && !isAdmin && (
              <FormControl isRequired>
                <FormLabel>Select Department</FormLabel>
                <Select
                  placeholder="Select Department"
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                >
                  <option value="Mathematics">Math</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="BTEC Business">BTEC Business</option>
                  <option value="BTEC Sport">BTEC Sport</option>
                  <option value="BTEC Art">BTEC Art</option>
                  <option value="BTEC Music">BTEC Music</option>
                  <option value="Business">Business</option>
                  <option value="Economics">Economics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Sociology">Sociology</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Geography">Geography</option>
                  <option value="Arts">Arts</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="media">Pear Media</option>
                </Select>
              </FormControl>
            )}

            {/* Verify Email button */}
            {!isOtpSent && (
              <Button
                colorScheme="blue"
                onClick={() => sendOtp(false)}
                isDisabled={
                  !inputs.email ||
                  !inputs.password ||
                  !inputs.name ||
                  !inputs.username ||
                  !!emailError ||
                  !!usernameError ||
                  (!isAdmin &&
                    ((isStudent && !yearGroup) || (isTeacher && !department)))
                }
              >
                Verify Email
              </Button>
            )}

            {/* OTP verification section */}
            {isOtpSent && (
              <FormControl isRequired>
                <FormLabel>Enter OTP</FormLabel>
                <Input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                />
                <Stack direction="row" spacing={4} mt={2}>
                  <Button
                    onClick={verifyOtp}
                    disabled={!formData.otp}
                    colorScheme="green"
                  >
                    Verify OTP & Create Account
                  </Button>
                  <Button
                    onClick={handleResendOTP}
                    isDisabled={isResendDisabled}
                    colorScheme="blue"
                  >
                    Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                  </Button>
                </Stack>
                {errorMessage && (
                  <Text color="red.500" mt={2}>
                    {errorMessage}
                  </Text>
                )}
              </FormControl>
            )}

            {/* Login link */}
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
};

export default SignupCard;