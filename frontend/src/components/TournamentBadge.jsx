// components/TournamentBadge.jsx
const TournamentBadge = ({ game }) => (
    <Badge
      colorScheme="gray"
      variant="subtle"
      leftIcon={<Box w={2} h={2} bg="gray.500" borderRadius="full" />}
    >
      Tournament
      {game.status === 'past' && (
        <Text ml={2} as="span">
          Winner: {getTournamentWinner(game)}
        </Text>
      )}
    </Badge>
  );
  
  // GameCard.jsx - Add conditional rendering:
  {game.type === 'tournament' ? (
    <TournamentBadge game={game} />
  ) : (
    <StatusBadge status={game.status} />
  )}