import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Text, Button, useColorModeValue, IconButton, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useDrag from '../hooks/useDrag'; // Create a custom drag hook

const HOUSES = [
  { name: "Samburu", color: "#4CAF50", key: "samburu", bg: "#dbeedb" },
  { name: "Mara", color: "#1E40AF", key: "mara", bg: "#dbeafe" },
  { name: "Amboseli", color: "#EF4444", key: "amboseli", bg: "#fde2e2" },
  { name: "Tsavo", color: "#FBBF24", key: "tsavo", bg: "#fdf6e3" },
];

const HousePointTracker = () => {
  const [points, setPoints] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const isAdmin = currentUser?.role === 'admin';
  const toast = useToast();
  const { position, startDrag } = useDrag('housePointPosition', { x: window.innerWidth - 400, y: 180 });
  const [dragging, setDragging] = useState(false);
  const pinkMode = typeof window !== 'undefined' && localStorage.getItem('pinkMode') === 'true';

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
    const interval = setInterval(fetchPoints, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchPoints]);

  const handleUpdate = async (updates) => {
    try {
      const { data } = await axios.put("/api/house-points", updates);
      setPoints(data);
      toast({ title: "Updated!", status: "success", duration: 1000 });
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

  if (!isOpen || !points) return null;

  return (
    <Box
      position="fixed"
      left={`${position.x}px`}
      top={`${position.y}px`}
      zIndex="overlay"
      w="380px"
      bg={pinkMode && window.matchMedia('(prefers-color-scheme: light)').matches ? '#e9a1ba' : useColorModeValue("whiteAlpha.900", "gray.800")}
      borderRadius="lg"
      p={4}
      boxShadow="2xl"
      borderWidth="1px"
      onDoubleClick={() => isAdmin && setEditMode(!editMode)}
    >
      <Flex justify="space-between" align="center" mb={4} onMouseDown={e => { startDrag(e); setDragging(true); }} onMouseUp={() => setDragging(false)} cursor={dragging ? 'grabbing' : 'grab'}>
        <Text fontSize="xl" fontWeight="bold">House Points</Text>
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          onClick={() => setIsOpen(false)}
          aria-label="Close tracker"
          bg={pinkMode && window.matchMedia('(prefers-color-scheme: light)').matches ? '#cc2279' : undefined}
          color={pinkMode && window.matchMedia('(prefers-color-scheme: light)').matches ? 'white' : undefined}
          _hover={{ bg: pinkMode && window.matchMedia('(prefers-color-scheme: light)').matches ? '#e9a1ba' : undefined }}
        />
      </Flex>

      {HOUSES.map((house) => (
        <Flex key={house.key} align="center" mb={4} gap={3}>
          <Box w={5} h={5} borderRadius="full" bg={house.color} />
          
          <Text flex={1} fontSize="md" fontWeight="medium">{house.name}</Text>
          
          <Box flex={2} position="relative" h="28px">
            {points[house.key] > 0 && (
              <Box
                w={`${points[house.key]}%`}
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
            )}
          </Box>

          {editMode && isAdmin && (
            <Flex gap={2}>
              <Button size="xs" px={3} onClick={() => handleUpdate({ 
                ...points, 
                [house.key]: Math.min(100, points[house.key] + 2)
              })}>
                +2
              </Button>
              <Button size="xs" px={3} onClick={() => handleUpdate({ 
                ...points, 
                [house.key]: Math.max(0, points[house.key] - 2)
              })}>
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