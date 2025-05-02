import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useShowToast } from "../contexts/ShowToastContext";

const GroupCreationModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCommunity, setIsCommunity] = useState(false);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
      setGroupDescription("");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      setIsCommunity(false);
      setGroupAvatar(null);
      setGroupAvatarPreview(null);
      setError("");
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/users/search/${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setError("Failed to search users");
    }
  };

  const handleAddUser = (user) => {
    if (!selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupAvatar(file);
      setGroupAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!groupAvatar) return "";
    const formData = new FormData();
    formData.append("file", groupAvatar);
    formData.append("upload_preset", "ml_default"); // Change to your Cloudinary preset
    const res = await fetch("https://api.cloudinary.com/v1_1/demo/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleCreateGroup = async () => {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName, description: groupDescription }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Group created successfully", "success");
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Group</h2>
        <input
          className="input"
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Group Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="button">Cancel</button>
          <button onClick={handleCreateGroup} className="button is-primary">Create</button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreationModal;