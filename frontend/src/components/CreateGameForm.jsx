import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Avatar,
  IconButton,
  Flex,
  useToast,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
  Select
} from '@chakra-ui/react';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';

const FormSkeleton = () => (
  <Stack p={4} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
    <Skeleton height="20px" width="60%" mb={2} />
    <Flex justify="space-between">
      <SkeletonCircle size="8" />
      <Skeleton height="20px" width="20%" />
      <SkeletonCircle size="8" />
    </Flex>
    <Skeleton height="15px" mt={2} width="80%" />
  </Stack>
);

const TeamInput = ({ team, formData, onChange, onPlayerChange, presetTeams, onPresetSelect }) => {
  const teamKey = team === 'teamA' ? 'teamA' : 'teamB';
  const teamData = formData[teamKey];
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onChange(teamKey, e.target.files[0]);
    }
  };
  
  const addPlayer = () => {
    onPlayerChange(teamData.players.length, '');
  };

  return (
    <Stack flex={1} spacing={3}>
      <FormLabel>{team === 'teamA' ? 'Home Team' : 'Away Team'}</FormLabel>
      
      {/* Enhanced Preset Team Selection */}
      <Select
        aria-label="Select preset team"
        placeholder="Select preset team"
        onChange={(e) => onPresetSelect(teamKey, e.target.value)}
      >
        {presetTeams.map(team => (
          <option key={team._id} value={team._id}>
            {team.name} ({team.category})
          </option>
        ))}
      </Select>

      <Flex align="center" gap={2}>
        <Avatar src={teamData.logo} size="md" />
        <Input
          placeholder="Team Name"
          value={teamData.name}
          onChange={e => 
            onPlayerChange(-1, e.target.value)}
          aria-label={`${team === 'teamA' ? 'Home' : 'Away'} team name`}
        />
        <IconButton
          aria-label="Upload logo"
          icon={<CloudUpload />}
          onClick={() => document.getElementById(`${teamKey}-logo`).click()}
        />
        <input
          id={`${teamKey}-logo`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Flex>
      
      {teamData.players.map((player, index) => (
        <Input
          key={index}
          placeholder={`Player ${index + 1}`}
          value={player}
          onChange={e => onPlayerChange(index, e.target.value)}
          aria-label={`${team === 'teamA' ? 'Home' : 'Away'} team player ${index + 1}`}
        />
      ))}
      
      <Button size="sm" onClick={addPlayer}>Add Player</Button>
    </Stack>
  );
};

const CreateGameForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    teamA: { name: '', logo: '', players: [''] },
    teamB: { name: '', logo: '', players: [''] },
    startTime: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [presetTeams, setPresetTeams] = useState([]);
  const toast = useToast();
  
  useEffect(() => {
    const fetchPresetTeams = async () => {
      try {
        const res = await axios.get('/api/teams/presets');
        setPresetTeams(res.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load preset teams',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchPresetTeams();
  }, [toast]);

  const handleImageUpload = async (team, file) => {
    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'game_logos');
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Image upload failed');
      setFormData(prev => ({
        ...prev,
        [team]: { ...prev[team], logo: data.secure_url }
      }));
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (team, index, value) => {
    if (index === -1) {
      // Special case for team name
      setFormData(prev => ({
        ...prev,
        [team]: {
          ...prev[team],
          name: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [team]: {
          ...prev[team],
          players: prev[team].players.map((player, i) =>
            i === index ? value : player
          )
        }
      }));
    }
  };
  
  const handlePresetSelect = async (team, teamId) => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      // Fetch detailed team info if needed
      const res = await axios.get(`/api/teams/${teamId}`);
      const teamData = res.data;
      
      setFormData(prev => ({
        ...prev,
        [team]: {
          name: teamData.name,
          logo: teamData.logo,
          players: teamData.players || [''],
          _id: teamData._id
        }
      }));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load team details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); 
    }
  };

  const handleSubmit = () => {
    if (!formData.teamA.name || !formData.teamB.name || !formData.startTime) {
      toast({
        title: 'Error',
        description: 'Please fill in team names and start time.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onCreate(formData);
  };

  return (
    <Stack spacing={4}>
      {loading ? (
        <FormSkeleton />
      ) : (
        <>
          <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
            <TeamInput 
              team="teamA"
              formData={formData}
              onChange={handleImageUpload}
              onPlayerChange={(index, value) => handlePlayerChange('teamA', index, value)}
              presetTeams={presetTeams}
              onPresetSelect={handlePresetSelect}
            />
            <TeamInput 
              team="teamB"
              formData={formData}
              onChange={handleImageUpload}
              onPlayerChange={(index, value) => handlePlayerChange('teamB', index, value)}
              presetTeams={presetTeams}
              onPresetSelect={handlePresetSelect}
            />
          </Flex>
          
          <FormControl>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              aria-label="Game start time"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Input
              placeholder="E.g., Basketball, Soccer, etc."
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              aria-label="Game category"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Game description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              aria-label="Game description"
            />
          </FormControl>
          
          <Button colorScheme="green" onClick={handleSubmit}>
            Create Game
          </Button>
        </>
      )}
    </Stack>
  );
};

export default CreateGameForm;