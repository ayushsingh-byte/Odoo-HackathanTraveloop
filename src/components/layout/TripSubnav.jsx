import { Link, useLocation, useSearchParams } from 'react-router-dom';

const TRIP_PAGES = [
  { to: '/trip/view', icon: '📋', label: 'Itinerary' },
  { to: '/trip/builder', icon: '🔨', label: 'Builder' },
  { to: '/trip/budget', icon: '💰', label: 'Budget' },
  { to: '/trip/checklist', icon: '☑️', label: 'Checklist' },
  { to: '/trip/notes', icon: '📝', label: 'Notes' },
  { to: '/trip/invoice', icon: '🧾', label: 'Invoice' },
];

export default function TripSubnav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('id');

  const isTripPage = TRIP_PAGES.some(p => location.pathname === p.to);
  if (!isTripPage || !tripId) return null;

  return (
    <div className="trip-subnav">
      {TRIP_PAGES.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={`${to}?id=${tripId}`}
          className={location.pathname === to ? 'active' : ''}
        >
          <span className="trip-subnav-icon">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
