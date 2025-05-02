import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";

const ReviewerGroups = () => {
  const user = useRecoilValue(userAtom);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", permissions: { postReview: false } });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const { get } = useFetch();

  useEffect(() => {
    const loadGroups = async () => {
      const data = await get("/api/reviewer-groups");
      if (data) setGroups(data);
    };
    if (user?.role === "admin") loadGroups();
  }, [user]);

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(`/api/users/search/${query}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const res = await fetch("/api/reviewer-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroup.name,
          permissions: newGroup.permissions,
          members: selectedMembers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGroups([...groups, data]);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      // Optionally show error
    }
  };

  return (
    <div className="reviewer-groups-page">
      <div className="friendkit-toolbar is-flex is-justify-content-space-between mb-4">
        <h2 className="title is-4">Reviewer Groups</h2>
        <button className="button is-solid accent-button" onClick={() => setIsCreateModalOpen(true)}>
          <i data-feather="plus"></i> New Group
        </button>
      </div>
      <div className="field mb-4">
        <div className="control">
          <input
            className="input"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="columns is-multiline">
        {groups.length === 0 ? (
          <div className="column is-12 has-text-centered">
            <div className="empty-state"><div className="empty-state-icon"><i data-feather="users"></i></div><div className="empty-state-content"><h3>No reviewer groups found</h3></div></div>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="column is-4">
              <div className="card friendkit-group-card">
                <div className="card-heading">
                  <h4>{group.name}</h4>
                  <span className="tag is-info is-light ml-2">{group.permissions.postReview ? "Can Review Posts" : "No Permissions"}</span>
                </div>
                <div className="card-body">
                  <div className="mb-2"><strong>Members:</strong></div>
                  {group.members.length === 0 ? (
                    <span className="friendkit-placeholder">No members</span>
                  ) : (
                    group.members.map((member) => (
                      <div
                        key={member._id}
                        className="friendkit-group-member is-flex is-align-items-center mb-2"
                        onClick={() => setSelectedReviewer(member._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img className="avatar is-small mr-2" src={member.profilePic || "/default-avatar.png"} alt={member.username} />
                        <span>{member.username}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="card-footer">
                  <button className="button is-small mr-2">Edit</button>
                  <button className="button is-small is-danger">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isCreateModalOpen && (
        <div className="modal is-active friendkit-modal">
          <div className="modal-background" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <h3 className="modal-card-title">Create New Group</h3>
              <button className="delete" aria-label="close" onClick={() => setIsCreateModalOpen(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Group Name</label>
                <div className="control">
                  <input className="input" value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input type="checkbox" checked={newGroup.permissions.postReview} onChange={e => setNewGroup({ ...newGroup, permissions: { ...newGroup.permissions, postReview: e.target.checked } })} />
                  <span className="ml-2">Can Review Posts</span>
                </label>
              </div>
              <div className="field">
                <label className="label">Add Members</label>
                <div className="control is-flex">
                  <input className="input" placeholder="Search users..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); handleSearch(e.target.value); }} />
                </div>
                {searchResults.length > 0 && (
                  <div className="friendkit-search-results">
                    {searchResults.map((user) => (
                      <div key={user._id} className="friendkit-search-result" onClick={() => setSelectedMembers([...selectedMembers, user._id])}>
                        <span>{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="friendkit-selected-users mt-2">
                  {selectedMembers.length === 0 ? (
                    <span className="friendkit-placeholder">No members selected</span>
                  ) : (
                    selectedMembers.map((id) => (
                      <span key={id} className="tag is-primary is-medium">
                        {id}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-solid accent-button" onClick={handleCreateGroup}>Create Group</button>
              <button className="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            </footer>
          </div>
        </div>
      )}
      {selectedReviewer && (
        <AuditDetails userId={selectedReviewer} onClose={() => setSelectedReviewer(null)} />
      )}
    </div>
  );
};

export default ReviewerGroups;
