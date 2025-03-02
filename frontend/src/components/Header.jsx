// // version 1 this is the orignal no hover no animations just a basic icon navbar
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Flex justifyContent={"center"} mt={6} mb='12' gap={21}>
// 			{user && (
// 				<Link as={RouterLink} to='/'>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
// 					Login
// 				</Link>
// 			)}

// 			<Image
// 				cursor={"pointer"}
// 				alt='logo'
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 			/>

// 			{user && (
// 				<Flex alignItems={"center"} gap={21}>
// 					<Link as={RouterLink} to={`/${user.username}`}>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link as={RouterLink} to={`/chat`}>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link as={RouterLink} to={`/settings`}>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button size={"xs"} onClick={logout}>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

// export default Header;


// version 2 this is the second version with basic additions lik  hover color change 
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Flex justifyContent="center" mt={6} mb="12" gap={10}>
// 			{user && (
// 				<Link
// 					as={RouterLink}
// 					to="/"
// 					_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 					transition="all 0.2s ease-in-out"
// 				>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("login")}
// 					_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 					transition="all 0.2s ease-in-out"
// 				>
// 					Login
// 				</Link>
// 			)}

// 			<Image
// 				cursor="pointer"
// 				alt="logo"
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 				_hover={{ transform: "rotate(20deg) scale(1.1)" }}
// 				transition="all 0.3s ease-in-out"
// 			/>

// 			{user && (
// 				<Flex alignItems="center" gap={10}>
// 					<Link
// 						as={RouterLink}
// 						to={`/${user.username}`}
// 						_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 						transition="all 0.2s ease-in-out"
// 					>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/chat"
// 						_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 						transition="all 0.2s ease-in-out"
// 					>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/settings"
// 						_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 						transition="all 0.2s ease-in-out"
// 					>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button
// 						size="xs"
// 						onClick={logout}
// 						_hover={{ bg: "teal.500", color: "white", transform: "scale(1.05)" }}
// 						transition="all 0.2s ease-in-out"
// 					>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("signup")}
// 					_hover={{ color: "teal.500", transform: "scale(1.1)" }}
// 					transition="all 0.2s ease-in-out"
// 				>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

// export default Header;



// version 2 
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Flex justifyContent="center" mt={6} mb="12" gap={10}>
// 			{user && (
// 				<Link
// 					as={RouterLink}
// 					to="/"
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("login")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					Login
// 				</Link>
// 			)}

// 			<Image
// 				cursor="pointer"
// 				alt="logo"
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 				_hover={{
// 					transform: "rotate(20deg) scale(1.2)", // Increased scale for exaggerated effect
// 				}}
// 				transition="all 0.3s ease-in-out" // Smooth transition
// 			/>

// 			{user && (
// 				<Flex alignItems="center" gap={10}>
// 					<Link
// 						as={RouterLink}
// 						to={`/${user.username}`}
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/chat"
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/settings"
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button
// 						size="xs"
// 						onClick={logout}
// 						_hover={{
// 							bg: "teal.500",
// 							color: "white",
// 							transform: "scale(1.1)", // Slightly increased scale for logout button
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("signup")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

// export default Header;


// version  2 with added update to roles 
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Flex justifyContent="center" mt={6} mb="12" gap={10}>
// 			{user && (
// 				<Link
// 					as={RouterLink}
// 					to="/"
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("login")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					Login
// 				</Link>
// 			)}

// 			<Image
// 				cursor="pointer"
// 				alt="logo"
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 				_hover={{
// 					transform: "rotate(20deg) scale(1.2)", // Increased scale for exaggerated effect
// 				}}
// 				transition="all 0.3s ease-in-out" // Smooth transition
// 			/>

// 			{user && (
// 				<Flex alignItems="center" gap={10}>
// 					<Link
// 						as={RouterLink}
// 						to={`/${user.username}`}
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/chat"
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link
// 						as={RouterLink}
// 						to="/settings"
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)", // Increased scale for exaggerated effect
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button
// 						size="xs"
// 						onClick={logout}
// 						_hover={{
// 							bg: "teal.500",
// 							color: "white",
// 							transform: "scale(1.1)", // Slightly increased scale for logout button
// 						}}
// 						transition="all 0.3s ease-in-out" // Smooth transition
// 					>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("signup")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)", // Increased scale for exaggerated effect
// 					}}
// 					transition="all 0.3s ease-in-out" // Smooth transition
// 				>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

// export default Header;

// version three with restricitons and lock animations 
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";
// import { useState } from "react";
// import { FaLock } from "react-icons/fa";

// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	const logout = useLogout();
// 	const setAuthScreen = useSetRecoilState(authScreenAtom);
// 	const navigate = useNavigate();
// 	const [hoveringLock, setHoveringLock] = useState(false);

// 	// Check if the user has access to the chat page based on their email
// 	const hasChatAccess = user?.email?.includes("students");

// 	const handleChatClick = (e) => {
// 		if (!hasChatAccess) {
// 			e.preventDefault(); // Prevent navigation if the user doesn't have access
// 			setHoveringLock(true); // Show red lock when hovering
// 		} else {
// 			setHoveringLock(false);
// 			navigate("/chat");
// 		}
// 	};

// 	return (
// 		<Flex justifyContent="center" mt={6} mb="12" gap={10}>
// 			{user && (
// 				<Link
// 					as={RouterLink}
// 					to="/"
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)",
// 					}}
// 					transition="all 0.3s ease-in-out"
// 				>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("login")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)",
// 					}}
// 					transition="all 0.3s ease-in-out"
// 				>
// 					Login
// 				</Link>
// 			)}

// 			<Image
// 				cursor="pointer"
// 				alt="logo"
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 				_hover={{
// 					transform: "rotate(20deg) scale(1.2)",
// 				}}
// 				transition="all 0.3s ease-in-out"
// 			/>

// 			{user && (
// 				<Flex alignItems="center" gap={10}>
// 					<Link
// 						as={RouterLink}
// 						to={`/${user.username}`}
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)",
// 						}}
// 						transition="all 0.3s ease-in-out"
// 					>
// 						<RxAvatar size={24} />
// 					</Link>

// 					<Link
// 						onClick={handleChatClick}
// 						_hover={{
// 							color: hasChatAccess ? "teal.500" : "red.500",
// 							transform: hasChatAccess ? "scale(1.2)" : "scale(1.2)",
// 							cursor: hasChatAccess ? "pointer" : "not-allowed",
// 						}}
// 						transition="all 0.3s ease-in-out"
// 						onMouseEnter={() => !hasChatAccess && setHoveringLock(true)}
// 						onMouseLeave={() => setHoveringLock(false)}
// 					>
// 						{hoveringLock ? <FaLock size={20} /> : <BsFillChatQuoteFill size={20} />}
// 					</Link>

// 					<Link
// 						as={RouterLink}
// 						to="/settings"
// 						_hover={{
// 							color: "teal.500",
// 							transform: "scale(1.2)",
// 						}}
// 						transition="all 0.3s ease-in-out"
// 					>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button
// 						size="xs"
// 						onClick={logout}
// 						_hover={{
// 							bg: "teal.500",
// 							color: "white",
// 							transform: "scale(1.1)",
// 						}}
// 						transition="all 0.3s ease-in-out"
// 					>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link
// 					as={RouterLink}
// 					to="/auth"
// 					onClick={() => setAuthScreen("signup")}
// 					_hover={{
// 						color: "teal.500",
// 						transform: "scale(1.2)",
// 					}}
// 					transition="all 0.3s ease-in-out"
// 				>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

// export default Header;


// this is version 4 with the new check chat access integrated  working 
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";
// import { useState } from "react";
// import { FaLock } from "react-icons/fa";

// const Header = () => {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const user = useRecoilValue(userAtom);
//     const logout = useLogout();
//     const setAuthScreen = useSetRecoilState(authScreenAtom);
//     const navigate = useNavigate();
//     const [hoveringLock, setHoveringLock] = useState(false);

//     // Check if the user has access to the chat page based on their email
//     const hasChatAccess = user?.email?.includes("students");

//     const handleChatClick = (e) => {
//         if (!hasChatAccess) {
//             e.preventDefault(); // Prevent navigation if the user doesn't have access
//             setHoveringLock(true); // Show red lock when hovering
//         } else {
//             setHoveringLock(false);
//             navigate("/chat"); // Navigate to chat page if access is allowed
//         }
//     };

//     return (
//         <Flex justifyContent="center" mt={6} mb="12" gap={10}>
//             {user && (
//                 <Link
//                     as={RouterLink}
//                     to="/"
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     <AiFillHome size={24} />
//                 </Link>
//             )}
//             {!user && (
//                 <Link
//                     as={RouterLink}
//                     to="/auth"
//                     onClick={() => setAuthScreen("login")}
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     Login
//                 </Link>
//             )}

//             <Image
//                 cursor="pointer"
//                 alt="logo"
//                 w={6}
//                 src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
//                 onClick={toggleColorMode}
//                 _hover={{
//                     transform: "rotate(20deg) scale(1.2)",
//                 }}
//                 transition="all 0.3s ease-in-out"
//             />

//             {user && (
//                 <Flex alignItems="center" gap={10}>
//                     <Link
//                         as={RouterLink}
//                         to={`/${user.username}`}
//                         _hover={{
//                             color: "teal.500",
//                             transform: "scale(1.2)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <RxAvatar size={24} />
//                     </Link>

//                     <Link
//                         onClick={handleChatClick}
//                         _hover={{
//                             color: hasChatAccess ? "teal.500" : "red.500",
//                             transform: "scale(1.2)",
//                             cursor: hasChatAccess ? "pointer" : "not-allowed",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                         onMouseEnter={() => !hasChatAccess && setHoveringLock(true)}
//                         onMouseLeave={() => setHoveringLock(false)}
//                     >
//                         {hoveringLock ? <FaLock size={20} /> : <BsFillChatQuoteFill size={20} />}
//                     </Link>

//                     <Link
//                         as={RouterLink}
//                         to="/settings"
//                         _hover={{
//                             color: "teal.500",
//                             transform: "scale(1.2)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <MdOutlineSettings size={20} />
//                     </Link>
//                     <Button
//                         size="xs"
//                         onClick={logout}
//                         _hover={{
//                             bg: "teal.500",
//                             color: "white",
//                             transform: "scale(1.1)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <FiLogOut size={20} />
//                     </Button>
//                 </Flex>
//             )}

//             {!user && (
//                 <Link
//                     as={RouterLink}
//                     to="/auth"
//                     onClick={() => setAuthScreen("signup")}
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     Sign up
//                 </Link>
//             )}
//         </Flex>
//     );
// };

// export default Header;


// this is version five with the new time restrictions to the check chat access(this is wokring version)
// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { RxAvatar } from "react-icons/rx";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";
// import { useState } from "react";
// import { FaLock } from "react-icons/fa";

// const Header = () => {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const user = useRecoilValue(userAtom);
//     const logout = useLogout();
//     const setAuthScreen = useSetRecoilState(authScreenAtom);
//     const navigate = useNavigate();
//     const [hoveringLock, setHoveringLock] = useState(false);

//     // Check if the user has access to the chat page based on their email and time restrictions
//     const isStudent = user?.email?.includes("students");
//     const currentDate = new Date();
//     const dayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
//     const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes(); // Convert to HHMM format

//     // School hours in HHMM format
//     const schoolStart = 810;
//     const lunchStart = 1250;
//     const lunchEnd = 1340;
//     const schoolEnd = 1535;

//     // Determine if the student has chat access based on the day and time
//     const hasChatAccess =
//         isStudent &&
//         ((dayOfWeek >= 1 && dayOfWeek <= 5 && 
//             (currentTime < schoolStart || 
//             (currentTime >= lunchStart && currentTime <= lunchEnd) || 
//             currentTime > schoolEnd)) ||
//         dayOfWeek === 0 || dayOfWeek === 6); // Allow access on weekends

//     const handleChatClick = (e) => {
//         if (!hasChatAccess) {
//             e.preventDefault(); // Prevent navigation if the user doesn't have access
//             setHoveringLock(true); // Show red lock when hovering
//         } else {
//             setHoveringLock(false);
//             navigate("/chat"); // Navigate to chat page if access is allowed
//         }
//     };

//     return (
//         <Flex justifyContent="center" mt={6} mb="12" gap={10}>
//             {user && (
//                 <Link
//                     as={RouterLink}
//                     to="/"
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     <AiFillHome size={24} />
//                 </Link>
//             )}
//             {!user && (
//                 <Link
//                     as={RouterLink}
//                     to="/auth"
//                     onClick={() => setAuthScreen("login")}
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     Login
//                 </Link>
//             )}

//             <Image
//                 cursor="pointer"
//                 alt="logo"
//                 w={6}
//                 src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
//                 onClick={toggleColorMode}
//                 _hover={{
//                     transform: "rotate(20deg) scale(1.2)",
//                 }}
//                 transition="all 0.3s ease-in-out"
//             />

//             {user && (
//                 <Flex alignItems="center" gap={10}>
//                     <Link
//                         as={RouterLink}
//                         to={`/${user.username}`}
//                         _hover={{
//                             color: "teal.500",
//                             transform: "scale(1.2)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <RxAvatar size={24} />
//                     </Link>

//                     <Link
//                         onClick={handleChatClick}
//                         _hover={{
//                             color: hasChatAccess ? "teal.500" : "red.500",
//                             transform: "scale(1.2)",
//                             cursor: hasChatAccess ? "pointer" : "not-allowed",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                         onMouseEnter={() => !hasChatAccess && setHoveringLock(true)}
//                         onMouseLeave={() => setHoveringLock(false)}
//                     >
//                         {hoveringLock ? <FaLock size={20} /> : <BsFillChatQuoteFill size={20} />}
//                     </Link>

//                     <Link
//                         as={RouterLink}
//                         to="/settings"
//                         _hover={{
//                             color: "teal.500",
//                             transform: "scale(1.2)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <MdOutlineSettings size={20} />
//                     </Link>
//                     <Button
//                         size="xs"
//                         onClick={logout}
//                         _hover={{
//                             bg: "teal.500",
//                             color: "white",
//                             transform: "scale(1.1)",
//                         }}
//                         transition="all 0.3s ease-in-out"
//                     >
//                         <FiLogOut size={20} />
//                     </Button>
//                 </Flex>
//             )}

//             {!user && (
//                 <Link
//                     as={RouterLink}
//                     to="/auth"
//                     onClick={() => setAuthScreen("signup")}
//                     _hover={{
//                         color: "teal.500",
//                         transform: "scale(1.2)",
//                     }}
//                     transition="all 0.3s ease-in-out"
//                 >
//                     Sign up
//                 </Link>
//             )}
//         </Flex>
//     );
// };

// export default Header;


// admin role update
// Fix for the Header component
import { 
  Button, 
  Flex, 
  Icon,
  Link, 
  useColorMode,
  Tooltip,
  Box
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";

const Header = ({ unreadCount = 0 }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState({
    chat: false,
    lock: false,
    tv: false,
  });

  // Only evaluate these if user exists
  const isStudent = user ? user.role === "student" : false;
  const isTeacher = user ? user.role === "teacher" : false;
  const isAdmin = user ? user.role === "admin" : false;

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;

  // Fix: Add a complete user check before evaluating hasChatAccess
  const hasChatAccess = user && (
    isTeacher ||
    isAdmin ||
    (isStudent &&
      ((dayOfWeek >= 1 &&
        dayOfWeek <= 5 &&
        (currentTime < schoolStart ||
          (currentTime >= lunchStart && currentTime <= lunchEnd) ||
          currentTime > schoolEnd)) ||
        dayOfWeek === 0 ||
        dayOfWeek === 6))
  );

  const handleChatClick = (e) => {
    if (!user || (user && user.isFrozen) || !hasChatAccess) {
      e.preventDefault();
      setHoverState({ ...hoverState, lock: true });
    } else {
      setHoverState({ ...hoverState, chat: false, lock: false });
      navigate("/chat");
    }
  };

  const handleTVClick = (e) => {
    if (!user || (user && !isAdmin)) {
      e.preventDefault();
      setHoverState({ ...hoverState, tv: true });
    } else {
      setHoverState({ ...hoverState, tv: false });
      navigate("/tv");
    }
  };

  // Safe logout function
  const handleLogout = async () => {
    try {
      // Navigate first, then logout
      navigate("/auth");
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const NavIcon = ({ icon, label, onClick, isActive, isDisabled, children }) => {
    const activeColor = "teal.500";
    const disabledColor = "red.500";
    const hoverBgColor = colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50";
    
    // Consistent tooltip styles for both light and dark modes
    const tooltipBg = colorMode === "dark" ? "gray.700" : "gray.100";
    const tooltipColor = colorMode === "dark" ? "white" : "gray.800";
    const tooltipShadow = "md";
    
    return (
      <Tooltip 
        label={label} 
        placement="bottom" 
        hasArrow
        openDelay={200}
        bg={tooltipBg}
        color={tooltipColor}
        boxShadow={tooltipShadow}
        borderRadius="md"
        padding="6px 10px"
        fontSize="sm"
      >
        <Box
          as="span"
          position="relative"
          onClick={onClick}
          p={2.5}  // Increased padding for larger click area
          borderRadius="md"
          transition="all 0.2s ease"
          color={isDisabled ? disabledColor : (isActive ? activeColor : "inherit")}
          _hover={{
            bg: hoverBgColor,
            transform: "translateY(-2px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)",
            color: isDisabled ? disabledColor : activeColor,
          }}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          minWidth="40px"  // Ensure consistent width
          minHeight="40px"  // Ensure consistent height
        >
          {children}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Flex
      justifyContent="center"
      mt={6}
      mb="12"
      gap={{ base: 3, md: 6 }}  // Slightly reduced gap
      px={{ base: 2, md: 0 }}
      flexWrap={{ base: "wrap", md: "nowrap" }}
      width="100%"
    >
      {user && (
        <NavIcon 
          label="Home" 
          onClick={() => navigate("/")}
        >
          <Link
            as={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            <AiFillHome size={24} />
          </Link>
        </NavIcon>
      )}

      {!user && (
        <NavIcon 
          label="Login" 
          onClick={() => {
            setAuthScreen("login");
            navigate("/auth");
          }}
        >
          <Link
            as={RouterLink}
            to="/auth"
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            Login
          </Link>
        </NavIcon>
      )}

      <NavIcon 
        label={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} 
        onClick={toggleColorMode}
      >
        <Icon
          as={colorMode === 'dark' ? SunIcon : MoonIcon}
          w={6}
          h={6}
        />
      </NavIcon>

      {user && (
        <Flex
          alignItems="center"
          gap={{ base: 3, md: 6 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <NavIcon 
            label="Profile" 
            onClick={() => navigate(`/${user.username}`)}
          >
            <Link
              as={RouterLink}
              to={`/${user.username}`}
              display="flex"
              alignItems="center"
              width="100%"
              height="100%"
              justifyContent="center"
            >
              <RxAvatar size={24} />
            </Link>
          </NavIcon>

          <NavIcon 
            label={user.isFrozen ? "Account Frozen" : (hasChatAccess ? "Chat" : "No Access")} 
            onClick={handleChatClick}
            isDisabled={user.isFrozen || !hasChatAccess}
          >
            <Box
              position="relative"
              onMouseEnter={() => setHoverState({ ...hoverState, chat: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, chat: false, lock: false })}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              {user.isFrozen ? (
                <FaLock size={20} color={colorMode === "dark" ? "#4299E1" : "#4299E1"} />
              ) : hoverState.lock ? (
                <FaLock size={20} color={colorMode === "dark" ? "#F56565" : "#F56565"} />
              ) : (
                <BsFillChatQuoteFill size={20} />
              )}
              
              {unreadCount > 0 && !user.isFrozen && hasChatAccess && (
                <Flex
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  w="18px"
                  h="18px"
                  fontSize="xs"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="md"
                >
                  {unreadCount}
                </Flex>
              )}
            </Box>
          </NavIcon>

          <NavIcon 
            label={isAdmin ? "TV Dashboard" : "Admin Only"} 
            onClick={handleTVClick}
            isDisabled={!isAdmin}
          >
            <Box
              onMouseEnter={() => setHoverState({ ...hoverState, tv: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, tv: false })}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              {hoverState.tv && !isAdmin ? (
                <FaLock size={20} color={colorMode === "dark" ? "#F56565" : "#F56565"} />
              ) : (
                <PiTelevisionSimpleBold size={20} />
              )}
            </Box>
          </NavIcon>

          <NavIcon 
            label="Settings" 
            onClick={() => navigate("/settings")}
          >
            <Link
              as={RouterLink}
              to="/settings"
              display="flex"
              alignItems="center"
              width="100%"
              height="100%"
              justifyContent="center"
            >
              <MdOutlineSettings size={20} />
            </Link>
          </NavIcon>

          <NavIcon 
            label="Logout" 
            onClick={handleLogout}
          >
            <Box 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              <FiLogOut size={20} />
            </Box>
          </NavIcon>
        </Flex>
      )}

      {!user && (
        <NavIcon 
          label="Sign up" 
          onClick={() => {
            setAuthScreen("signup");
            navigate("/auth");
          }}
        >
          <Link
            as={RouterLink}
            to="/auth"
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            Sign up
          </Link>
        </NavIcon>
      )}
    </Flex>
  );
};

export default Header;