/* Mock data for Traveloop luxury travel platform */

export const destinations = [
  {
    id: 1,
    name: 'Dehradun',
    country: 'India',
    tagline: 'Gateway to the Himalayas',
    image: '/images/hero-dehradun.png',
    rating: 4.9,
    trips: 2840,
    category: 'Nature',
    description: 'Explore misty pine forests, serene valleys, and charming cafes in the foothills of the majestic Himalayas.'
  },
  {
    id: 2,
    name: 'Andaman Islands',
    country: 'India',
    tagline: 'Tropical paradise awaits',
    image: '/images/city-andaman.png',
    rating: 4.8,
    trips: 3200,
    category: 'Beach',
    description: 'Discover pristine white sand beaches, crystal clear turquoise water, and lush tropical palms.'
  },
  {
    id: 3,
    name: 'South Temples',
    country: 'India',
    tagline: 'Echoes of ancient empires',
    image: '/images/city-temple.png',
    rating: 4.9,
    trips: 4100,
    category: 'Culture',
    description: 'Witness intricate stone carvings, towering gopurams, and a deeply mystical and spiritual atmosphere.'
  },
  {
    id: 4,
    name: 'Jaipur',
    country: 'India',
    tagline: 'The Pink City',
    image: '/images/city-jaipur.png',
    rating: 4.8,
    trips: 1950,
    category: 'Culture',
    description: 'Experience the royal grandeur of majestic forts, opulent palaces, and vibrant colorful markets.'
  },
  {
    id: 5,
    name: 'Kerala Backwaters',
    country: 'India',
    tagline: 'God\'s own country',
    image: '/images/city-kerala.png',
    rating: 4.7,
    trips: 1200,
    category: 'Nature',
    description: 'Glide through lush palm-fringed backwaters on a traditional wooden houseboat at misty sunrise.'
  },
  {
    id: 6,
    name: 'Agra',
    country: 'India',
    tagline: 'Home of the Taj',
    image: '/images/hero-india.png',
    rating: 4.9,
    trips: 3500,
    category: 'Culture',
    description: 'Stand in awe before the majestic Taj Mahal and explore the grand architecture of the Mughal empire.'
  },
];

export const featuredTrips = [
  {
    id: 1,
    title: '10 Days in Uttarakhand',
    destinations: ['Dehradun', 'Mussoorie', 'Rishikesh'],
    image: '/images/hero-dehradun.png',
    duration: '10 days',
    price: '$1,800',
    rating: 4.9,
    traveler: 'Riya M.',
    travelerAvatar: '🏔️',
    description: 'A serene journey through the Himalayan foothills.'
  },
  {
    id: 2,
    title: 'Andaman Escape',
    destinations: ['Port Blair', 'Havelock', 'Neil Island'],
    image: '/images/city-andaman.png',
    duration: '7 days',
    price: '$2,100',
    rating: 4.8,
    traveler: 'Marcus W.',
    travelerAvatar: '🌴',
    description: 'Pristine beaches, coral reefs, and tropical luxury.'
  },
  {
    id: 3,
    title: 'Parisian Romance',
    destinations: ['Paris', 'Versailles', 'Giverny'],
    image: '/images/hero-paris.png',
    duration: '5 days',
    price: '$3,500',
    rating: 4.9,
    traveler: 'Sophie L.',
    travelerAvatar: '🗼',
    description: 'Fall in love with art, cuisine, and the timeless charm of France.'
  },
  {
    id: 4,
    title: 'Greek Island Hopping',
    destinations: ['Santorini', 'Mykonos', 'Crete'],
    image: '/images/hero-santorini.png',
    duration: '12 days',
    price: '$5,100',
    rating: 4.8,
    traveler: 'James R.',
    travelerAvatar: '⛵',
    description: 'Sail across the Aegean Sea and discover the magic of Greek island life.'
  },
  {
    id: 5,
    title: 'Iceland Adventure',
    destinations: ['Reykjavik', 'Golden Circle', 'South Coast'],
    image: '/images/hero-iceland.png',
    duration: '8 days',
    price: '$3,900',
    rating: 4.7,
    traveler: 'Astrid K.',
    travelerAvatar: '🌌',
    description: 'A breathtaking expedition through glaciers, volcanoes, and the northern lights.'
  },
];

export const activities = [
  {
    id: 1,
    name: 'Temple Walking Tour',
    city: 'Kyoto',
    image: '/images/city-kyoto.png',
    duration: '4 hours',
    price: '$85',
    rating: 4.9,
    category: 'Culture',
    description: 'Explore ancient temples and zen gardens with a local historian guide.'
  },
  {
    id: 2,
    name: 'Sunrise Mountain Trek',
    city: 'Bali',
    image: '/images/activity-hiking.png',
    duration: '6 hours',
    price: '$120',
    rating: 4.8,
    category: 'Adventure',
    description: 'Hike to the summit of Mount Batur for a breathtaking sunrise experience.'
  },
  {
    id: 3,
    name: 'Fine Dining Experience',
    city: 'Paris',
    image: '/images/activity-dining.png',
    duration: '3 hours',
    price: '$250',
    rating: 5.0,
    category: 'Food',
    description: 'Savor a multi-course tasting menu at a Michelin-starred rooftop restaurant.'
  },
  {
    id: 4,
    name: 'Caldera Sunset Cruise',
    city: 'Santorini',
    image: '/images/hero-santorini.png',
    duration: '5 hours',
    price: '$180',
    rating: 4.9,
    category: 'Adventure',
    description: 'Sail around the volcanic caldera and watch the famous Santorini sunset from the sea.'
  },
  {
    id: 5,
    name: 'Northern Lights Hunt',
    city: 'Reykjavik',
    image: '/images/hero-iceland.png',
    duration: '4 hours',
    price: '$150',
    rating: 4.7,
    category: 'Adventure',
    description: 'Chase the aurora borealis across Iceland\'s dramatic winter landscape.'
  },
  {
    id: 6,
    name: 'Neon District Night Tour',
    city: 'Tokyo',
    image: '/images/city-tokyo.png',
    duration: '3 hours',
    price: '$95',
    rating: 4.8,
    category: 'Culture',
    description: 'Explore Tokyo\'s electric nightlife, hidden bars, and vibrant street food scene.'
  },
];

export const itineraryData = {
  tripName: '10 Days in Uttarakhand',
  destination: 'Dehradun',
  dates: 'Oct 15 – Oct 25, 2025',
  travelers: 2,
  totalBudget: 2400,
  spent: 1250,
  heroImage: '/images/hero-dehradun.png',
  days: [
    {
      day: 1,
      date: 'Oct 15',
      city: 'Dehradun',
      title: 'Arrival in Dehradun',
      image: '/images/hero-dehradun.png',
      activities: [
        { time: '14:00', name: 'Airport Transfer', cost: 20, type: 'transport', icon: '✈️' },
        { time: '16:00', name: 'Hotel Check-in — Forest Resort', cost: 150, type: 'hotel', icon: '🏨' },
        { time: '19:00', name: 'Rajpur Road Walk', cost: 15, type: 'activity', icon: '🚶' },
      ]
    },
    {
      day: 2,
      date: 'Oct 16',
      city: 'Dehradun',
      title: 'Exploring the Valley',
      image: '/images/hero-dehradun.png',
      activities: [
        { time: '09:00', name: 'Robber\'s Cave Exploration', cost: 5, type: 'activity', icon: '⛰️' },
        { time: '12:00', name: 'Lunch at Orchard', cost: 25, type: 'activity', icon: '🍽️' },
        { time: '15:00', name: 'Forest Research Institute', cost: 10, type: 'activity', icon: '🏛️' },
        { time: '19:00', name: 'Cafe Hopping', cost: 30, type: 'activity', icon: '☕' },
      ]
    },
    {
      day: 3,
      date: 'Oct 17',
      city: 'Dehradun → Mussoorie',
      title: 'Up into the Clouds',
      image: '/images/hero-india.png',
      activities: [
        { time: '10:00', name: 'Drive to Mussoorie', cost: 40, type: 'transport', icon: '🚗' },
        { time: '12:00', name: 'Hotel Check-in — JW Marriott', cost: 350, type: 'hotel', icon: '🏨' },
        { time: '15:00', name: 'Mall Road Stroll', cost: 0, type: 'activity', icon: '🚶' },
        { time: '18:00', name: 'Sunset at Gun Hill', cost: 10, type: 'activity', icon: '🌅' },
      ]
    },
    {
      day: 4,
      date: 'Oct 18',
      city: 'Mussoorie',
      title: 'Queen of Hills',
      image: '/images/hero-india.png',
      activities: [
        { time: '08:00', name: 'Kempty Falls Excursion', cost: 25, type: 'activity', icon: '🌊' },
        { time: '13:00', name: 'Lunch at Landour Bakehouse', cost: 20, type: 'activity', icon: '🥐' },
        { time: '15:00', name: 'Dalai Hills Hike', cost: 0, type: 'activity', icon: '🥾' },
        { time: '19:00', name: 'Dinner with a View', cost: 60, type: 'activity', icon: '🍷' },
      ]
    },
    {
      day: 5,
      date: 'Oct 19',
      city: 'Mussoorie → Rishikesh',
      title: 'Spiritual Descent',
      image: '/images/city-temple.png',
      activities: [
        { time: '09:00', name: 'Drive to Rishikesh', cost: 60, type: 'transport', icon: '🚗' },
        { time: '12:00', name: 'Check-in — Taj Rishikesh', cost: 400, type: 'hotel', icon: '🏨' },
        { time: '16:00', name: 'Visit Ancient Temples', cost: 5, type: 'activity', icon: '🛕' },
        { time: '18:00', name: 'Ganga Aarti at Triveni Ghat', cost: 0, type: 'activity', icon: '✨' },
      ]
    },
  ],
  budget: {
    accommodation: 1400,
    activities: 450,
    transport: 200,
    food: 350,
  }
};

export const packingItems = [
  {
    category: 'Essentials',
    icon: '🎒',
    items: [
      { id: 1, name: 'Passport & Visa', packed: true },
      { id: 2, name: 'Travel Insurance Documents', packed: true },
      { id: 3, name: 'Flight Tickets (printed)', packed: false },
      { id: 4, name: 'Hotel Confirmations', packed: true },
      { id: 5, name: 'Cash & Credit Cards', packed: false },
      { id: 6, name: 'Phone & Charger', packed: true },
    ]
  },
  {
    category: 'Clothing',
    icon: '👔',
    items: [
      { id: 7, name: 'Light jacket', packed: true },
      { id: 8, name: 'Comfortable walking shoes', packed: true },
      { id: 9, name: 'Formal dinner outfit', packed: false },
      { id: 10, name: 'Rain jacket', packed: false },
      { id: 11, name: 'Casual daywear (5 sets)', packed: true },
      { id: 12, name: 'Sleepwear', packed: false },
    ]
  },
  {
    category: 'Electronics',
    icon: '📱',
    items: [
      { id: 13, name: 'Camera + spare batteries', packed: true },
      { id: 14, name: 'Universal power adapter', packed: false },
      { id: 15, name: 'Portable charger', packed: true },
      { id: 16, name: 'Noise-cancelling headphones', packed: true },
      { id: 17, name: 'E-reader / tablet', packed: false },
    ]
  },
  {
    category: 'Toiletries',
    icon: '🧴',
    items: [
      { id: 18, name: 'Toothbrush & toothpaste', packed: true },
      { id: 19, name: 'Sunscreen SPF 50+', packed: false },
      { id: 20, name: 'Prescription medications', packed: true },
      { id: 21, name: 'Hand sanitizer', packed: false },
      { id: 22, name: 'Travel-size toiletries', packed: false },
    ]
  },
];

export const tripNotes = [
  {
    id: 1,
    title: 'First Impressions of Dehradun',
    date: 'Oct 15, 2025',
    content: 'The mountain air hits differently here. Pine trees, misty mornings, and a slow pace of life that instantly relaxes you.',
    image: '/images/hero-dehradun.png',
    mood: '🌲'
  },
  {
    id: 2,
    title: 'Mussoorie Viewpoints',
    date: 'Oct 17, 2025',
    content: 'Looking down into the Doon Valley from Landour was breathtaking. The clouds roll in and out, changing the landscape every five minutes.',
    image: '/images/hero-india.png',
    mood: '☁️'
  },
  {
    id: 3,
    title: 'Peace in Rishikesh',
    date: 'Oct 18, 2025',
    content: 'The sound of the Ganges river passing by ancient temples is hypnotic. The evening Aarti ceremony was one of the most spiritual experiences of my life.',
    image: '/images/city-temple.png',
    mood: '🛕'
  },
  {
    id: 4,
    title: 'Exploring Ancient Carvings',
    date: 'Oct 19, 2025',
    content: 'We explored some older temples today. The intricate stonework and history dating back centuries makes you feel incredibly small in the grand timeline of the world.',
    image: '/images/city-temple.png',
    mood: '✨'
  },
];

export const communityTrips = [
  {
    id: 1,
    user: 'Elena Moretti',
    avatar: '🌸',
    trip: 'Himalayan Retreat',
    destination: 'Dehradun',
    image: '/images/hero-dehradun.png',
    likes: 2840,
    saves: 890,
    duration: '14 days',
  },
  {
    id: 2,
    user: 'Marcus Chen',
    avatar: '🌊',
    trip: 'Island Paradise',
    destination: 'Andaman',
    image: '/images/city-andaman.png',
    likes: 1950,
    saves: 620,
    duration: '7 days',
  },
  {
    id: 3,
    user: 'Sophie Laurent',
    avatar: '🗼',
    trip: 'Art & Architecture',
    destination: 'Paris',
    image: '/images/hero-paris.png',
    likes: 3200,
    saves: 1100,
    duration: '5 days',
  },
  {
    id: 4,
    user: 'James Harrington',
    avatar: '⛵',
    trip: 'Aegean Odyssey',
    destination: 'Greece',
    image: '/images/hero-santorini.png',
    likes: 2100,
    saves: 780,
    duration: '12 days',
  },
  {
    id: 5,
    user: 'Astrid Nygaard',
    avatar: '🌌',
    trip: 'Northern Lights Quest',
    destination: 'Iceland',
    image: '/images/hero-iceland.png',
    likes: 1680,
    saves: 540,
    duration: '8 days',
  },
  {
    id: 6,
    user: 'Kenji Takahashi',
    avatar: '🏙️',
    trip: 'Neon Nights',
    destination: 'Tokyo',
    image: '/images/city-tokyo.png',
    likes: 2500,
    saves: 920,
    duration: '6 days',
  },
];

export const adminStats = {
  totalUsers: 24850,
  activeTrips: 3420,
  revenue: '$2.4M',
  engagement: '89%',
  recentUsers: [
    { name: 'Elena Moretti', email: 'elena@email.com', trips: 12, joined: '2025-01-15', status: 'active' },
    { name: 'Marcus Chen', email: 'marcus@email.com', trips: 8, joined: '2025-02-20', status: 'active' },
    { name: 'Sophie Laurent', email: 'sophie@email.com', trips: 15, joined: '2024-11-05', status: 'active' },
    { name: 'James Harrington', email: 'james@email.com', trips: 6, joined: '2025-03-10', status: 'inactive' },
    { name: 'Astrid Nygaard', email: 'astrid@email.com', trips: 9, joined: '2025-01-28', status: 'active' },
  ],
  monthlyData: [
    { month: 'Jan', users: 1200, trips: 380, revenue: 145000 },
    { month: 'Feb', users: 1450, trips: 420, revenue: 168000 },
    { month: 'Mar', users: 1800, trips: 510, revenue: 198000 },
    { month: 'Apr', users: 2100, trips: 580, revenue: 225000 },
    { month: 'May', users: 2400, trips: 640, revenue: 248000 },
    { month: 'Jun', users: 2850, trips: 720, revenue: 285000 },
  ],
  topDestinations: [
    { name: 'Dehradun', trips: 840, percentage: 24 },
    { name: 'Andaman', trips: 720, percentage: 21 },
    { name: 'Jaipur', trips: 680, percentage: 20 },
    { name: 'Kerala', trips: 520, percentage: 15 },
    { name: 'South Temples', trips: 360, percentage: 10 },
  ]
};

export const userProfile = {
  name: 'Alexandra Sterling',
  handle: '@alexsterling',
  avatar: '✨',
  bio: 'Wandering the world one sunset at a time. Luxury travel enthusiast & cultural explorer.',
  location: 'San Francisco, CA',
  memberSince: 'January 2024',
  stats: {
    trips: 24,
    countries: 18,
    photos: 3420,
    followers: 1250,
    following: 380,
  },
  savedDestinations: ['Kyoto', 'Bali', 'Santorini', 'Paris', 'Iceland'],
  badges: [
    { name: 'Globe Trotter', icon: '🌍', description: 'Visited 15+ countries' },
    { name: 'Culture Maven', icon: '🏛️', description: 'Completed 10+ cultural experiences' },
    { name: 'Sunset Chaser', icon: '🌅', description: 'Watched sunsets in 5+ countries' },
    { name: 'Foodie Elite', icon: '🍽️', description: 'Dined at 5+ Michelin restaurants' },
  ],
};
