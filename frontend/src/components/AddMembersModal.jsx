import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const AddMembersModal = ({ isOpen, onClose, conversationId, onMemberAdded }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showToast = (message, type = "error") => {
    if (type === "error") {
      setError(message);
      setTimeout(() => setError(""), 3000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleSearchUser = async () => {
    if (!searchInput.trim()) return;

    try {
      const res = await fetch(`/api/users/search/${encodeURIComponent(searchInput.toLowerCase())}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to search user");
      if (data._id === currentUser._id) return;

      setSelectedUsers(prev => [...new Set([...prev, data])]);
      setSearchInput("");
    } catch (error) {
      showToast(error.message);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      showToast("Please select at least one user to add");
      return;
    }

    setLoading(true);
    try {
      const promises = selectedUsers.map(user => 
        fetch(`/api/messages/groups/${conversationId}/add`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ userId: user._id })
        }).then(res => res.json())
      );

      await Promise.all(promises);
      
      showToast("Members added successfully", "success");
      onMemberAdded && onMemberAdded(selectedUsers);
      onClose();
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal is-active friendkit-modal">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h3 className="modal-card-title">Add Members</h3>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          {error && (
            <div className="notification is-danger is-light">
              <button className="delete" onClick={() => setError("")}></button>
              {error}
            </div>
          )}
          {success && (
            <div className="notification is-success is-light">
              <button className="delete" onClick={() => setSuccess("")}></button>
              {success}
            </div>
          )}

          <div className="field">
            <div className="control">
              {selectedUsers.map(user => (
                <span key={user._id} className="tag is-primary is-medium">
                  {user.username}
                  <button 
                    className="delete is-small"
                    onClick={() => setSelectedUsers(prev => 
                      prev.filter(u => u._id !== user._id)
                    )}
                  ></button>
                </span>
              ))}
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
              />
            </div>
            <div className="control">
              <button className="button is-primary" onClick={handleSearchUser}>
                Search
              </button>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button 
                className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
                onClick={handleAddMembers}
                disabled={loading}
              >
                Add Selected Members
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddMembersModal;