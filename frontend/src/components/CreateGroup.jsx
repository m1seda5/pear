import { useState } from 'react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";

const CreateGroup = ({ onGroupCreated, groups }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3182CE");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const user = useRecoilValue(userAtom);
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/users/search/${searchQuery}`);
      const data = await res.json();
      if (data.error) {
        setSearchResults([]);
        return;
      }
      const filteredResults = Array.isArray(data)
        ? data.filter(u => u._id !== user._id && !selectedUsers.some(selected => selected._id === u._id))
        : [data].filter(u => u._id !== user._id && !selectedUsers.some(selected => selected._id === u._id));
      setSearchResults(filteredResults);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchResults(searchResults.filter(u => u._id !== user._id));
    setSearchQuery("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    setIsCreating(true);
    try {
      const memberIds = [...selectedUsers.map(u => u._id), user._id];
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: groupName,
          description,
          color,
          members: memberIds
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group");
      setGroupName("");
      setDescription("");
      setColor("#3182CE");
      setSelectedUsers([]);
      setSearchResults([]);
      setSearchQuery("");
      setIsOpen(false);
      if (onGroupCreated) onGroupCreated(data);
    } catch (error) {
      // Optionally show error
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button className="button is-solid accent-button" onClick={() => setIsOpen(true)}>
        {t("Create Group")}
      </button>
      {isOpen && (
        <div className="modal is-active friendkit-modal">
          <div className="modal-background" onClick={() => setIsOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <h3 className="modal-card-title">{t("Create Group")}</h3>
              <button className="delete" aria-label="close" onClick={() => setIsOpen(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">{t("Group Name")}</label>
                <div className="control">
                  <input className="input" type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder={t("Enter group name")} />
                </div>
              </div>
              <div className="field">
                <label className="label">{t("Description")}</label>
                <div className="control">
                  <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder={t("Enter group description")} />
                </div>
              </div>
              <div className="field">
                <label className="label">{t("Color")}</label>
                <div className="control">
                  <input className="input" type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 48, height: 32, padding: 0, border: 'none' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">{t("Add Members")}</label>
                <div className="control is-flex">
                  <input className="input" type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t("Search users...")} />
                  <button className="button is-info ml-2" onClick={handleSearch} disabled={isSearching}>{isSearching ? t("Searching...") : t("Search")}</button>
                </div>
                {searchResults.length > 0 && (
                  <div className="friendkit-search-results">
                    {searchResults.map((result) => (
                      <div key={result._id} className="friendkit-search-result" onClick={() => handleAddUser(result)}>
                        <img src={result.profilePic || "/default-avatar.png"} alt={result.username} className="avatar is-small" />
                        <span>{result.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field">
                <label className="label">{t("Selected Members")}</label>
                <div className="friendkit-selected-users">
                  {selectedUsers.length === 0 ? (
                    <span className="friendkit-placeholder">No members selected</span>
                  ) : (
                    selectedUsers.map(user => (
                      <span key={user._id} className="tag is-primary is-medium">
                        {user.username}
                        <button className="delete is-small" onClick={() => handleRemoveUser(user._id)}></button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className={`button is-solid accent-button${isCreating ? " is-loading" : ""}`} onClick={handleCreateGroup} disabled={isCreating}>
                {t("Create Group")}
              </button>
              <button className="button" onClick={() => setIsOpen(false)}>{t("Cancel")}</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateGroup;