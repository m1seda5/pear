import GroupInfoModal from "./GroupInfoModal";
import { useState } from "react";

const GroupMessageHeader = ({ conversation }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="friendkit-group-header">
        <div className="group-avatars">
          {(conversation.participants || []).slice(0, 3).map((participant) => (
            <img
              key={participant._id}
              src={participant.profilePic}
              alt={participant.username}
              className="avatar is-group"
            />
          ))}
        </div>
        <div className="group-title">{conversation.groupName}</div>
        <button className="button is-icon is-info" onClick={() => setIsOpen(true)}>
          <i data-feather="info"></i>
        </button>
      </div>
      <GroupInfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        conversation={conversation}
        onGroupUpdate={() => {}}
      />
    </>
  );
};

export default GroupMessageHeader;
