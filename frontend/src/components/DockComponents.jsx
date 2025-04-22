// DockComponents.js - Core dock functionality
// DockComponents.js - Core dock functionality with fixed hover animation
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';

// Constants for dock component
const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Create Dock Context
const DockContext = createContext(undefined);

function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

// Main Dock component
function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const { colorMode } = useColorMode();
  const dockRef = useRef(null);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const [visibleItems, setVisibleItems] = useState(null);
  const [showCollapsedMenu, setShowCollapsedMenu] = useState(false);
  const containerRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const updateVisibleItems = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      
      // Dynamic calculation based on available space
      const itemCount = Children.count(children);
      const itemWidth = 64; // Average width of an item
      const visibleCount = Math.floor(containerWidth / itemWidth);
      
      setVisibleItems(visibleCount < itemCount ? visibleCount - 1 : null);
    };

    updateVisibleItems();
    window.addEventListener('resize', _.debounce(updateVisibleItems, 200));
    
    return () => {
      window.removeEventListener('resize', updateVisibleItems);
    };
  }, [children]);

  // The critical function for handling mouse position
  const handleMouseMove = (e) => {
    if (!dockRef.current) return;
    
    // Get dock position relative to viewport
    const dockRect = dockRef.current.getBoundingClientRect();
    
    // Calculate mouse X position relative to the dock
    const relativeMouseX = e.clientX - dockRect.left;
    
    // Set values for animation
    isHovered.set(1);
    mouseX.set(relativeMouseX);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    mouseX.set(Infinity);
  };

  return (
    <MotionBox
      style={{
        height: height,
      }}
      mx={2}
      display="flex"
      maxWidth="full"
      alignItems="flex-end"
      overflowX="auto"
      justifyContent="center"
      mt={6}
      mb={10}
      sx={{
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <MotionFlex
        ref={(el) => {
          containerRef.current = el;
          dockRef.current = el;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        mx="auto"
        width="fit-content"
        gap={4}
        borderRadius="3xl"
        bg={colorMode === "dark" ? "gray.800" : "gray.50"}
        px={4}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
        alignItems="center"
        justifyContent="center"
        boxShadow={colorMode === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.1)"}
        position="relative"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {visibleItems === null ? (
            children
          ) : (
            <>
              {Children.toArray(children).slice(0, visibleItems).map((child, index) => (
                <Box key={index}>{child}</Box>
              ))}
              
              {/* More menu for collapsed items */}
              <DockItem onClick={() => setShowCollapsedMenu(!showCollapsedMenu)}>
                <DockIcon>
                  <Box fontSize="xl" fontWeight="bold">•••</Box>
                </DockIcon>
                <DockLabel>More</DockLabel>
              </DockItem>
              
              {showCollapsedMenu && (
                <MotionBox
                  position="absolute"
                  top="100%"
                  right="0"
                  mt={2}
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  borderRadius="xl"
                  boxShadow="lg"
                  p={2}
                  zIndex={10}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Flex direction="column" gap={2}>
                    {Children.toArray(children).slice(visibleItems).map((child, index) => (
                      <Box key={index} p={2}>{child}</Box>
                    ))}
                  </Flex>
                </MotionBox>
              )}
            </>
          )}
        </DockProvider>
      </MotionFlex>
    </MotionBox>
  );
}

// DockItem component - this is where the hover magic happens
function DockItem({ children, className, onClick, isDisabled }) {
  const ref = useRef(null);
  const { mouseX, spring, distance, magnification } = useDock();
  const itemHovered = useMotionValue(0);

  // This transform is critical for the effect to work properly
  const mouseDistance = useTransform(mouseX, (val) => {
    if (!ref.current) return 0;
    
    const domRect = ref.current.getBoundingClientRect();
    const itemCenter = domRect.left + domRect.width / 2;
    
    // Calculate distance from mouse to center of this item
    // We need to adjust for the dock's position by using the item's actual position
    // rather than relative to the dock container
    return Math.abs(val - (itemCenter - domRect.left));
  });

  // This is where the magic happens - transform distance to width
  const widthTransform = useTransform(
    mouseDistance,
    [0, distance],
    [magnification, 40],
    {
      clamp: true // This ensures values stay within our defined range
    }
  );

  // Apply spring physics for smooth animation
  const width = useSpring(widthTransform, spring);

  return (
    <MotionBox
      ref={ref}
      style={{ width }} // This directly applies the animated width
      onHoverStart={() => itemHovered.set(1)}
      onHoverEnd={() => itemHovered.set(0)}
      onFocus={() => itemHovered.set(1)}
      onBlur={() => itemHovered.set(0)}
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      className={className}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { width, isHovered: itemHovered, isDisabled })
      )}
    </MotionBox>
  );
}

// DockLabel component
function DockLabel({ children, className, ...rest }) {
  const { isHovered, isDisabled } = rest;
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          position="absolute"
          top="-6"
          left="50%"
          width="fit-content"
          whiteSpace="pre"
          borderRadius="md"
          border="1px solid"
          borderColor={isDisabled ? "red.300" : (colorMode === "dark" ? "whiteAlpha.300" : "gray.200")}
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          px={2}
          py={0.5}
          fontSize="xs"
          color={isDisabled ? disabledColor : (colorMode === "dark" ? "white" : "gray.800")}
          role="tooltip"
          style={{ x: '-50%' }}
          className={className}
          zIndex={10}
        >
          {children}
        </MotionBox>
      )}
    </AnimatePresence>
  );
}

// DockIcon component
function DockIcon({ children, className, ...rest }) {
  const { width, isDisabled } = rest;
  const { colorMode } = useColorMode();

  // Scale icon size proportionally with the container width
  const widthTransform = useTransform(width, (val) => val / 2);

  const activeColor = colorMode === "dark" ? "teal.300" : "teal.600";
  const disabledColor = colorMode === "dark" ? "red.400" : "red.500";
  const normalColor = colorMode === "dark" ? "whiteAlpha.900" : "gray.700";
  const iconColor = isDisabled ? disabledColor : normalColor;

  return (
    <MotionBox
      style={{ width: widthTransform }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      color={iconColor}
      _hover={{
        "& .nav-icon-underline": {
          width: "80%",
          opacity: 1
        }
      }}
      className={className}
    >
      {children}
      <Box
        className="nav-icon-underline"
        position="absolute"
        bottom="-8px"
        left="50%"
        width="0%"
        height="2px"
        bg={isDisabled ? disabledColor : activeColor}
        transition="all 0.2s ease-out"
        transform="translateX(-50%)"
        borderRadius="full"
        opacity={0}
      />
    </MotionBox>
  );
}

export { Dock, DockItem, DockLabel, DockIcon };