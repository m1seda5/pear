import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";

const demoWeather = {
  temp: "71°",
  desc: "Sunny",
  realFeel: "78°",
  rainChance: "5%",
  days: [
    { day: "MON", icon: "☀️", temp: "69°" },
    { day: "TUE", icon: "🌧️", temp: "74°" },
    { day: "WED", icon: "🌧️", temp: "73°" },
    { day: "THU", icon: "☁️", temp: "68°" },
    { day: "FRI", icon: "🌧️", temp: "55°" },
    { day: "SAT", icon: "🌧️", temp: "58°" },
    { day: "SUN", icon: "☀️", temp: "64°" },
  ],
  date: "Sunday, 18th 2018",
  location: "Los Angeles, CA"
};

const demoPages = [
  { name: "Fast Pizza", desc: "Pizza & Fast Food" },
  { name: "Lonely Droid", desc: "Technology" },
  { name: "Meta Movies", desc: "Movies / Entertainment" },
  { name: "Nuclearjs", desc: "Technology" },
  { name: "Slicer", desc: "Web / Design" }
];

const demoFriends = [
  { name: "Nelly Schwartz", location: "Melbourne" },
  { name: "Lana Henrikssen", location: "Helsinki" },
  { name: "Gaelle Morris", location: "Lyon" },
  { name: "Mike Lasalle", location: "Toronto" },
  { name: "Rolf Krupp", location: "Berlin" }
];

const HomePage = () => {
  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="view-wrapper">
      {/* Container */}
      <div id="main-feed" className="container">
        {/* Feed page main wrapper */}
        <div id="activity-feed" className="view-wrap true-dom">
          <div className="columns">
            {/* Left side column */}
            <div className="column is-3 is-hidden-mobile">
              {/* Weather widget */}
              <div className="card">
                <div className="card-heading">
                  <h4>Weather</h4>
                </div>
                <div className="card-body">
                  <div className="weather-card">
                    <div className="weather-details">
                      <span>Los Angeles, CA</span>
                      <span>Sunday, 18th 2018</span>
                      <div className="weather-icon">
                        <i data-feather="sun"></i>
                        <h2>71°</h2>
                        <div className="details">
                          <span>Real Feel: 78°</span>
                          <span>Rain Chance: 5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="weather-days">
                      <div className="day">
                        <span>MON</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <span>69°</span>
                      </div>
                      {/* Repeat for other days */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended pages */}
              <div className="card">
                <div className="card-heading">
                  <h4>Recommended Pages</h4>
                </div>
                <div className="card-body">
                  <div className="recommended-pages">
                    {/* Page */}
                    <div className="page-block">
                      <div className="page-meta">
                        <span>Fast Pizza</span>
                        <span>Pizza & Fast Food</span>
                      </div>
                    </div>
                    {/* More pages */}
                  </div>
                </div>
              </div>
            </div>

            {/* Center column */}
            <div className="column is-6">
              {/* Publishing Area */}
              <div className="box is-post-section">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img src={user?.profilePic} alt={user?.name} className="is-rounded" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <div className="control">
                      <textarea 
                        className="textarea"
                        rows="3"
                        placeholder="Write something about you..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="publisher-tools">
                      <div className="publisher-actions">
                        <button className="button is-light">
                          <i data-feather="image"></i>
                        </button>
                        <button className="button is-light">
                          <i data-feather="video"></i>
                        </button>
                        <button className="button is-light">
                          <i data-feather="link-2"></i>
                        </button>
                        <button className="button is-light">
                          <i data-feather="map-pin"></i>
                        </button>
                      </div>
                      <div className="publisher-submit">
                        <button 
                          className="button is-solid primary-button"
                          disabled={!postText.trim()}
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed posts */}
              <div id="feed-posts" className="posts-wrapper">
                {posts.map((post) => (
                  <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
              </div>
            </div>

            {/* Right side column */}
            <div className="column is-3">
              {/* Stories widget */}
              <div className="card">
                <div className="card-heading">
                  <h4>Stories</h4>
                </div>
                <div className="card-body">
                  <div className="story-block">
                    <div className="img-wrapper">
                      <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Story" />
                    </div>
                  </div>
                  {/* More stories */}
                </div>
              </div>

              {/* Suggested friends */}
              <div className="card">
                <div className="card-heading">
                  <h4>Suggested Friends</h4>
                </div>
                <div className="card-body">
                  <div className="suggested-friends">
                    {/* Friend */}
                    <div className="friend-block">
                      <div className="friend-meta">
                        <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Friend" />
                        <div className="meta-info">
                          <span>Nelly Schwartz</span>
                          <span>Melbourne</span>
                        </div>
                      </div>
                      <button className="button is-solid primary-button raised">+</button>
                    </div>
                    {/* More friends */}
                  </div>
                </div>
              </div>

              {/* Notes widget */}
              <div className="card">
                <div className="card-heading">
                  <h4>Notes</h4>
                </div>
                <div className="card-body">
                  <p className="has-text-grey">Your notes and reminders will appear here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
