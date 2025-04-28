// components/BentoGrid.jsx
import { Box, useBreakpointValue } from "@chakra-ui/react";

export function BentoGrid({ children }) {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const rows = useBreakpointValue({ base: "22rem", lg: "24rem" });

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={6}
      w="100%"
      autoRows={{ base: "22rem", lg: "24rem" }}
      mt={6}
      mb={8}
      px={{ base: 2, md: 8 }}
      sx={{
        "& > *": {
          minW: "0", // Prevent grid blowout
          transition: "all 0.3s ease",
        },
      }}
    >
      {children}
    </Box>
  );
}