import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import AddMembersModal from "./AddMembersModal";

const GroupInfoModal = ({ isOpen, onClose, conversation, onGroupUpdate }) => {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(conversation?.groupName || "");
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateGroup = async () => {
    if (!groupName.trim()) {
      showToast("Error", "Group name cannot be empty", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/groups/${conversation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ groupName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onGroupUpdate(data);
      setIsEditing(false);
      showToast("Success", "Group updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/groups/${conversation._id}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onGroupUpdate(data);
      showToast("Success", "Member removed successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberAdded = (updatedConversation) => {
    onGroupUpdate(updatedConversation);
    showToast("Success", "Member added successfully", "success");
  };

  if (!isOpen || !conversation) return null;

  return (
    <div className="modal is-active friendkit-modal">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          {isEditing ? (
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  disabled={isLoading}
                />
              </div>
              <div className="control">
                <button className="button is-success" onClick={handleUpdateGroup} disabled={isLoading}>Save</button>
              </div>
              <div className="control">
                <button className="button" onClick={() => { setIsEditing(false); setGroupName(conversation.groupName); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="level is-mobile w-100">
              <div className="level-left">
                <div className="level-item">
                  <h3 className="modal-card-title">{conversation.groupName}</h3>
                </div>
                {currentUser._id === conversation.groupAdmin && (
                  <div className="level-item">
                    <button className="button is-small is-info" onClick={() => setIsEditing(true)}>
                      <i data-feather="edit-2"></i>
                    </button>
                  </div>
                )}
              </div>
              <button className="delete" aria-label="close" onClick={onClose}></button>
            </div>
          )}
        </header>
        <section className="modal-card-body">
          <div className="content">
            <h4>Members ({conversation.participants.length})</h4>
            <ul className="friendkit-member-list">
              {conversation.participants.map(participant => (
                <li key={participant._id} className="friendkit-member-item">
                  <div className="friendkit-member-avatar">
                    <img src={participant.profilePic} alt={participant.username} className="avatar" />
                  </div>
                  <div className="friendkit-member-info">
                    <span className="username">{participant.username}</span>
                    {participant._id === conversation.groupAdmin && (
                      <span className="tag is-info is-light ml-2">Admin</span>
                    )}
                  </div>
                  {currentUser._id === conversation.groupAdmin && participant._id !== currentUser._id && (
                    <button className="button is-small is-danger ml-2" onClick={() => handleRemoveMember(participant._id)} disabled={isLoading}>
                      <i data-feather="user-x"></i> Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {currentUser._id === conversation.groupAdmin && (
              <button className="button is-primary is-fullwidth mt-3" onClick={() => setIsAddMembersOpen(true)} disabled={isLoading}>
                <i data-feather="user-plus"></i> Add Members
              </button>
            )}
          </div>
        </section>
      </div>
      <AddMembersModal
        isOpen={isAddMembersOpen}
        onClose={() => setIsAddMembersOpen(false)}
        conversationId={conversation._id}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};

export default GroupInfoModal;