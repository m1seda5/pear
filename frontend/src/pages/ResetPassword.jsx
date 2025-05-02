import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast({ title: t("Passwords don't match"), status: 'error', duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      
      const data = await res.json();
      if (data.error) {
        showToast({ title: data.error, status: 'error', duration: 3000 });
        return;
      }

      showToast({ 
        title: t("Password reset successfully!"), 
        status: 'success', 
        duration: 3000 
      });
      navigate('/auth');
    } catch (error) {
      showToast({ title: t("An error occurred"), status: 'error', duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Fake navigation */}
      <div className="fake-nav">
        <a href="/" className="logo">
          <img
            className="light-image"
            src="/logo.png"
            width="112"
            height="28"
            alt="Pear Network"
          />
          <img
            className="dark-image"
            src="/logo-dark.png"
            width="112"
            height="28"
            alt="Pear Network"
          />
        </a>
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h2 className="auth-title">{t("Reset Your Password")}</h2>
            <h3 className="auth-subtitle">{t("Enter your new password below.")}</h3>
          </div>

          <div className="auth-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t("New Password")}</label>
                <div className="control">
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t("Enter your new password")}
                      required
                    />
                    <span 
                      className="icon-wrapper" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i data-feather={showPassword ? "eye-off" : "eye"}></i>
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>{t("Confirm Password")}</label>
                <div className="control">
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("Confirm your new password")}
                      required
                    />
                    <span 
                      className="icon-wrapper" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i data-feather={showConfirmPassword ? "eye-off" : "eye"}></i>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`auth-button ${isSubmitting ? 'is-loading' : ''}`}
                disabled={isSubmitting || !newPassword || !confirmPassword}
              >
                {isSubmitting ? t("Resetting...") : t("Reset Password")}
              </button>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  <a 
                    className="auth-footer-link" 
                    onClick={() => navigate('/auth')}
                  >
                    {t("Back to Login")}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;