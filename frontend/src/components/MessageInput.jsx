import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageInput = ({ value, onChange, onSend, sending, filePreview, onFileSelect }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageRef = useRef(null);

  return (
    <div className="friendkit-message-input">
      <form className="friendkit-message-input-form" onSubmit={e => { e.preventDefault(); onSend(e); }}>
        <button
          type="button"
          className="button is-icon is-light"
          onClick={() => imageRef.current.click()}
          title="Add image"
        >
          <i data-feather="image"></i>
        </button>
        <input
          type="file"
          hidden
          ref={imageRef}
          onChange={onFileSelect}
          accept="image/*,video/*"
        />
        <input
          className="input friendkit-message-input-text"
          type="text"
          placeholder="Type a message..."
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
        />
        <button
          type="button"
          className="button is-icon is-light"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add emoji"
        >
          <i data-feather="smile"></i>
        </button>
        <button
          type="submit"
          className={`button is-solid primary-button${sending ? " is-loading" : ""}`}
          disabled={sending || !value.trim()}
          title="Send"
        >
          <i data-feather="send"></i>
        </button>
      </form>
      {filePreview && (
        <div className="friendkit-message-file-preview">
          <img src={filePreview} alt="Preview" />
          <button className="button is-icon is-danger" onClick={() => onFileSelect({ target: { files: [] } })}>
            <i data-feather="x"></i>
          </button>
        </div>
      )}
      {showEmojiPicker && (
        <div className="friendkit-emoji-picker">
          {/* Integrate your emoji picker here if needed */}
          <span>Emoji picker</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
