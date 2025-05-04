import { useState, useCallback } from 'react';

/**
 * Custom hook for managing tags
 * 
 * @param {Object} options
 * @param {Array} options.defaultTags - Initial tags
 * @param {number} options.maxTags - Maximum number of tags allowed
 * @param {Function} options.onChange - Callback when tags change
 * @param {Array} options.defaultColors - Optional color schemes for tags
 * @returns {Object} Tag management functions and state
 */
export const useTags = ({ defaultTags = [], maxTags, onChange, defaultColors }) => {
  const [tags, setTags] = useState(defaultTags);

  const addTag = useCallback((tag) => {
    if (tags.length >= maxTags) return;
    
    const newTag = {
      ...tag,
      color: defaultColors?.[tags.length % defaultColors.length]
    };
    
    const newTags = [...tags, newTag];
    setTags(newTags);
    onChange?.(newTags);
  }, [tags, maxTags, onChange, defaultColors]);

  const removeTag = useCallback((tagId) => {
    const newTags = tags.filter(tag => tag.id !== tagId);
    setTags(newTags);
    onChange?.(newTags);
  }, [tags, onChange]);

  const removeLastTag = useCallback(() => {
    if (tags.length === 0) return;
    const newTags = tags.slice(0, -1);
    setTags(newTags);
    onChange?.(newTags);
  }, [tags, onChange]);

  const hasReachedMax = tags.length >= maxTags;

  return {
    tags,
    addTag,
    removeTag,
    removeLastTag,
    hasReachedMax
  };
}; 