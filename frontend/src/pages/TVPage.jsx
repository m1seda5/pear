import { useEffect, useState } from "react";

const TVPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos from backend (placeholder)
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Replace with your API endpoint
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (e) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div id="video-feed" className="navbar-v2-wrapper">
      <div className="container sidebar-boxed">
        <div className="videos-wrapper is-home is-full">
          <div className="home-wrapper">
            {/* Video header slides (static placeholders) */}
            <div className="video-header-wrap">
              {[1, 2, 3].map((n) => (
                <div className="video-header-outer" key={n}>
                  <div className="video-header">
                    <img className="cover" src={`https://via.placeholder.com/1920x1080?text=Featured+${n}`} alt="" />
                    <div className="cover-overlay"></div>
                    <div className="cover-caption">
                      <div className="caption-inner">
                        <div className="video-caption">
                          <div className="caption-block">
                            <h2>Featured Video {n}</h2>
                            <div className="video-meta">
                              <span>CCO</span>
                              <span>Genre</span>
                              <span className="rating">
                                <i data-feather="star"></i>
                                <i data-feather="star"></i>
                                <i data-feather="star"></i>
                                <i data-feather="star"></i>
                              </span>
                            </div>
                            <p className="description">This is a featured video description.</p>
                            <div className="caption-actions">
                              <a className="button is-solid accent-button is-rounded">Start Watching</a>
                              <a className="trailer-button"><i data-feather="play"></i><span>Watch Trailer</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Home content */}
            <div className="home-content">
              <div className="collections-header">
                <a className="is-active">Latest</a>
                <a>Subscribed</a>
                <a>Related</a>
                <div className="search-button">
                  <i data-feather="search"></i>
                </div>
              </div>
              <div className="collections-wrap is-active">
                <div className="collection">
                  <div className="header">
                    <h4>Shows & Movies</h4>
                    <a>Show More</a>
                  </div>
                  <div className="video-collection">
                    {loading ? (
                      <span>Loading videos...</span>
                    ) : videos.length === 0 ? (
                      <span>No videos found.</span>
                    ) : (
                      videos.map((video) => (
                        <a className="episode" key={video._id} href={video.url || "#"}>
                          <div className="episode-thumbnail">
                            <div className="episode-overlay"></div>
                            <div className="episode-duration">{video.duration || "--:--"}</div>
                            <div className="play-button">
                              <i data-feather="play-circle"></i>
                            </div>
                            <img src={video.thumbnail || "https://via.placeholder.com/320x200?text=Video"} alt={video.title} />
                          </div>
                          <div className="episode-meta">
                            <h4>{video.title}</h4>
                            <span>{video.genre || "Genre"}</span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPage;
