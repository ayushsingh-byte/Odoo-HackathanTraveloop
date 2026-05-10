import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import ItineraryWorkspace from './pages/ItineraryWorkspace';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import ItineraryTimeline from './pages/ItineraryTimeline';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import SharedItinerary from './pages/SharedItinerary';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import CommunityExplore from './pages/CommunityExplore';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import TripView from './pages/TripView';
import TripBuilder from './pages/TripBuilder';
import TripBudget from './pages/TripBudget';
import TripChecklist from './pages/TripChecklist';
import TripInvoice from './pages/TripInvoice';
import Share from './pages/Share';

function ScrollToTop() {
  const { pathname } = useLocation();

  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  return null;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-luxury-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RootRedirect() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-luxury-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to="/my-trips" replace /> : <Navigate to="/login" replace />;
}

function AppInner() {
  const location = useLocation();
  const { collapsed } = useSidebar();
  const hideNav = location.pathname === '/login' || location.pathname === '/share';
  const sidebarW = collapsed ? 64 : 220;

  return (
    <div className="min-h-screen bg-luxury-black">
      <ScrollToTop />
      {!hideNav && <Sidebar />}
      <div style={{ marginLeft: hideNav ? 0 : sidebarW, transition: 'margin-left 0.25s ease' }}>
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/itinerary" element={<ProtectedRoute><ItineraryWorkspace /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
          <Route path="/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><ItineraryTimeline /></ProtectedRoute>} />
          <Route path="/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
          <Route path="/shared/:id" element={<ProtectedRoute><SharedItinerary /></ProtectedRoute>} />
          <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityExplore /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/trip/view" element={<ProtectedRoute><TripView /></ProtectedRoute>} />
          <Route path="/trip/builder" element={<ProtectedRoute><TripBuilder /></ProtectedRoute>} />
          <Route path="/trip/budget" element={<ProtectedRoute><TripBudget /></ProtectedRoute>} />
          <Route path="/trip/checklist" element={<ProtectedRoute><TripChecklist /></ProtectedRoute>} />
          <Route path="/trip/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
          <Route path="/trip/invoice" element={<ProtectedRoute><TripInvoice /></ProtectedRoute>} />
          <Route path="/share" element={<Share />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SidebarProvider>
          <AppInner />
        </SidebarProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
