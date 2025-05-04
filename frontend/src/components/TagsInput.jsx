import { useState, useRef } from 'react';
import { useTags } from '../hooks/use-tags';
import {
  Box,
  Flex,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Input,
  useColorModeValue
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";

/**
 * A reusable tag input component
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the tags input
 * @param {Array} props.suggestions - Suggestions to show in dropdown
 * @param {Array} props.selectedTags - Currently selected tags
 * @param {Function} props.onTagsChange - Callback when tags change
 * @param {number} [props.maxTags=10] - Maximum number of tags allowed
 * @param {string} [props.placeholderText="No items selected"] - Text to show when no tags
 * @param {Array} [props.colorSchemes] - Custom color schemes for tags
 */
const TagsInput = ({
  label,
  suggestions = [],
  selectedTags = [],
  onTagsChange,
  maxTags = 10,
  placeholderText = "No items selected",
  colorSchemes = []
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const tagBg = useColorModeValue("blue.100", "blue.700");
  const menuBg = useColorModeValue("white", "gray.700");
  
  const { tags, addTag, removeTag, removeLastTag, hasReachedMax } = useTags({
    defaultTags: selectedTags,
    maxTags,
    onChange: onTagsChange,
    defaultColors: colorSchemes.length > 0 ? colorSchemes : undefined
  });

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      removeLastTag();
    }
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      // Create a custom tag from input
      addTag({ 
        id: inputValue.toLowerCase().replace(/\s+/g, '-'), 
        label: inputValue.trim() 
      });
      setInputValue("");
    }
  };

  // Filter out suggestions that are already selected
  const availableSuggestions = suggestions.filter(
    suggestion => !tags.find(tag => tag.id === suggestion.id)
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="medium">{label}</Text>
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            size="sm"
            colorScheme="blue"
            variant="outline"
            icon={<Plus />}
            isDisabled={availableSuggestions.length === 0 || hasReachedMax}
          />
          <MenuList bg={menuBg} maxH="200px" overflowY="auto">
            {availableSuggestions.map((suggestion) => (
              <MenuItem
                key={suggestion.id}
                onClick={() => {
                  addTag(suggestion);
                  inputRef.current?.focus();
                }}
              >
                {suggestion.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      
      <Box
        border="1px solid"
        borderColor="inherit"
        borderRadius="md"
        p={2}
        onClick={() => inputRef.current?.focus()}
      >
        <Flex flexWrap="wrap" gap={2}>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
              bg={tag.color || tagBg}
              mb={1}
            >
              <TagLabel>{tag.label}</TagLabel>
              <TagCloseButton 
                onClick={() => removeTag(tag.id)}
                aria-label={`Remove ${tag.label}`}
              />
            </Tag>
          ))}
          
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasReachedMax ? `Max ${maxTags} items reached` : tags.length === 0 ? placeholderText : "Type to add..."}
            variant="unstyled"
            size="sm"
            flexGrow={1}
            minW="120px"
            isDisabled={hasReachedMax}
          />
        </Flex>
      </Box>
      
      {suggestions.length > 0 && (
        <Wrap spacing={2} mt={2}>
          {availableSuggestions.slice(0, 5).map((suggestion) => (
            <WrapItem key={suggestion.id}>
              <Tag
                size="sm"
                variant="outline"
                colorScheme="blue"
                cursor="pointer"
                onClick={() => {
                  addTag(suggestion);
                  inputRef.current?.focus();
                }}
                _hover={{ bg: tagBg, opacity: 0.8 }}
              >
                <TagLabel>{suggestion.label}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Box>
  );
};

export default TagsInput;