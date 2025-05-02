import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PostDetailPage = () => {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        setPost(data);
        setLiked(data.likes.includes(currentUser?._id));
        setLikes(data.likes.length);
        setComments(data.comments);
      } catch (error) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [postId, currentUser?._id]);

  const handleLikeAndUnlike = async () => {
    try {
      const res = await fetch(`/api/posts/like/${postId}`, { method: "PUT", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.error) return;
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {}
  };

  const handleComment = async () => {
    try {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (data.error) return;
      setComments([...comments, data]);
      setComment("");
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="friendkit-loading-wrapper">
        <div className="friendkit-loader"></div>
        <div className="loading-text">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i data-feather="file-text"></i>
        </div>
        <div className="empty-state-content">
          <h3>Post not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar-v2-wrapper">
      <div className="container is-custom">
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="card is-post">
              <div className="card-heading">
                <div className="user-block">
                  <img src={post.author?.profilePic || "/default-avatar.png"} alt={post.author?.username} />
                  <div style={{ marginLeft: 12 }}>
                    <a onClick={() => navigate(`/${post.author?.username}`)} style={{ cursor: 'pointer' }}>{post.author?.username}</a>
                    <div className="time">{new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="card-body content-wrap">
                <div className="post-text">
                  <p>{post.text}</p>
                </div>
                {post.images?.length > 0 && (
                  <div className="post-image">
                    {post.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" />
                    ))}
                  </div>
                )}
              </div>
              <div className="card-footer">
                <div className="buttons">
                  <button className={`button is-solid grey-button is-sm${liked ? " is-active" : ""}`} onClick={handleLikeAndUnlike}>
                    <i data-feather="heart"></i>
                    <span>{likes}</span>
                  </button>
                  <button className="button is-solid grey-button is-sm">
                    <i data-feather="message-circle"></i>
                    <span>{comments.length}</span>
                  </button>
                  <button className="button is-solid grey-button is-sm">
                    <i data-feather="share-2"></i>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Comments section */}
            <div className="card">
              <div className="card-heading">
                <h4>Comments</h4>
              </div>
              <div className="card-body">
                <div className="media">
                  <div className="media-left">
                    <img src={currentUser?.profilePic || "/default-avatar.png"} alt={currentUser?.username} style={{ width: 32, height: 32, borderRadius: "50%" }} />
                  </div>
                  <div className="media-content">
                    <input
                      className="input"
                      type="text"
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleComment(); }}
                    />
                  </div>
                  <div className="media-right">
                    <button className="button is-solid accent-button is-sm" onClick={handleComment}>Post</button>
                  </div>
                </div>
                {comments.length === 0 ? (
                  <span>No comments yet.</span>
                ) : (
                  comments.map((c) => (
                    <div key={c._id} className="media">
                      <div className="media-left">
                        <img src={c.author?.profilePic || "/default-avatar.png"} alt={c.author?.username} style={{ width: 32, height: 32, borderRadius: "50%" }} />
                      </div>
                      <div className="media-content">
                        <span>{c.author?.username}</span>
                        <span style={{ marginLeft: 8, color: '#b5b5c3', fontSize: '0.85em' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        <div>{c.text}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage; 