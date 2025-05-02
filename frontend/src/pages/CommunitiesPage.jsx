import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const CommunitiesPage = () => {
  const user = useRecoilValue(userAtom);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/messages/groups/all", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setCommunities(data);
        else setCommunities([]);
      } catch (e) {
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, [user.token]);

  const handleJoinCommunity = async (communityId) => {
    try {
      const res = await fetch(`/api/messages/groups/${communityId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setCommunities(prev => 
          prev.map(comm => 
            comm._id === communityId 
              ? { ...comm, participants: [...comm.participants, user] }
              : comm
          )
        );
      }
    } catch (e) {
      console.error("Error joining community:", e);
    }
  };

  return (
    <div id="groups" class="navbar-v2-wrapper">
      <div class="container">
        <div class="groups-grid">
          <div class="grid-header">
            <div class="header-inner">
              <h2>Communities</h2>
              <div class="header-actions">
                <div class="buttons">
                  <a href="#" class="button is-solid accent-button raised" onClick={() => navigate('/create-community')}>
                    New Community
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="columns is-multiline">
            {loading ? (
              <div class="column is-12 has-text-centered">
                <div className="friendkit-loading-wrapper"><div className="friendkit-loader"></div><div className="loading-text">Loading communities...</div></div>
                {/* Friendkit skeletons for group cards */}
                <div className="friendkit-skeleton group-card-skeleton"></div>
                <div className="friendkit-skeleton group-card-skeleton"></div>
                <div className="friendkit-skeleton group-card-skeleton"></div>
                <div className="friendkit-skeleton group-card-skeleton"></div>
              </div>
            ) : communities.length === 0 ? (
              <div class="column is-12 has-text-centered">
                <div className="empty-state"><div className="empty-state-icon"><i data-feather="users"></i></div><div className="empty-state-content"><h3>No communities found</h3></div></div>
              </div>
            ) : (
              communities.map((community) => (
                <div key={community._id} class="column is-3">
                  <article class="group-box friendkit-group-box">
                    <div class="box-info-hover">
                      <i data-feather="heart"></i>
                      <div class="box-clock-info">
                        <i data-feather="message-circle" class="box-clock"></i>
                        <span class="box-time">New</span>
                      </div>
                    </div>
                    <div
                      class="box-img has-background-image"
                      data-background={community.groupAvatar || '/default-group.png'}
                    >
                      {/* Friendkit placeholder for group image */}
                      {!community.groupAvatar && <span className="friendkit-placeholder">No image</span>}
                    </div>
                    <a href="#" class="box-link" onClick={() => navigate(`/chat/${community._id}`)}>
                      <div
                        class="box-img--hover has-background-image"
                        data-background={community.groupAvatar || '/default-group.png'}
                      ></div>
                    </a>
                    <div class="box-info">
                      <span class="box-category">Community</span>
                      <h3 class="box-title">{community.groupName}</h3>
                      <span class="box-members">
                        <a href="#">{community.participants?.length || 0} members</a>
                        <div class="members-preview">
                          {community.participants?.length === 0 ? (
                            <span className="friendkit-placeholder">No members</span>
                          ) : (
                            community.participants?.slice(0, 3).map((member) => (
                              <img
                                key={member._id}
                                src={member.profilePic || '/default-avatar.png'}
                                data-demo-src={member.profilePic || '/default-avatar.png'}
                                data-user-popover={member._id}
                                alt=""
                              />
                            ))
                          )}
                        </div>
                      </span>
                    </div>
                  </article>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage; 