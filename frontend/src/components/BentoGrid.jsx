// components/BentoGrid.jsx
import { Box, useBreakpointValue } from "@chakra-ui/react";

export function BentoGrid({ children }) {
  // Responsive: 1 col on mobile, 2 on tablet, 3 on desktop
  const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3 });
  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={6}
      w="100%"
      autoRows="22rem"
      mt={6}
      mb={8}
    >
      {children}
    </Box>
  );
}