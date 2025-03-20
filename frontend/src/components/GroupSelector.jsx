import { useEffect, useState } from "react";
import { Flex, Text, Spinner, Select } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";

const GroupSelector = ({ onGroupSelect, defaultValue = "all", userRole }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(defaultValue);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/groups");
        
        if (!res.ok) {
          // Handle non-200 responses without throwing an error
          if (res.status === 404) {
            // 404 is an expected case - user has no groups
            setGroups([]);
            return;
          }
          throw new Error(`Failed to fetch groups: ${res.status}`);
        }
        
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        // Don't show toast for empty groups - this is normal for some users
        if (error.message !== "Failed to fetch groups: 404") {
          showToast("Error", "Failed to load custom groups. Using default settings.", "warning");
        }
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [showToast]);

  const handleGroupChange = (e) => {
    const value = e.target.value;
    setSelectedGroup(value);
    onGroupSelect(value);
  };

  // If user is a student with no groups, they can only post to "all"
  if (userRole === "student" && groups.length === 0) {
    return (
      <Flex direction="column" mb={4}>
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          Post to:
        </Text>
        <Select value="all" isDisabled>
          <option value="all">Everyone</option>
        </Select>
      </Flex>
    );
  }

  return (
    <Flex direction="column" mb={4}>
      <Text fontSize="sm" fontWeight="bold" mb={1}>
        Post to:
      </Text>
      {loading ? (
        <Flex justify="center" my={2}>
          <Spinner size="sm" />
        </Flex>
      ) : (
        <Select value={selectedGroup} onChange={handleGroupChange}>
          <option value="all">Everyone</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </Select>
      )}
    </Flex>
  );
};

export default GroupSelector;