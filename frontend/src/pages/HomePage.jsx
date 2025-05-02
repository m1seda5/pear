import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePost from "../components/CreatePost";
import NotelyWidget from "../components/NotelyWidget";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

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
              <div className="box">
                <div className="box-heading"><h4>Weather</h4></div>
                <div className="box-content">
                  <span>🌤️ 25°C, Sunny<br/>Nairobi, KE</span>
                </div>
              </div>
              {/* Recommended Pages */}
              <div className="box">
                <div className="box-heading"><h4>Recommended Pages</h4></div>
                <div className="box-content">
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Page1" style={{width:32,height:32,borderRadius:'50%'}} />
                    <span>Science Club</span>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Page2" style={{width:32,height:32,borderRadius:'50%'}} />
                    <span>Music Society</span>
                  </div>
                </div>
              </div>
              {/* Fake Ad */}
              <div className="box">
                <div className="box-heading"><h4>Ad</h4></div>
                <div className="box-content">
                  <img src="https://friendkit.cssninja.io/assets/img/demo/unsplash/1.jpg" alt="Ad" style={{width:'100%',borderRadius:8}} />
                  <div style={{marginTop:8}}>Get 20% off on school supplies! <a href="#" style={{color:'#4fc1ea'}}>Shop now</a></div>
                </div>
              </div>
              {/* Latest Activity */}
              <div className="box">
                <div className="box-heading"><h4>Latest Activity</h4></div>
                <div className="box-content">
                  <div><b>@miseda</b> joined <b>Science Club</b></div>
                  <div><b>@jane</b> posted in <b>Music Society</b></div>
                  <div><b>@dan</b> liked your post</div>
                </div>
              </div>
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
                  <div key={post._id} className="card is-post">
                    <div className="card-heading">
                      <div className="user-block">
                        <img src={post.author?.profilePic || '/default-avatar.png'} alt={post.author?.username} />
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
                      {/* Mock likers avatars */}
                      <div className="likers-avatars">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="liker1" />
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="liker2" />
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="liker3" />
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="buttons">
                        <button className="button is-solid">
                          <i data-feather="heart"></i>
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        <button className="button is-solid">
                          <i data-feather="message-circle"></i>
                          <span>{post.comments?.length || 0}</span>
                        </button>
                        <button className="button is-solid">
                          <i data-feather="share-2"></i>
                        </button>
                      </div>
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
              <div className="card"><div className="card-heading"><h4>Stories</h4></div><div className="card-body"><span>No stories yet.</span></div></div>
              {/* Communities widget */}
              <div className="card"><div className="card-heading"><h4>Communities</h4></div><div className="card-body"><span>No communities yet.</span></div></div>
              {/* Notely widget */}
              <NotelyWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
