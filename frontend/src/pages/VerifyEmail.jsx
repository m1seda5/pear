// VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/users/verify-email/${id}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
        } else {
          showToast('Success', data.message, 'success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setVerifying(false);
      }
    };

    if (id) {
      verifyEmail();
    }
  }, [id, navigate, showToast]);

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
            <h2 className="auth-title">{t("Email Verification")}</h2>
            <h3 className="auth-subtitle">
              {verifying 
                ? t("We're verifying your email address...") 
                : t("Email verification complete! Redirecting to login...")}
            </h3>
          </div>

          <div className="auth-form">
            <div className="verification-status">
              {verifying ? (
                <div className="loading-spinner">
                  <i data-feather="loader"></i>
                </div>
              ) : (
                <div className="success-icon">
                  <i data-feather="check-circle"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;