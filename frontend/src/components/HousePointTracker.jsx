// Frontend: HousePointTracker.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Text, Button, IconButton, useToast, useColorMode } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useDrag from '../hooks/useDrag';

const HOUSES = [
  { name: "Samburu", color: "#4CAF50", key: "samburu", bg: "#dbeedb" },
  { name: "Mara", color: "#1E40AF", key: "mara", bg: "#dbeafe" },
  { name: "Amboseli", color: "#EF4444", key: "amboseli", bg: "#fde2e2" },
  { name: "Tsavo", color: "#FBBF24", key: "tsavo", bg: "#fdf6e3" },
];

const HousePointTracker = () => {
  const [points, setPoints] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const isAdmin = currentUser?.role === 'admin';
  const toast = useToast();
  const { position, startDrag } = useDrag('housePointPosition', { x: window.innerWidth - 400, y: 180 });
  const [dragging, setDragging] = useState(false);
  const { colorMode } = useColorMode();

  const fetchPoints = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/house-points");
      setPoints(data);
    } catch (error) {
      toast({ title: "Failed to fetch points", status: "error" });
    }
  }, [toast]);

  useEffect(() => {
    fetchPoints();
    const interval = setInterval(fetchPoints, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchPoints]);

  const handlePointsChange = async (houseKey, delta) => {
    try {
      const { data } = await axios.put("/api/house-points", { 
        house: houseKey,
        delta: delta 
      });
      setPoints(data);
      toast({ 
        title: `Updated ${HOUSES.find(h => h.key === houseKey).name}!`,
        status: "success",
        duration: 1000 
      });
    } catch (error) {
      toast({ title: "Update failed", status: "error" });
    }
  };

  const handleReset = async () => {
    try {
      const { data } = await axios.post("/api/house-points/reset");
      setPoints(data);
      toast({ title: "Reset complete!", status: "success" });
    } catch (error) {
      toast({ title: "Reset failed", status: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      left={`${position.x}px`}
      top={`${position.y}px`}
      zIndex="overlay"
      w="380px"
      bg={useColorModeValue("whiteAlpha.900", "gray.800")}
      borderRadius="lg"
      p={4}
      boxShadow="2xl"
      borderWidth="1px"
    >
      <Flex justify="space-between" align="center" mb={4} 
            onMouseDown={e => { startDrag(e); setDragging(true); }} 
            onMouseUp={() => setDragging(false)} 
            cursor={dragging ? 'grabbing' : 'grab'}>
        <Text fontSize="xl" fontWeight="bold">House Points</Text>
        <Flex gap={2}>
          {isAdmin && (
            <Button size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Done' : 'Edit'}
            </Button>
          )}
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close tracker"
          />
        </Flex>
      </Flex>

      {HOUSES.map((house) => (
        <Flex key={house.key} align="center" mb={4} gap={3}>
          <Box w={5} h={5} borderRadius="full" bg={house.color} />
          
          <Text flex={1} fontSize="md" fontWeight="medium">{house.name}</Text>
          
          <Box flex={2} position="relative" h="28px">
            <Box
              w={`${points[house.key] || 0}%`}
              h="full"
              bg={house.color}
              borderRadius="full"
              transition="width 0.3s ease"
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                bg: house.bg,
                borderRadius: 'full'
              }}
            />
          </Box>

          {editMode && isAdmin && (
            <Flex gap={2}>
              <Button size="xs" px={3} onClick={() => handlePointsChange(house.key, 2)}>
                +2
              </Button>
              <Button size="xs" px={3} onClick={() => handlePointsChange(house.key, -2)}>
                -2
              </Button>
            </Flex>
          )}
        </Flex>
      ))}

      {editMode && isAdmin && (
        <Button mt={4} w="full" colorScheme="red" onClick={handleReset}>
          Reset All Houses
        </Button>
      )}
    </Box>
  );
};

export default HousePointTracker;