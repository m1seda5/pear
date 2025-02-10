// version 1 working
// import { Avatar } from "@chakra-ui/avatar";
// import { Image } from "@chakra-ui/image";
// import { Box, Flex, Text } from "@chakra-ui/layout";
// import { BsThreeDots } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import Actions from "./Actions";
// import { useState } from "react";

// const UserPost = ({ postImg, postTitle, likes, replies }) => {
// 	const [liked, setLiked] = useState(false);
// 	return (
// 		<Link to={"/markzuckerberg/post/1"}>
// 			<Flex gap={3} mb={4} py={5}>
// 				<Flex flexDirection={"column"} alignItems={"center"}>
// 					<Avatar size='md' name='Mark Zuckerberg' src='/zuck-avatar.png' />
// 					<Box w='10px' h={"full"} bg='gray.light' my={2}></Box>
// 					<Box position={"relative"} w={"full"}>
// 						<Avatar
// 							size='xs'
// 							name='John doe'
// 							src='https://bit.ly/dan-abramov'
// 							position={"absolute"}
// 							top={"0px"}
// 							left='15px'
// 							padding={"2px"}
// 						/>
// 						<Avatar
// 							size='xs'
// 							name='John doe'
// 							src='https://bit.ly/sage-adebayo'
// 							position={"absolute"}
// 							bottom={"0px"}
// 							right='-5px'
// 							padding={"2px"}
// 						/>
// 						<Avatar
// 							size='xs'
// 							name='John doe'
// 							src='https://bit.ly/prosper-baba'
// 							position={"absolute"}
// 							bottom={"0px"}
// 							left='4px'
// 							padding={"2px"}
// 						/>
// 					</Box>
// 				</Flex>
// 				<Flex flex={1} flexDirection={"column"} gap={2}>
// 					<Flex justifyContent={"space-between"} w={"full"}>
// 						<Flex w={"full"} alignItems={"center"}>
// 							<Text fontSize={"sm"} fontWeight={"bold"}>
// 								markzuckerberg
// 							</Text>
// 							<Image src='/verified.png' w={4} h={4} ml={1} />
// 						</Flex>
// 						<Flex gap={4} alignItems={"center"}>
// 							<Text fontStyle={"sm"} color={"gray.light"}>
// 								1d
// 							</Text>
// 							<BsThreeDots />
// 						</Flex>
// 					</Flex>

// 					<Text fontSize={"sm"}>{postTitle}</Text>
// 					{postImg && (
// 						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
// 							<Image src={postImg} w={"full"} />
// 						</Box>
// 					)}

// 					<Flex gap={3} my={1}>
// 						<Actions liked={liked} setLiked={setLiked} />
// 					</Flex>

// 					<Flex gap={2} alignItems={"center"}>
// 						<Text color={"gray.light"} fontSize='sm'>
// 							{replies} replies
// 						</Text>
// 						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
// 						<Text color={"gray.light"} fontSize='sm'>
// 							{likes} likes
// 						</Text>
// 					</Flex>
// 				</Flex>
// 			</Flex>
// 		</Link>
// 	);
// };

// export default UserPost;


// version 2  with translations
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const UserPost = ({ postImg, postTitle, likes, replies }) => {
  const [liked, setLiked] = useState(false);
  const { t, i18n } = useTranslation();  // Initialize the translation hook

  useEffect(() => {
    // Update the language state whenever the i18n language changes
    const handleLanguageChange = (lng) => {
      // This will force the component to re-render when the language changes
      setLiked(liked => !liked);  // A simple state update to trigger re-render
    };

    i18n.on('languageChanged', handleLanguageChange);  // Listen for language change

    return () => {
      i18n.off('languageChanged', handleLanguageChange);  // Cleanup on component unmount
    };
  }, [i18n]);

  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size='md' name='Mark Zuckerberg' src='/zuck-avatar.png' />
          <Box w='10px' h={"full"} bg='gray.light' my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size='xs'
              name='John doe'
              src='https://bit.ly/dan-abramov'
              position={"absolute"}
              top={"0px"}
              left='15px'
              padding={"2px"}
            />
            <Avatar
              size='xs'
              name='John doe'
              src='https://bit.ly/sage-adebayo'
              position={"absolute"}
              bottom={"0px"}
              right='-5px'
              padding={"2px"}
            />
            <Avatar
              size='xs'
              name='John doe'
              src='https://bit.ly/prosper-baba'
              position={"absolute"}
              bottom={"0px"}
              left='4px'
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {t('markzuckerberg')} {/* Wrap in t() for translation */}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                {t('1d')} {/* Wrap in t() for translation */}
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{t(postTitle)}</Text> {/* Wrap postTitle in t() */}
          
          {postImg && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={postImg} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>

          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize='sm'>
              {t('{{count}} replies', { count: replies })} {/* Translation for replies */}
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize='sm'>
              {t('{{count}} likes', { count: likes })} {/* Translation for likes */}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
