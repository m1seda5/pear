const EditGameModal = ({ game, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      scoreA: game.scoreA,
      scoreB: game.scoreB,
      playersA: [...game.teamA.players],
      playersB: [...game.teamB.players]
    });
  
    const handleSave = async () => {
      try {
        await axios.put(`/api/games/${game._id}`, formData);
        onClose(true); // Trigger refresh
      } catch (err) {
        console.error("Error updating game:", err);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Game Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{game.teamA.name} Score</FormLabel>
              <NumberInput 
                value={formData.scoreA}
                onChange={(val) => setFormData({...formData, scoreA: val})}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
  
            {/* Repeat for teamB score and player inputs */}
            
            <ButtonGroup mt={4}>
              <Button onClick={handleSave} colorScheme="blue">
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };