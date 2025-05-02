import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";
import useShowToast from "../hooks/useShowToast";

const ReviewQueue = () => {
  const { get, post } = useFetch();
  const [reviews, setReviews] = useState([]);
  const showToast = useShowToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews/queue");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setReviews(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    fetchReviews();
  }, [showToast]);

  const handleDecision = async (postId, decision) => {
    const response = await post(`/api/posts/${postId}/review`, { decision });
    if (response) {
      fetchReviews();
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="box-content">
        <div className="box-line">
          <span className="left">{t("No posts pending review")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="review-queue">
      <h2>Review Queue</h2>
      <div className="reviews">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <p><strong>User:</strong> {review.user}</p>
            <p><strong>Content:</strong> {review.content}</p>
            <p><strong>Status:</strong> {review.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewQueue;