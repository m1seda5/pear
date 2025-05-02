// UserPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const UserPage = () => {
  const { username } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setPosts([]);
      }
    };
    if (user) fetchPosts();
  }, [user, username]);

  if (loading) {
    return (
      <div className="friendkit-loading-wrapper">
        <div className="friendkit-loader"></div>
        <div className="loading-text">Loading profile...</div>
        {/* Friendkit skeleton for profile header */}
        <div className="friendkit-skeleton profile-header-skeleton"></div>
        {/* Friendkit skeleton for posts */}
        <div className="friendkit-skeleton feed-post-skeleton"></div>
        <div className="friendkit-skeleton feed-post-skeleton"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i data-feather="user-x"></i>
        </div>
        <div className="empty-state-content">
          <h3>User not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-main" className="navbar-v2-wrapper">
      <div className="container is-custom">
        <div className="view-wrap is-headless">
          <div className="columns is-multiline no-margin">
            <div className="column is-paddingless">
              {/* Timeline Header */}
              <div className="profile-timeline-header box">
                <div className="profile-header-main">
                  <div className="profile-header-avatar">
                    <img src={user.profilePic || "/default-avatar.png"} alt={user.username} />
                  </div>
                  <div className="profile-header-info">
                    <h2>{user.fullName || user.username}</h2>
                    <span>@{user.username}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="columns">
            <div id="profile-timeline-widgets" className="column is-4">
              {/* Basic Infos widget */}
              <div className="box">
                <div className="box-heading">
                  <h4>Basic Info</h4>
                </div>
                <div className="box-content">
                  <ul>
                    <li>Email: {user.email}</li>
                    <li>Location: {user.location || "-"}</li>
                    <li>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</li>
                  </ul>
                </div>
              </div>
              {/* Photos widget placeholder */}
              <div className="box">
                <div className="box-heading">
                  <h4>Photos</h4>
                </div>
                <div className="box-content">
                  <div className="photos-widget-grid">
                    {/* Placeholder for user photos */}
                    <span className="friendkit-placeholder">No photos yet.</span>
                  </div>
                </div>
              </div>
              {/* Friends widget placeholder */}
              <div className="box">
                <div className="box-heading">
                  <h4>Friends</h4>
                </div>
                <div className="box-content">
                  <div className="friends-widget-grid">
                    {/* Placeholder for user friends */}
                    <span className="friendkit-placeholder">No friends to show.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-8">
              <div id="profile-timeline-posts" className="box-heading">
                <h4>Posts</h4>
                <div className="button-wrap">
                  <button type="button" className="button is-active">Recent</button>
                  <button type="button" className="button">Popular</button>
                </div>
              </div>
              <div className="profile-timeline">
                {posts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <i data-feather="file-text"></i>
                    </div>
                    <div className="empty-state-content">
                      <h3>User has no posts.</h3>
                    </div>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post._id} className="feed-post box friendkit-feed-post">
                      <div className="feed-post-header">
                        <div className="feed-post-header-left">
                          <img src={post.author?.profilePic || "/default-avatar.png"} alt={post.author?.username} />
                          <div className="feed-post-header-info">
                            <h4>{post.author?.username}</h4>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="feed-post-content">
                        <p>{post.text}</p>
                        {post.images?.length > 0 && (
                          <div className="feed-post-slider">
                            {post.images.map((image, idx) => (
                              <div key={idx} className="feed-post-slider-item">
                                <img src={image} alt="" />
                              </div>
                            ))}
                          </div>
                        )}
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

export default UserPage;

