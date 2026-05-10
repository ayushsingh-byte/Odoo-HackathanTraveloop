import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-luxury-black">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/itinerary" element={<ItineraryWorkspace />} />
          <Route path="/explore" element={<CitySearch />} />
          <Route path="/activities" element={<ActivitySearch />} />
          <Route path="/timeline" element={<ItineraryTimeline />} />
          <Route path="/packing" element={<PackingChecklist />} />
          <Route path="/notes" element={<TripNotes />} />
          <Route path="/shared/:id" element={<SharedItinerary />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<CommunityExplore />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </div>
  );
}
