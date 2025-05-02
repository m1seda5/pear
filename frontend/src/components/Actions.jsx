import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from "react-i18next";

const Actions = ({ post }) => {
    const { t } = useTranslation();
    const user = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [showModal, setShowModal] = useState(false);
    const showToast = useShowToast();

    const handleLikeAndUnlike = async () => {
        if (!user) return showToast("Error", "You must be logged in to like a post", "error");
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch("/api/posts/like/" + post._id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");
            if (!liked) {
                setPosts(posts.map((p) => p._id === post._id ? { ...p, likes: [...p.likes, user._id] } : p));
            } else {
                setPosts(posts.map((p) => p._id === post._id ? { ...p, likes: p.likes.filter((id) => id !== user._id) } : p));
            }
            setLiked(!liked);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLiking(false);
        }
    };

    const handleReply = async () => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch("/api/posts/reply/" + post._id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: reply }),
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");
            setPosts(posts.map((p) => p._id === post._id ? { ...p, replies: [...p.replies, data] } : p));
            showToast("Success", "Reply posted successfully", "success");
            setShowModal(false);
            setReply("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    const handleReplyEmoji = async (emoji) => {
        if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch("/api/posts/reply/" + post._id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: emoji }),
            });
            const data = await res.json();
            if (data.error) return showToast("Error", data.error, "error");
            setPosts(posts.map((p) => p._id === post._id ? { ...p, replies: [...p.replies, data] } : p));
            showToast("Success", "Reply posted successfully", "success");
            setShowModal(false);
            setReply("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div className="friendkit-actions-bar">
            <button className={`button is-icon${liked ? " is-liked" : ""}`} onClick={handleLikeAndUnlike} disabled={isLiking} title={t('Like')}>
                <i data-feather="heart"></i>
                <span>{post.likes.length || 0}</span>
            </button>
            <button className="button is-icon" onClick={() => setShowModal(true)} title={t('Comment')}>
                <i data-feather="message-circle"></i>
                <span>{post.replies.length || 0}</span>
            </button>
            <button className="button is-icon" title={t('Share')}>
                <i data-feather="share-2"></i>
            </button>
            {showModal && (
                <div className="modal is-active friendkit-modal">
                    <div className="modal-background" onClick={() => setShowModal(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <h3 className="modal-card-title">{t('Reply to Post')}</h3>
                            <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className="field">
                                <input
                                    className="input"
                                    placeholder={t('Add a reaction...')}
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    disabled={isReplying}
                                />
                            </div>
                            <div className="friendkit-reaction-options mt-2">
                                {["😊", "👍", "🔥", "👏"].map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="button is-light is-small mr-2"
                                        onClick={() => handleReplyEmoji(emoji)}
                                        disabled={isReplying}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className={`button is-solid accent-button${isReplying ? " is-loading" : ""}`} onClick={handleReply} disabled={isReplying || !reply.trim()}>
                                {t('Post')}
                            </button>
                            <button className="button" onClick={() => setShowModal(false)}>{t('Cancel')}</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Actions;