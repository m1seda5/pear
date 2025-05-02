import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFetch from "../hooks/useFetch";
import ReviewQueue from "../components/ReviewQueue";
import { useTranslation } from "react-i18next";
import { BsShieldLockFill } from "react-icons/bs";
import { FiUsers, FiActivity, FiCheckCircle, FiXCircle } from "react-icons/fi";

const ReviewerGroups = ({ onGroupSelect }) => {
  const { get } = useFetch();
  const [groups, setGroups] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadGroups = async () => {
      const data = await get("/api/reviewer-groups");
      if (data) setGroups(data);
    };
    loadGroups();
  }, [get]);

  return (
    <div className="box-content">
      {groups.map((group) => (
        <div 
          key={group._id} 
          className="box-line is-clickable"
          onClick={() => onGroupSelect(group._id)}
        >
          <span className="left">
            <i data-feather="users"></i>
            {group.name}
          </span>
          <span className="right">
            <i data-feather="chevron-right"></i>
          </span>
        </div>
      ))}
    </div>
  );
};

const GroupStatistics = ({ groupId }) => {
  const { get } = useFetch();
  const [stats, setStats] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadStats = async () => {
      if (!groupId) {
        setStats([]);
        return;
      }
      const data = await get(`/api/reviewer-groups/${groupId}/stats`);
      setStats(data || []);
    };
    loadStats();
  }, [groupId, get]);

  return (
    <div className="box-content">
      {stats.length > 0 ? (
        stats.map(reviewer => (
          <div key={reviewer._id} className="box-line">
            <div className="left">
              <div className="media">
                <figure className="media-left">
                  <p className="image is-32x32">
                    <img 
                      className="is-rounded" 
                      src={reviewer.profilePic} 
                      alt={reviewer.username}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </p>
                </figure>
                <div className="media-content">
                  <span>{reviewer.username}</span>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="stats">
                <span className="stat-item">
                  <i data-feather="check-circle"></i>
                  {reviewer.approvals || 0}
                </span>
                <span className="stat-item">
                  <i data-feather="x-circle"></i>
                  {reviewer.rejections || 0}
                </span>
                <span className="stat-item">
                  <i data-feather="clock"></i>
                  {reviewer.lastDecision ? 
                    new Date(reviewer.lastDecision).toLocaleDateString() : 
                    t('N/A')}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="box-line">
          <span className="left">
            {groupId ? t("No statistics available") : t("Select a group to view statistics")}
          </span>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const user = useRecoilValue(userAtom);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const { t } = useTranslation();
  const { get } = useFetch();
  const [summary, setSummary] = useState({
    totalPosts: 0,
    pendingReviews: 0,
    approvedPosts: 0,
    rejectedPosts: 0
  });

  useEffect(() => {
    const loadSummary = async () => {
      const data = await get("/api/admin/summary");
      if (data) setSummary(data);
    };
    loadSummary();
  }, [get]);

  // If user is not admin, redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div id="creator-dashboard" className="dashboard-container">
      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <h1 className="title is-4">
          <i data-feather="shield" className="mr-2"></i>
          {t("Admin Dashboard")}
        </h1>
      </div>

      {/* Stats Row */}
      <div className="columns is-multiline">
        <div className="column is-3">
          <div className="dashboard-box">
            <div className="stat-block">
              <span className="stat-title">{t("Total Posts")}</span>
              <span className="stat-value">{summary.totalPosts}</span>
            </div>
          </div>
        </div>
        <div className="column is-3">
          <div className="dashboard-box">
            <div className="stat-block">
              <span className="stat-title">{t("Pending Reviews")}</span>
              <span className="stat-value">{summary.pendingReviews}</span>
            </div>
          </div>
        </div>
        <div className="column is-3">
          <div className="dashboard-box">
            <div className="stat-block">
              <span className="stat-title">{t("Approved Posts")}</span>
              <span className="stat-value positive">{summary.approvedPosts}</span>
            </div>
          </div>
        </div>
        <div className="column is-3">
          <div className="dashboard-box">
            <div className="stat-block">
              <span className="stat-title">{t("Rejected Posts")}</span>
              <span className="stat-value negative">{summary.rejectedPosts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="columns">
        <div className="column is-8">
          {/* Review Queue */}
          <div className="dashboard-box">
            <h3 className="title is-5 is-thin">{t("Review Queue")}</h3>
            <ReviewQueue />
          </div>
        </div>
        <div className="column is-4">
          {/* Reviewer Groups */}
          <div className="dashboard-box">
            <h3 className="title is-5 is-thin">{t("Reviewer Groups")}</h3>
            <ReviewerGroups onGroupSelect={setSelectedGroupId} />
          </div>
          {/* Group Statistics */}
          <div className="dashboard-box">
            <h3 className="title is-5 is-thin">{t("Group Statistics")}</h3>
            <GroupStatistics groupId={selectedGroupId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;