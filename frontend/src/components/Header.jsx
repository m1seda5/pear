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
import { 
  Box, 
  Flex, 
  Icon,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, SearchIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { FaLock, FaUserShield } from "react-icons/fa";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useMemo } from 'react';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Constants for dock component
const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

// Create Dock Context
const DockContext = createContext(undefined);

function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

// Main Dock component - Modified to remove scrolling
function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const { colorMode } = useColorMode();

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Instead of responsively hiding items, we'll use a fixed width and ensure all items fit
  return (
    <MotionBox
      style={{
        height: height,
      }}
      mx={2}
      display="flex"
      width="100%"
      alignItems="flex-end"
      justifyContent="center"
      mt={6}
      mb={10}
      overflow="visible" // Ensure no scrollbars appear
    >
      <MotionFlex
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        mx="auto"
        width="fit-content"
        maxWidth="100%"
        gap={2} // Reduced gap to fit more items
        borderRadius="3xl"
        bg={colorMode === "dark" ? "gray.800" : "gray.50"}
        px={4}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
        alignItems="center"
        justifyContent="center"
        boxShadow={colorMode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.1)"}
        position="relative"
        overflow="visible" // Ensure no scrollbars appear
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </MotionFlex>
    </MotionBox>
  );
}

// DockItem component
function DockItem({ children, className, onClick, isDisabled }) {
  const ref = useRef(null);
  const { mouseX, spring, distance, magnification } = useDock();
  const itemHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <MotionBox
      ref={ref}
      style={{ width }}
      onHoverStart={() => itemHovered.set(1)}
      onHoverEnd={() => itemHovered.set(0)}
      onFocus={() => itemHovered.set(1)}
      onBlur={() => itemHovered.set(0)}
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      className={className}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { width, isHovered: itemHovered, isDisabled })
      )}
    </MotionBox>
  );
}

// DockLabel component
function DockLabel({ children, className, ...rest }) {
  const { isHovered, isDisabled } = rest;
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          position="absolute"
          top="-6"
          left="50%"
          width="fit-content"
          whiteSpace="pre"
          borderRadius="md"
          border="1px solid"
          borderColor={isDisabled ? "red.300" : (colorMode === "dark" ? "whiteAlpha.300" : "gray.200")}
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          px={2}
          py={0.5}
          fontSize="xs"
          color={isDisabled ? disabledColor : (colorMode === "dark" ? "white" : "gray.800")}
          role="tooltip"
          style={{ x: '-50%' }}
          className={className}
          zIndex={10}
        >
          {children}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}

// DockIcon component
function DockIcon({ children, className, ...rest }) {
  const { width, isDisabled } = rest;
  const { colorMode } = useColorMode();

  const widthTransform = useTransform(width, (val) => val / 2);

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
  const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  const iconColor = isDisabled ? disabledColor : normalColor;

  return (
    <MotionBox
      style={{ width: widthTransform }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      color={iconColor}
      _hover={{
        "& .nav-icon-underline": {
          width: "80%",
          opacity: 1
        }
      }}
      className={className}
    >
      {children}
      <Box
        className="nav-icon-underline"
        position="absolute"
        bottom="-8px"
        left="50%"
        width="0%"
        height="2px"
        bg={isDisabled ? disabledColor : activeColor}
        transition="all 0.2s ease-out"
        transform="translateX(-50%)"
        borderRadius="full"
        opacity={0}
      />
    </MotionBox>
  );
}

function Header({ unreadCount = 0 }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  
  // State for locked icons
  const [showLockIcon, setShowLockIcon] = useState({
    chat: false,
    tv: false,
    admin: false
  });

  // User role checks
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  // Time-based access control
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;

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

  // Click handlers
  const handleChatClick = (e) => {
    if (!user || user.isFrozen || !hasChatAccess) {
      e.preventDefault();
    } else {
      navigate("/chat");
    }
  };

  const handleTVClick = (e) => {
    if (!user || !isAdmin) {
      e.preventDefault();
    } else {
      navigate("/tv");
    }
  };

  const handleAdminClick = (e) => {
    if (!user || !isAdmin) {
      e.preventDefault();
    } else {
      navigate("/admin");
    }
  };

  const handleLogout = async () => {
    try {
      navigate("/auth");
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Search component with expandable functionality
  const ExpandableSearch = () => {
    const [expanded, setExpanded] = useState(false);
    const searchRef = useRef(null);
    
    useEffect(() => {
      function handleClickOutside(event) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setExpanded(false);
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <Box ref={searchRef} position="relative" zIndex="3">
        <DockItem onClick={() => setExpanded(!expanded)}>
          <DockIcon>
            <SearchIcon w={5} h={5} />
          </DockIcon>
          <DockLabel>Search</DockLabel>
        </DockItem>
        
        <Collapse in={expanded} animateOpacity>
          <Box 
            position="absolute" 
            top="110%" 
            left="50%" 
            transform="translateX(-50%)" 
            width="240px"
            bg={colorMode === "dark" ? "gray.700" : "white"}
            borderRadius="xl"
            boxShadow="lg"
            p={2}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color={colorMode === "dark" ? "gray.300" : "gray.500"} />
              </InputLeftElement>
              <Input 
                placeholder="Search..."
                variant="filled"
                autoFocus
                borderRadius="lg"
                _focus={{ 
                  boxShadow: `0 0 0 1px ${colorMode === "dark" ? "teal.300" : "teal.500"}` 
                }}
              />
            </InputGroup>
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Define icon sizes to be smaller to fit better in fixed width dock
  const iconSize = 20;

  return (
    <Box 
      width="100%" 
      display="flex" 
      justifyContent="center"
      position="relative"
      overflow="visible" // Ensure no scrollbars appear
    >
      <Dock 
        panelHeight={56} // Slightly smaller than original
        magnification={72} // Slightly smaller magnification
        distance={120} // Smaller distance for tighter layout
        spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
      >
        {user && (
          <DockItem onClick={() => navigate("/")}>
            <DockIcon>
              <AiFillHome size={iconSize} />
            </DockIcon>
            <DockLabel>Home</DockLabel>
          </DockItem>
        )}

        {!user && (
          <DockItem onClick={() => { setAuthScreen("login"); navigate("/auth"); }}>
            <DockIcon>
              <Box fontWeight="medium">Login</Box>
            </DockIcon>
            <DockLabel>Login</DockLabel>
          </DockItem>
        )}

        <DockItem onClick={toggleColorMode}>
          <DockIcon>
            <Icon
              as={colorMode === "dark" ? SunIcon : MoonIcon}
              w={iconSize - 2}
              h={iconSize - 2}
              transition="all 0.3s ease"
              transform={colorMode === "dark" ? "rotate(0deg)" : "rotate(-180deg)"}
            />
          </DockIcon>
          <DockLabel>{colorMode === "dark" ? "Light Mode" : "Dark Mode"}</DockLabel>
        </DockItem>

        <ExpandableSearch />

        {user && (
          <>
            <DockItem onClick={() => navigate(`/${user.username}`)}>
              <DockIcon>
                <RxAvatar size={iconSize} />
              </DockIcon>
              <DockLabel>Profile</DockLabel>
            </DockItem>

            <DockItem 
              onClick={handleChatClick} 
              isDisabled={user.isFrozen || !hasChatAccess}
            >
              <DockIcon>
                <Box position="relative"
                  onMouseEnter={() => setShowLockIcon({ ...showLockIcon, chat: !hasChatAccess || user.isFrozen })}
                  onMouseLeave={() => setShowLockIcon({ ...showLockIcon, chat: false })}
                >
                  {user.isFrozen || showLockIcon.chat ? (
                    <FaLock size={iconSize - 2} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
                  ) : (
                    <BsFillChatQuoteFill size={iconSize - 2} />
                  )}
                  {unreadCount > 0 && !user.isFrozen && hasChatAccess && (
                    <Flex
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      bg="purple.500"
                      color="white"
                      borderRadius="full"
                      w="16px"
                      h="16px"
                      fontSize="xs"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Flex>
                  )}
                </Box>
              </DockIcon>
              <DockLabel>{user.isFrozen ? "Account Frozen" : (hasChatAccess ? "Chat" : "No Access")}</DockLabel>
            </DockItem>

            {isAdmin && (
              <DockItem onClick={handleAdminClick}>
                <DockIcon>
                  <FaUserShield size={iconSize - 2} />
                </DockIcon>
                <DockLabel>Admin</DockLabel>
              </DockItem>
            )}

            <DockItem 
              onClick={handleTVClick}
              isDisabled={!isAdmin}
            >
              <DockIcon>
                <Box
                  onMouseEnter={() => setShowLockIcon({ ...showLockIcon, tv: !isAdmin })}
                  onMouseLeave={() => setShowLockIcon({ ...showLockIcon, tv: false })}
                >
                  {showLockIcon.tv ? (
                    <FaLock size={iconSize - 2} color={colorMode === "dark" ? "#F56565" : "#E53E3E"} />
                  ) : (
                    <PiTelevisionSimpleBold size={iconSize} />
                  )}
                </Box>
              </DockIcon>
              <DockLabel>{isAdmin ? "TV" : "Admin Only"}</DockLabel>
            </DockItem>

            <DockItem onClick={() => navigate("/settings")}>
              <DockIcon>
                <MdOutlineSettings size={iconSize} />
              </DockIcon>
              <DockLabel>Settings</DockLabel>
            </DockItem>

            <DockItem onClick={handleLogout}>
              <DockIcon>
                <FiLogOut size={iconSize - 2} />
              </DockIcon>
              <DockLabel>Logout</DockLabel>
            </DockItem>
          </>
        )}

        {!user && (
          <DockItem onClick={() => { setAuthScreen("signup"); navigate("/auth"); }}>
            <DockIcon>
              <Box fontWeight="medium">Sign up</Box>
            </DockIcon>
            <DockLabel>Sign up</DockLabel>
          </DockItem>
        )}
      </Dock>
    </Box>
  );
}

export default Header;