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
//                 </Select>
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

  
// // email verification update
import React, { useState } from "react";
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
  const [timer, setTimer] = useState(120); // 2-minute timer
  const [errorMessage, setErrorMessage] = useState("");

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  // Start OTP timer
  const startTimer = () => {
    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset timer and resend OTP
  const resendOtp = () => {
    setTimer(120); // Reset timer to 2 minutes
    setIsOtpVerified(false);
    sendOtp(); // Resend OTP
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const sendOtp = async () => {
    try {
      console.log("Sending OTP with data:", inputs);
      const response = await axios.post("/api/users/signup", { ...inputs });
      console.log("OTP Response:", response.data);
      setIsOtpSent(true);
      startTimer();
      showToast("Success", "OTP sent to your email", "success");
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error sending OTP");
      showToast("Error", errorMessage, "error");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      await axios.post("/api/users/verify-otp", {
        email: inputs.email,
        otp: formData.otp,
      });
      setIsOtpVerified(true);
      setErrorMessage("");
      showToast("Success", "OTP verified successfully", "success");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  // Handle form submission
  const handleSignup = async () => {
    if (!isOtpVerified) {
      console.log("OTP not verified. Cannot proceed.");
      setErrorMessage("Please verify your OTP before signing up");
      return;
    }

    try {
      const role =
        isStudent && yearGroup
          ? "student"
          : isTeacher && department
          ? "teacher"
          : (inputs.email.toLowerCase().includes("admin") ||
              inputs.username.toLowerCase().includes("admin"))
          ? "admin"
          : "student";

      const signupData = {
        name: inputs.name,
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
        role,
        ...(role === "student" ? { yearGroup } : {}),
        ...(role === "teacher" ? { department } : {}),
      };

      console.log("Sending signup data:", signupData);

      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      console.log("Signup Response:", data);

      if (data.error) {
        console.error("Signup Error:", data.error);
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      showToast("Success", "Signup successful!", "success");
    } catch (error) {
      console.error("Error in handleSignup:", error);
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
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
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
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Role Selection */}
            <FormControl>
              <Checkbox isChecked={isStudent} onChange={(e) => setIsStudent(e.target.checked)}>
                Are you a student?
              </Checkbox>
              <Checkbox isChecked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)}>
                Are you a teacher?
              </Checkbox>
            </FormControl>

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

            {isTeacher && (
              <FormControl isRequired>
                <FormLabel>Select Department</FormLabel>
                <Select
                  placeholder="Select Department"
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Economics">Economics</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Religious Studies">Religious Studies</option>
                  <option value="Drama">Drama</option>
                  <option value="Design Technology">Design Technology</option>
                </Select>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                isDisabled={!isOtpSent || isOtpVerified}
              />
            </FormControl>

            {isOtpSent && timer > 0 && (
              <Text color="gray.500">Resend OTP in {timer}s</Text>
            )}
            {timer === 0 && !isOtpVerified && (
              <Button onClick={resendOtp}>Resend OTP</Button>
            )}

            <Stack spacing={10}>
              <Button
                colorScheme="blue"
                variant="solid"
                onClick={isOtpSent ? verifyOtp : sendOtp}
                isDisabled={!inputs.email || !inputs.password || (isOtpSent && !formData.otp)}
              >
                {isOtpSent ? "Verify OTP" : "Send OTP"}
              </Button>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={handleSignup}
                isDisabled={!isOtpVerified}
              >
                Sign Up
              </Button>
            </Stack>

            {errorMessage && <Text color="red.500">{errorMessage}</Text>}

            <HStack pt={6}>
              <Text color="gray.600">Already have an account?</Text>
              <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                Login
              </Link>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupCard;

