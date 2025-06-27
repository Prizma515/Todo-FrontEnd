import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session (update this logic based on your auth setup)
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to login page after logout
    navigate('/login');
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging you out...</h2>
    </div>
  );
};

export default LogoutPage;