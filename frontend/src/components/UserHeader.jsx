import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleProfileClick = () => {
    navigate('/update');
  };

  return (
    <div className="user-header">
      <img src={user.profilePic || "/default-avatar.png"} alt={user.username} className="avatar" />
      <div className="user-info">
        <h2>{user.username}</h2>
        <p>{user.bio || "No bio available"}</p>
      </div>
    </div>
  );
};

export default UserHeader;