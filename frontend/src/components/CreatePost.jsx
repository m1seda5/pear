import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useTranslation } from 'react-i18next';

const MAX_CHAR = 500;

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetAudience, setTargetAudience] = useState("all");
  const [loading, setLoading] = useState(false);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { t } = useTranslation();
  const imageRef = useRef(null);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setPostText(inputText.slice(0, MAX_CHAR));
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImgUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const payload = {
        postedBy: user._id,
        text: postText,
        img: imgUrl,
        targetAudience: user.role === "teacher" ? targetAudience : null,
      };
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        showToast(t("Error"), data.error, "error");
        return;
      }
      showToast(t("Success"), t("Post created successfully"), "success");
      setPosts([data, ...posts]);
      setPostText("");
      setImgUrl("");
      setTargetAudience(user.role === "teacher" ? "all" : "");
    } catch (error) {
      showToast(t("Error"), error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card friendkit-create-post">
      <div className="card-heading">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={user?.profilePic || "/default-avatar.png"} alt={user?.username} className="is-rounded" />
            </figure>
          </div>
          <div className="media-content">
            <textarea
              className="textarea"
              rows="3"
              placeholder={t("Write something about you...")}
              value={postText}
              onChange={handleTextChange}
              maxLength={MAX_CHAR}
            ></textarea>
            <div className="is-flex is-align-items-center is-justify-content-space-between mt-2">
              <span className="is-size-7 has-text-grey">{remainingChar}/{MAX_CHAR}</span>
              {user.role === "teacher" && (
                <div className="dropdown is-right is-hoverable" style={{ position: 'relative' }}>
                  <div className="dropdown-trigger">
                    <button className="button is-light is-small" onClick={() => setShowDropdown(!showDropdown)}>
                      <span>{targetAudience === "all" ? t("All Students") : targetAudience}</span>
                      <span className="icon is-small"><i data-feather="chevron-down"></i></span>
                    </button>
                  </div>
                  {showDropdown && (
                    <div className="dropdown-menu" style={{ display: 'block', position: 'absolute', right: 0, zIndex: 10 }}>
                      <div className="dropdown-content">
                        <a className="dropdown-item" onClick={() => { setTargetAudience("all"); setShowDropdown(false); }}>{t("All Students")}</a>
                        <a className="dropdown-item" onClick={() => { setTargetAudience("Year 12"); setShowDropdown(false); }}>{t("Year 12")}</a>
                        <a className="dropdown-item" onClick={() => { setTargetAudience("Year 13"); setShowDropdown(false); }}>{t("Year 13")}</a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="is-flex is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center">
            <button className="button is-light is-small mr-2" onClick={() => imageRef.current.click()}>
              <i data-feather="image"></i> <span className="ml-1">{t("Media")}</span>
            </button>
            <input type="file" hidden ref={imageRef} onChange={handleImageChange} />
            {imgUrl && (
              <div className="ml-2">
                <img src={imgUrl} alt={t('Selected img')} style={{ maxHeight: 48, borderRadius: 8 }} />
                <button className="delete is-small" onClick={() => setImgUrl("")}></button>
              </div>
            )}
          </div>
          <button
            className={`button is-solid primary-button${loading ? " is-loading" : ""}`}
            onClick={handleCreatePost}
            disabled={loading || !postText.trim()}
          >
            {t("Post")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;