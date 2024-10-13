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


// this is version five with the new time restrictions to the check chat access
import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
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
import { useState } from "react";
import { FaLock } from "react-icons/fa";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const navigate = useNavigate();
    const [hoveringLock, setHoveringLock] = useState(false);

    // Check if the user has access to the chat page based on their email and time restrictions
    const isStudent = user?.email?.includes("students");
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes(); // Convert to HHMM format

    // School hours in HHMM format
    const schoolStart = 810;
    const lunchStart = 1250;
    const lunchEnd = 1340;
    const schoolEnd = 1535;

    // Determine if the student has chat access based on the day and time
    const hasChatAccess =
        isStudent &&
        ((dayOfWeek >= 1 && dayOfWeek <= 5 && 
            (currentTime < schoolStart || 
            (currentTime >= lunchStart && currentTime <= lunchEnd) || 
            currentTime > schoolEnd)) ||
        dayOfWeek === 0 || dayOfWeek === 6); // Allow access on weekends

    const handleChatClick = (e) => {
        if (!hasChatAccess) {
            e.preventDefault(); // Prevent navigation if the user doesn't have access
            setHoveringLock(true); // Show red lock when hovering
        } else {
            setHoveringLock(false);
            navigate("/chat"); // Navigate to chat page if access is allowed
        }
    };

    return (
        <Flex justifyContent="center" mt={6} mb="12" gap={10}>
            {user && (
                <Link
                    as={RouterLink}
                    to="/"
                    _hover={{
                        color: "teal.500",
                        transform: "scale(1.2)",
                    }}
                    transition="all 0.3s ease-in-out"
                >
                    <AiFillHome size={24} />
                </Link>
            )}
            {!user && (
                <Link
                    as={RouterLink}
                    to="/auth"
                    onClick={() => setAuthScreen("login")}
                    _hover={{
                        color: "teal.500",
                        transform: "scale(1.2)",
                    }}
                    transition="all 0.3s ease-in-out"
                >
                    Login
                </Link>
            )}

            <Image
                cursor="pointer"
                alt="logo"
                w={6}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
                _hover={{
                    transform: "rotate(20deg) scale(1.2)",
                }}
                transition="all 0.3s ease-in-out"
            />

            {user && (
                <Flex alignItems="center" gap={10}>
                    <Link
                        as={RouterLink}
                        to={`/${user.username}`}
                        _hover={{
                            color: "teal.500",
                            transform: "scale(1.2)",
                        }}
                        transition="all 0.3s ease-in-out"
                    >
                        <RxAvatar size={24} />
                    </Link>

                    <Link
                        onClick={handleChatClick}
                        _hover={{
                            color: hasChatAccess ? "teal.500" : "red.500",
                            transform: "scale(1.2)",
                            cursor: hasChatAccess ? "pointer" : "not-allowed",
                        }}
                        transition="all 0.3s ease-in-out"
                        onMouseEnter={() => !hasChatAccess && setHoveringLock(true)}
                        onMouseLeave={() => setHoveringLock(false)}
                    >
                        {hoveringLock ? <FaLock size={20} /> : <BsFillChatQuoteFill size={20} />}
                    </Link>

                    <Link
                        as={RouterLink}
                        to="/settings"
                        _hover={{
                            color: "teal.500",
                            transform: "scale(1.2)",
                        }}
                        transition="all 0.3s ease-in-out"
                    >
                        <MdOutlineSettings size={20} />
                    </Link>
                    <Button
                        size="xs"
                        onClick={logout}
                        _hover={{
                            bg: "teal.500",
                            color: "white",
                            transform: "scale(1.1)",
                        }}
                        transition="all 0.3s ease-in-out"
                    >
                        <FiLogOut size={20} />
                    </Button>
                </Flex>
            )}

            {!user && (
                <Link
                    as={RouterLink}
                    to="/auth"
                    onClick={() => setAuthScreen("signup")}
                    _hover={{
                        color: "teal.500",
                        transform: "scale(1.2)",
                    }}
                    transition="all 0.3s ease-in-out"
                >
                    Sign up
                </Link>
            )}
        </Flex>
    );
};

export default Header;
