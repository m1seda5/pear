import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import '/friendkit-all.css';

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
    <div className="container" style={{ minHeight: '100vh', background: '#f5f6fa', paddingTop: 32 }}>
      <div className="columns">
        {/* Left Sidebar */}
        <div className="column is-3 is-hidden-mobile">
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-content">
              <p className="title is-4">{demoWeather.temp}</p>
              <p className="subtitle is-6">{demoWeather.desc}</p>
              <p className="is-size-7">Real Feel: {demoWeather.realFeel} | Rain Chance: {demoWeather.rainChance}</p>
              <div style={{ display: 'flex', marginTop: 8 }}>
                {demoWeather.days.map((d) => (
                  <div key={d.day} style={{ marginRight: 8, textAlign: 'center' }}>
                    <div className="is-size-7">{d.day}</div>
                    <div>{d.icon}</div>
                    <div className="is-size-7">{d.temp}</div>
                  </div>
                ))}
              </div>
              <p className="is-size-7" style={{ marginTop: 12 }}>{demoWeather.date}</p>
              <p className="is-size-7">{demoWeather.location}</p>
            </div>
          </div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-content">
              <p className="title is-6">Recommended Pages</p>
              {demoPages.map((p) => (
                <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{p.name}</span>
                  <span className="is-size-7 has-text-grey-light">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Center Feed */}
        <div className="column is-6">
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img src={user?.profilePic} alt={user?.name} style={{ borderRadius: '50%' }} />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-rounded"
                        type="text"
                        placeholder="Write something about you..."
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="level" style={{ marginTop: 8 }}>
                <div className="level-left">
                  <button className="button is-small is-white">Photo</button>
                  <button className="button is-small is-white">Video</button>
                  <button className="button is-small is-white">Tag</button>
                  <button className="button is-small is-white">Location</button>
                </div>
                <div className="level-right">
                  <button className="button is-link is-small" disabled={!postText.trim()}>Publish</button>
                </div>
              </div>
            </div>
          </div>
          {/* Posts */}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </div>
        {/* Right Sidebar */}
        <div className="column is-3">
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-content">
              <p className="title is-6">Stories</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <figure className="image is-48x48">
                  <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Dan Walker" style={{ borderRadius: '50%' }} />
                </figure>
                <figure className="image is-48x48">
                  <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Bobby Brown" style={{ borderRadius: '50%' }} />
                </figure>
                <figure className="image is-48x48">
                  <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Elise Walker" style={{ borderRadius: '50%' }} />
                </figure>
              </div>
            </div>
          </div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-content">
              <p className="title is-6">Suggested Friends</p>
              {demoFriends.map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <figure className="image is-32x32" style={{ marginRight: 8 }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}`} alt={f.name} style={{ borderRadius: '50%' }} />
                  </figure>
                  <div>
                    <span>{f.name}</span>
                    <div className="is-size-7 has-text-grey-light">{f.location}</div>
                  </div>
                  <button className="button is-link is-light is-small">+</button>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <p className="title is-6">Notely</p>
              <p className="is-size-7 has-text-grey-light">Your notes and reminders will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
