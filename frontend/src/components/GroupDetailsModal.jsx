import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";
import useShowToast from '../hooks/useShowToast';

const GroupDetails = ({ isOpen, onClose, group }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showToast = useShowToast();

  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?._id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/groups/${group._id}/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        if (!res.ok) throw new Error("Failed to load group members");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        // Show error notification (replace with Friendkit notification if available)
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) fetchMembers();
  }, [group?._id, isOpen, currentUser.token]);

  const handleLeaveGroup = async () => {
    if (!group?._id) return;
    setIsLeaving(true);
    try {
      const res = await fetch(`/api/groups/${group._id}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to leave group");
      }
      showToast(
        "Success",
        group.creator._id === currentUser._id
          ? t("Group deleted successfully")
          : t("Left group successfully"),
        "success"
      );
      onClose(true);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleProfileClick = (username) => {
    onClose();
    navigate(`/${username}`);
  };

  if (!isOpen || !group) return null;

  return (
    <div className="modal is-active friendkit-modal">
      <div className="modal-background" onClick={() => onClose(false)}></div>
      <div className="modal-card">
        <header className="modal-card-head" style={{ background: group?.color || '#00b894' }}>
          <h3 className="modal-card-title" style={{ color: 'white' }}>{group?.name}</h3>
          <button className="delete" aria-label="close" onClick={() => onClose(false)}></button>
        </header>
        <section className="modal-card-body">
          {group?.description && (
            <div className="mb-4">
              <div className="has-text-grey is-size-7 has-text-weight-medium">{t("Description")}</div>
              <div className="is-size-6">{group.description}</div>
            </div>
          )}
          <div className="mb-4">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <span className="has-text-grey is-size-7 has-text-weight-medium">
                {t("Members")} • {members.length}
              </span>
              {currentUser._id === group?.creator?._id && (
                <span className="tag is-info is-light">{t("Creator")}</span>
              )}
            </div>
            <hr className="dropdown-divider" />
            {isLoading ? (
              <div className="has-text-centered py-4">Loading...</div>
            ) : (
              <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="friendkit-member-item is-flex is-align-items-center is-justify-content-space-between p-2 mb-1"
                    style={{ borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => handleProfileClick(member.username)}
                  >
                    <div className="is-flex is-align-items-center">
                      <img src={member.profilePic} alt={member.username} className="avatar mr-2" style={{ width: 32, height: 32 }} />
                      <span className="is-size-6">{member.username}</span>
                    </div>
                    {member._id === group?.creator?._id && (
                      <span className="tag is-info is-light is-size-7">{t("Creator")}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr className="dropdown-divider my-3" />
          <div className="has-text-centered pt-2">
            <button
              className={`button is-danger is-outlined is-small${isLeaving ? ' is-loading' : ''}`}
              onClick={handleLeaveGroup}
              disabled={isLeaving}
            >
              {currentUser._id === group?.creator?._id ? t("Delete Group") : t("Leave Group")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GroupDetails;