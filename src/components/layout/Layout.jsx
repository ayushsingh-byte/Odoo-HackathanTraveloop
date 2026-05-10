import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TripSubnav from './TripSubnav';

export default function Layout({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-wrap">
          <TripSubnav />
          {children}
        </div>
      </div>
    </>
  );
}
