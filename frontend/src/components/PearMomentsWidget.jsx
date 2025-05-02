import React, { useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "./Post";
import { useTranslation } from 'react-i18next';
import { useShowToast } from '../contexts/ShowToastContext';

const SLIDE_DURATION = 9000;
const MAX_FEATURED_POSTS = 5;

const PearMomentsWidget = () => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const user = useRecoilValue(userAtom);
  const { t } = useTranslation();
  const showToast = useShowToast();

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await fetch("/api/moments");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMoments(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    fetchMoments();
  }, [showToast]);

  useEffect(() => {
    if (loading || moments.length === 0) return;
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentPostIndex((prevIndex) => {
        const nextIndex = prevIndex === moments.length - 1 ? 0 : prevIndex + 1;
        setKey(prev => prev + 1);
        return nextIndex;
      });
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [loading, moments.length, isPaused]);

  if (loading) {
    return (
      <div className="card pear-moments-widget">
        <div className="card-heading">
          <h4>Pear Moments</h4>
        </div>
        <div className="card-body">
          <div className="friendkit-loading-wrapper">
            <div className="friendkit-loader"></div>
            <div className="loading-text">{t('Loading moments...')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card pear-moments-widget">
        <div className="card-heading">
          <h4>Pear Moments</h4>
        </div>
        <div className="card-body">
          <div className="notification is-danger">
            <div className="notification-content">
              <strong>{t('Error loading moments')}:</strong> {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!moments.length) {
    return (
      <div className="card pear-moments-widget">
        <div className="card-heading">
          <h4>Pear Moments</h4>
        </div>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">
              <i data-feather="film"></i>
            </div>
            <div className="empty-state-content">
              <h3>{t('No moments yet.')}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pear-moments-widget">
      <h2>Pear Moments</h2>
      <div className="moments">
        {moments.map((moment) => (
          <div key={moment._id} className="moment-item">
            <img src={moment.image} alt={moment.title} className="moment-image" />
            <h3>{moment.title}</h3>
            <p>{moment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PearMomentsWidget; 