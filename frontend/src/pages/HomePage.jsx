import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePost from "../components/CreatePost";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/feed", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        const data = await res.json();
        if (res.ok) setPosts(data);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser.token]);

  return (
    <div id="main-feed" className="navbar-v2-wrapper">
      <div className="container">
        <div id="activity-feed" className="view-wrap true-dom">
          <div className="columns">
            {/* Left column */}
            <div className="column is-3 is-hidden-mobile">
              {/* Weather widget */}
              <div className="box"><div className="box-heading"><h4>Weather</h4></div><div className="box-content"><span>Sunny, 25°C</span></div></div>
              {/* Recommended Pages */}
              <div className="box"><div className="box-heading"><h4>Recommended Pages</h4></div><div className="box-content"><span>No pages yet.</span></div></div>
              {/* Fake Ad */}
              <div className="box"><div className="box-heading"><h4>Ad</h4></div><div className="box-content"><span>Ad placeholder</span></div></div>
              {/* Latest Activity */}
              <div className="box"><div className="box-heading"><h4>Latest Activity</h4></div><div className="box-content"><span>No activity yet.</span></div></div>
            </div>
            {/* Middle column */}
            <div className="column is-6">
              {/* Publishing Area */}
              <CreatePost />
              {/* Feed posts */}
              {loading ? (
                <div className="friendkit-loading-wrapper"><div className="friendkit-loader"></div><div className="loading-text">Loading posts...</div></div>
              ) : posts.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon"><i data-feather="file-text"></i></div><div className="empty-state-content"><h3>No posts yet.</h3></div></div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="feed-post box">
                    <div className="feed-post-header">
                      <div className="feed-post-header-left">
                        <img src={post.author?.profilePic || '/default-avatar.png'} alt={post.author?.username} />
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
              {/* Load more */}
              <div className="load-more-wrap narrow-top has-text-centered">
                <a href="#" className="load-more-button">Load More</a>
              </div>
            </div>
            {/* Right column */}
            <div className="column is-3">
              {/* Stories widget */}
              <div className="box"><div className="box-heading"><h4>Stories</h4></div><div className="box-content"><span>No stories yet.</span></div></div>
              {/* Birthday widget */}
              <div className="box"><div className="box-heading"><h4>Birthdays</h4></div><div className="box-content"><span>No birthdays today.</span></div></div>
              {/* Suggested friends widget */}
              <div className="box"><div className="box-heading"><h4>Suggested Friends</h4></div><div className="box-content"><span>No suggestions yet.</span></div></div>
              {/* New job widget */}
              <div className="box"><div className="box-heading"><h4>New Jobs</h4></div><div className="box-content"><span>No new jobs.</span></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
