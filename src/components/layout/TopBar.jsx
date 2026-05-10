import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/trips': 'My Trips',
  '/trip/new': 'Plan a New Trip',
  '/trip/view': 'Trip Itinerary',
  '/trip/builder': 'Itinerary Builder',
  '/trip/budget': 'Budget',
  '/trip/checklist': 'Packing Checklist',
  '/trip/notes': 'Trip Notes',
  '/trip/invoice': 'Trip Invoice',
  '/cities': 'Explore Cities',
  '/community': 'Community',
  '/profile': 'Profile & Settings',
  '/admin': 'Admin Panel',
};

export default function TopBar() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Traveloop';

  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions"></div>
    </div>
  );
}
