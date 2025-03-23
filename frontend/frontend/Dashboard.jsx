import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PortfolioCard from '../PortfolioCard';

function Dashboard() {
  const sessionUser = useSelector(state => state.session.user);

  // Redirect if not logged in
  if (!sessionUser) return <Navigate to="/" />;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {sessionUser.username}!</h1>
      <div className="dashboard-content">
        <PortfolioCard />
        {/* Other dashboard components */}
      </div>
    </div>
  );
}

export default Dashboard;
