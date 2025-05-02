import { useEffect, useState } from "react";
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
          if (res.status === 404) {
            setGroups([]);
            return;
          }
          throw new Error(`Failed to fetch groups: ${res.status}`);
        }
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
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

  if (userRole === "student" && groups.length === 0) {
    return (
      <div className="friendkit-group-selector">
        <label className="label">Post to:</label>
        <select className="input" value="all" disabled>
          <option value="all">Everyone</option>
        </select>
      </div>
    );
  }

  return (
    <div className="friendkit-group-selector">
      <label className="label">Post to:</label>
      {loading ? (
        <div className="friendkit-loading-wrapper"><div className="friendkit-loader"></div><div className="loading-text">Loading groups...</div></div>
      ) : (
        <select className="input" value={selectedGroup} onChange={handleGroupChange}>
          <option value="all">Everyone</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default GroupSelector;