import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	IconButton,
	Tooltip,
	Box
  } from "@chakra-ui/react";
  import { useRef, useState } from "react";
  import { IoSendSharp } from "react-icons/io5";
  import { RiImageAddLine, RiEmojiStickerLine } from "react-icons/ri";
  import useShowToast from "../hooks/useShowToast";
  import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
  import { useRecoilValue, useSetRecoilState } from "recoil";
  import usePreviewImg from "../hooks/usePreviewImg";
  import EmojiPicker from "emoji-picker-react";
  import { useSocket } from "../context/SocketContext";
  
  const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const imageRef = useRef(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const [isSending, setIsSending] = useState(false);
	const { socket } = useSocket();
	const typingTimeoutRef = useRef();
  
	const handleInputChange = (e) => {
	  setMessageText(e.target.value);
	  
	  // Emit typing event
	  socket?.emit("typing", { 
		conversationId: selectedConversation._id 
	  });
  
	  // Clear existing timeout
	  if (typingTimeoutRef.current) {
		clearTimeout(typingTimeoutRef.current);
	  }
  
	  // Set new timeout
	  typingTimeoutRef.current = setTimeout(() => {
		socket?.emit("stopTyping", { 
		  conversationId: selectedConversation._id 
		});
	  }, 1000);
	};
  
	const handleSendMessage = async (e) => {
	  if (e) e.preventDefault();
	  if (!messageText.trim() && !imgUrl) return;
	  if (isSending) return;
  
	  // Create optimistic message
	  const optimisticId = Date.now().toString();
	  const optimisticMessage = {
		_id: optimisticId,
		text: messageText,
		img: imgUrl,
		sender: selectedConversation.userId,
		createdAt: new Date().toISOString(),
		seen: false
	  };
  
	  // Add optimistic message immediately
	  setMessages(prev => [...prev, optimisticMessage]);
	  
	  // Clear input and image
	  setMessageText("");
	  setImgUrl("");
	  setShowEmojiPicker(false);
  
	  try {
		const isGroupChat = selectedConversation.isGroup;
		
		const requestBody = isGroupChat ? {
		  conversationId: selectedConversation._id,
		  message: messageText,
		  img: imgUrl
		} : {
		  recipientId: selectedConversation.userId,
		  message: messageText,
		  img: imgUrl
		};
  
		const res = await fetch("/api/messages", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(requestBody),
		});
  
		const data = await res.json();
		if (data.error) {
		  // Remove optimistic message on error
		  setMessages(prev => prev.filter(msg => msg._id !== optimisticId));
		  showToast("Error", data.error, "error");
		  return;
		}
  
		// Replace optimistic message with real one
		setMessages(prev => prev.map(msg => 
		  msg._id === optimisticId ? data : msg
		));
  
		setConversations((prevConvs) => {
		  return prevConvs.map((conversation) => {
			if (conversation._id === selectedConversation._id) {
			  return {
				...conversation,
				lastMessage: {
				  text: messageText,
				  sender: data.sender,
				},
			  };
			}
			return conversation;
		  });
		});
  
	  } catch (error) {
		// Remove optimistic message on error
		setMessages(prev => prev.filter(msg => msg._id !== optimisticId));
		showToast("Error", error.message, "error");
	  } finally {
		setIsSending(false);
	  }
	};
  
	const handleEmojiClick = (emojiData) => {
	  setMessageText(prev => prev + emojiData.emoji);
	};
  
	return (
		<Flex position="relative" px={4} pb={4}>
		<form onSubmit={handleSendMessage} style={{ width: '100%' }}>
		  <InputGroup size="lg">
			<InputLeftElement>
			  <IconButton
				icon={<RiImageAddLine />}
				variant="ghost"
				aria-label="Add image"
				onClick={() => imageRef.current.click()}
			  />
			</InputLeftElement>
  
			<Input
			  placeholder="Type a message..."
			  value={messageText}
			  onChange={handleInputChange}
			  borderRadius="full"
			  pr="4.5rem"
			  fontSize="md"
			  onFocus={() => setShowEmojiPicker(false)}
			/>
			
			<InputRightElement width="6rem">
			  <Flex gap={2}>
				<Tooltip label="Add emoji">
				  <IconButton
					icon={<RiEmojiStickerLine />}
					size="sm"
					variant="ghost"
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					aria-label="Add emoji"
				  />
				</Tooltip>
  
				<IconButton
				  icon={<IoSendSharp />}
				  colorScheme="blue"
				  size="sm"
				  borderRadius="full"
				  aria-label="Send message"
				  onClick={handleSendMessage}
				  isDisabled={!messageText.trim() && !imgUrl}
				  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
				/>
			  </Flex>
			</InputRightElement>
		  </InputGroup>
		</form>
  
		<Input 
		  type="file"
		  hidden
		  ref={imageRef}
		  onChange={handleImageChange}
		  accept="image/*"
		/>
  
		{showEmojiPicker && (
		  <Box position="absolute" bottom="65px" right="20px" zIndex={10}>
			<EmojiPicker
			  onEmojiClick={handleEmojiClick}
			  previewConfig={{ showPreview: false }}
			/>
		  </Box>
		)}
  
		<Modal
		  isOpen={imgUrl}
		  onClose={() => {
			onClose();
			setImgUrl("");
		  }}
		>
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>Preview Image</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  <Flex mt={5} w="full">
				<Image src={imgUrl} alt="Preview" />
			  </Flex>
			  <Flex justifyContent="flex-end" my={2}>
				{!isSending ? (
				  <IconButton
					icon={<IoSendSharp />}
					colorScheme="blue"
					onClick={handleSendMessage}
					aria-label="Send image"
				  />
				) : (
				  <Spinner size="md" />
				)}
			  </Flex>
			</ModalBody>
		  </ModalContent>
		</Modal>
	  </Flex>
	);
  };
  
  export default MessageInput;