import React from 'react';
import { Flex, Box, Button, useColorModeValue } from '@chakra-ui/react';
import { GameWidget } from './GameWidget';
import { motion, AnimatePresence } from 'framer-motion';

export const GameWidgetList = ({ games, onWidgetClick, onMoreClick }) => {
  if (!games || games.length === 0) {
    return (
      <Box textAlign="center" p={6} color={useColorModeValue('gray.400', 'gray.500')} fontWeight="bold">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          🏟️ No games currently.<br />Check back later!
        </motion.div>
      </Box>
    );
  }
  if (games.length <= 2) {
    return (
      <Flex gap={4} flexWrap="wrap" justify="center">
        <AnimatePresence>
          {Array.isArray(games) && games.map(game => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GameWidget {...game} onClick={() => onWidgetClick && onWidgetClick(game)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Flex>
    );
  }
  return (
    <Flex gap={4} flexWrap="wrap" justify="center" align="center">
      <AnimatePresence>
        {Array.isArray(games) && games.slice(0, 2).map(game => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameWidget {...game} onClick={() => onWidgetClick && onWidgetClick(game)} />
          </motion.div>
        ))}
      </AnimatePresence>
      <Button onClick={onMoreClick} variant="outline" colorScheme="blue" minW="100px">
        +{games.length - 2} more
      </Button>
    </Flex>
  );
};

export default GameWidgetList; 