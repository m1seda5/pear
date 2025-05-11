import React from 'react';
import { Flex, Box, Button, useColorModeValue } from '@chakra-ui/react';
import { GameWidget } from './GameWidget';
import { motion, AnimatePresence } from 'framer-motion';

export const GameWidgetList = ({ games, onWidgetClick, onMoreClick, onAdminEdit }) => {
  if (!games || games.length === 0) {
    return <GameWidget noGames />;
  }
  // Show up to 3, then +X more
  const visibleGames = games.slice(0, 3);
  const moreCount = games.length - visibleGames.length;
  return (
    <>
      {visibleGames.map(game => (
        <GameWidget key={game.id} game={game} onAdminEdit={onAdminEdit} />
      ))}
      {moreCount > 0 && (
        <div style={{ margin: 8, textAlign: 'center' }}>
          <button style={{
            background: '#eee',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>+{moreCount} more</button>
        </div>
      )}
    </>
  );
};

export default GameWidgetList; 