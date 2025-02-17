import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    Button,
    Flex,
    Tag,
    TagLabel,
    TagCloseButton,
    useToast
  } from "@chakra-ui/react";
  import { useState } from "react";
  import useShowToast from "../hooks/useShowToast";
  
  const GroupCreationModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
  
    const handleSearchUser = async () => {
      if (!searchInput.trim() || selectedUsers.length >= MAX_GROUP_MEMBERS - 1) return;
      
      try {
        const res = await fetch(`/api/users/search/${searchInput}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        if (data._id === currentUser._id) return;
        
        setSelectedUsers(prev => [...new Set([...prev, data])]);
        setSearchInput("");
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
  
    const handleCreateGroup = async () => {
      if (selectedUsers.length < 1) return;
      
      try {
        const res = await fetch("/api/messages/groups/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({
            participants: selectedUsers.map(u => u._id),
            groupName: document.getElementById('groupName').value
          })
        });
        
        const data = await res.json();
        onGroupCreated(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input 
              placeholder="Group Name" 
              id="groupName" 
              mb={4}
              required
            />
            
            <Flex gap={2} mb={4} wrap="wrap">
              {selectedUsers.map(user => (
                <Tag key={user._id} size="md" borderRadius="full">
                  <TagLabel>{user.username}</TagLabel>
                  <TagCloseButton onClick={() => 
                    setSelectedUsers(prev => prev.filter(u => u._id !== user._id))
                  } />
                </Tag>
              ))}
            </Flex>
  
            <Flex gap={2}>
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
              />
              <Button 
                onClick={handleSearchUser}
                isDisabled={selectedUsers.length >= MAX_GROUP_MEMBERS - 1}
              >
                Add
              </Button>
            </Flex>
  
            <Button 
              colorScheme="green" 
              mt={4} 
              w="full" 
              onClick={handleCreateGroup}
              isLoading={loading}
            >
              Create Group ({selectedUsers.length + 1} members)
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default GroupCreationModal;