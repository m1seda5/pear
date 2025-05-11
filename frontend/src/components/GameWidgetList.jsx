import React, { useState, useEffect } from 'react';
import { Flex, Box, Button, useColorModeValue } from '@chakra-ui/react';
import { GameWidget } from './GameWidget';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

export const GameWidgetList = ({ games: initialGames, onWidgetClick, onMoreClick, onAdminEdit }) => {
  const [games, setGames] = useState(initialGames || []);

  useEffect(() => {
    const socket = io();
    
    socket.on('gameUpdated', (updatedGame) => {
      setGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g));
    });

    socket.on('gameCreated', (newGame) => {
      setGames(prev => [newGame, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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