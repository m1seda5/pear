import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FriendkitNavbar = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Role and time-based access logic (simplified)
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();
  const schoolStart = 810;
  const lunchStart = 1250;
  const lunchEnd = 1340;
  const schoolEnd = 1535;
  const hasChatAccess = user && (
    isTeacher ||
    isAdmin ||
    (isStudent &&
      ((dayOfWeek >= 1 &&
        dayOfWeek <= 5 &&
        (currentTime < schoolStart ||
          (currentTime >= lunchStart && currentTime <= lunchEnd) ||
          currentTime > schoolEnd)) ||
        dayOfWeek === 0 ||
        dayOfWeek === 6))
  );

  return (
    <div id="main-navbar" className="navbar navbar-v1 is-inline-flex is-transparent no-shadow is-hidden-mobile">
      <div className="container is-fluid">
        <div className="navbar-brand">
          <a href="/" className="navbar-item" onClick={e => { e.preventDefault(); navigate("/"); }}>
            <img className="logo light-image" src="/logo.svg" width="112" height="28" alt="" />
            <img className="logo dark-image" src="/logo.svg" width="112" height="28" alt="" />
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item">
              <input
                className="input"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 220 }}
              />
              <span className="icon is-left"><i data-feather="search"></i></span>
            </div>
            <div className="navbar-item is-icon">
              <a className="icon-link is-primary" onClick={() => navigate("/")}> <i data-feather="home"></i> </a>
            </div>
            <div className="navbar-item is-icon">
              <a className="icon-link is-primary" onClick={() => navigate("/notifications")}> <i data-feather="bell"></i> </a>
            </div>
            <div className="navbar-item is-icon open-chat">
              <a className={`icon-link is-primary${!hasChatAccess ? " is-disabled" : ""}`} onClick={hasChatAccess ? () => navigate("/chat") : e => e.preventDefault()}> <i data-feather="message-square"></i> </a>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item is-avatar">
              <div className="dropdown is-right is-hoverable">
                <div className="dropdown-trigger">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.username}
                    className="avatar"
                    style={{ width: 36, height: 36, borderRadius: "50%", cursor: "pointer" }}
                  />
                </div>
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <a className="dropdown-item" onClick={() => navigate(`/${user?.username}`)}>Profile</a>
                    <a className="dropdown-item" onClick={() => navigate("/settings")}>Settings</a>
                    <a className="dropdown-item" onClick={() => { localStorage.clear(); window.location.href = "/auth"; }}>Logout</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sub-nav">
        <div className="sub-nav-tabs">
          <div className="tabs is-centered">
            <ul>
              <li><a onClick={() => navigate("/communities")}>Communities</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendkitNavbar; 