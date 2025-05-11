import { useEffect } from 'react';

const QuickLogin = () => {
  useEffect(() => {
    // Let the browser follow the backend redirect
    window.location.href = `/api/quick-login${window.location.search}`;
  }, []);

  return <div>Logging you in...</div>;
};

export default QuickLogin; 