import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useTranslation } from "react-i18next";
import feather from 'feather-icons';
import useShowToast from "../hooks/useShowToast";

const ReviewModal = ({ isOpen, onClose }) => {
  const [review, setReview] = useState("");
  const showToast = useShowToast();

  const handleSubmitReview = async () => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Review submitted successfully", "success");
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Submit Review</h2>
        <textarea
          className="textarea"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="button">Cancel</button>
          <button onClick={handleSubmitReview} className="button is-primary">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
