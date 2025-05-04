import { useState } from "react";

/**
 * @typedef {Object} Tag
 * @property {string} id - Unique identifier for the tag
 * @property {string} label - Display text for the tag
 * @property {string} [color] - Optional color styling for the tag
 */

/**
 * Custom hook for managing tags
 * @param {Object} options
 * @param {Function} [options.onChange] - Callback when tags change
 * @param {Array} [options.defaultTags] - Initial tags
 * @param {number} [options.maxTags] - Maximum number of tags allowed
 * @param {Array} [options.defaultColors] - Default color classes for tags
 * @returns {Object} Tag management methods and state
 */
export function useTags({
    onChange,
    defaultTags = [],
    maxTags = 10,
    defaultColors = [
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    ],
} = {}) {
    const [tags, setTags] = useState(defaultTags);

    /**
     * Add a new tag
     * @param {Tag} tag - The tag to add
     * @returns {Array|undefined} The updated tags array or undefined if max reached
     */
    function addTag(tag) {
        if (tags.length >= maxTags) return;

        const newTags = [
            ...tags,
            {
                ...tag,
                color:
                    tag.color ||
                    defaultColors[tags.length % defaultColors.length],
            },
        ];
        setTags(newTags);
        onChange?.(newTags);
        return newTags;
    }

    /**
     * Remove a tag by ID
     * @param {string} tagId - ID of tag to remove
     * @returns {Array} The updated tags array
     */
    function removeTag(tagId) {
        const newTags = tags.filter((t) => t.id !== tagId);
        setTags(newTags);
        onChange?.(newTags);
        return newTags;
    }

    /**
     * Remove the last tag in the list
     * @returns {Array|undefined} The updated tags array or undefined if empty
     */
    function removeLastTag() {
        if (tags.length === 0) return;
        return removeTag(tags[tags.length - 1].id);
    }

    return {
        tags,
        setTags,
        addTag,
        removeTag,
        removeLastTag,
        hasReachedMax: tags.length >= maxTags,
    };
}