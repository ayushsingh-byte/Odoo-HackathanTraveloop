USE traveloop;

INSERT INTO countries (country_name, country_code, currency) VALUES
('France',        'FR', 'EUR'),
('Italy',         'IT', 'EUR'),
('Japan',         'JP', 'JPY'),
('Thailand',      'TH', 'THB'),
('United States', 'US', 'USD'),
('Spain',         'ES', 'EUR'),
('India',         'IN', 'INR'),
('United Kingdom','GB', 'GBP'),
('Germany',       'DE', 'EUR'),
('Australia',     'AU', 'AUD'),
('Indonesia',     'ID', 'IDR'),
('Portugal',      'PT', 'EUR'),
('Netherlands',   'NL', 'EUR'),
('Switzerland',   'CH', 'CHF'),
('Singapore',     'SG', 'SGD');

INSERT INTO activity_categories (name, description) VALUES
('Sightseeing',   'Landmarks, monuments, and iconic views'),
('Food & Dining', 'Local cuisine, street food, restaurants'),
('Adventure',     'Outdoor and adrenaline activities'),
('Culture',       'Museums, galleries, historical sites'),
('Shopping',      'Markets, malls, local crafts'),
('Nature',        'Parks, beaches, hikes, wildlife'),
('Nightlife',     'Bars, clubs, evening entertainment'),
('Wellness',      'Spas, yoga, relaxation');

INSERT INTO packing_categories (category_name) VALUES
('Documents'),
('Clothing'),
('Electronics'),
('Toiletries'),
('Medicine'),
('Other');

INSERT INTO cities (country_id, city_name, description, avg_daily_cost, popularity_score, image_url) VALUES
(1,  'Paris',      'City of Lights — Eiffel Tower, Louvre, world-class cuisine',              150.00, 98, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'),
(1,  'Nice',       'French Riviera gem with beaches and vibrant old town',                      90.00, 75, 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800'),
(2,  'Rome',       'Eternal City — Colosseum, Vatican, ancient history',                       120.00, 95, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'),
(2,  'Venice',     'Floating city of canals, gondolas, and Renaissance art',                   130.00, 90, 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800'),
(2,  'Florence',   'Cradle of the Renaissance — Uffizi, Duomo, Tuscany',                      100.00, 85, 'https://images.unsplash.com/photo-1543429258-7c5e045ced5b?w=800'),
(3,  'Tokyo',      'Neon-lit megalopolis blending tradition and ultra-modernity',              180.00, 97, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'),
(3,  'Kyoto',      'Ancient temples, geisha districts, and bamboo forests',                    110.00, 88, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'),
(3,  'Osaka',      'Japan''s kitchen — street food capital and vibrant nightlife',              100.00, 82, 'https://images.unsplash.com/photo-1589798333175-4f97e5edc5a7?w=800'),
(4,  'Bangkok',    'Street food, temples, rooftop bars, and floating markets',                  60.00, 92, 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=800'),
(4,  'Chiang Mai', 'Northern Thailand — temples, jungles, elephant sanctuaries',               45.00, 78, 'https://images.unsplash.com/photo-1598935888738-cd2622bcd437?w=800'),
(5,  'New York',   'The Big Apple — Times Square, Central Park, world culture',               200.00, 99, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'),
(5,  'Los Angeles','Hollywood, beaches, art, and year-round sunshine',                         160.00, 88, 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800'),
(6,  'Barcelona',  'Gaudi architecture, tapas, beaches, and vibrant culture',                  110.00, 93, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800'),
(6,  'Madrid',     'Royal palaces, world-class art museums, lively nightlife',                  95.00, 82, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800'),
(7,  'Mumbai',     'Financial capital — Gateway of India, Bollywood, street food',              40.00, 80, 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800'),
(7,  'Jaipur',     'Pink City — forts, palaces, and vibrant Rajasthani culture',                30.00, 76, 'https://images.unsplash.com/photo-1477587458883-47145ed31fd8?w=800'),
(8,  'London',     'Tower Bridge, Buckingham Palace, world-class museums',                     170.00, 96, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800'),
(9,  'Berlin',     'History, art, techno clubs, and vibrant street culture',                    90.00, 83, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800'),
(10, 'Sydney',     'Opera House, Bondi Beach, harbour walks, and cafe culture',               160.00, 89, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'),
(11, 'Bali',       'Rice terraces, temples, surf, and spiritual retreats',                      55.00, 91, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'),
(15, 'Singapore',  'Garden city — Marina Bay, hawker food, and world efficiency',             130.00, 87, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800');

INSERT INTO activities (city_id, category_id, activity_name, description, estimated_cost, estimated_duration_minutes, rating) VALUES
(1,  1, 'Eiffel Tower Visit',              'Skip-the-line summit access with city views',                     28.00, 120, 4.7),
(1,  4, 'Louvre Museum',                   'World''s largest art museum — Mona Lisa, Venus de Milo',          17.00, 180, 4.8),
(1,  2, 'Seine River Dinner Cruise',       'Gourmet 3-course dinner while floating past landmarks',           95.00, 150, 4.6),
(1,  1, 'Montmartre Walking Tour',         'Artistic hilltop district with Sacré-Cœur',                        0.00, 90,  4.5),
(1,  2, 'Le Marais Food Tour',             'French pastries, cheese, wine tasting in historic district',      60.00, 180, 4.7),
(3,  1, 'Colosseum & Roman Forum',         'Ancient amphitheater and ruins of ancient Rome',                  18.00, 150, 4.8),
(3,  1, 'Vatican Museums & Sistine Chapel','Michelangelo ceiling and St. Peter''s Basilica',                  27.00, 240, 4.9),
(3,  2, 'Trastevere Food Walk',            'Roman street food — supplì, porchetta, gelato',                   45.00, 120, 4.6),
(3,  1, 'Trevi Fountain',                  'Iconic Baroque fountain — toss a coin for good luck',              0.00, 30,  4.5),
(3,  4, 'Borghese Gallery',               'Renaissance masterpieces by Bernini and Caravaggio',               15.00, 120, 4.7),
(6,  1, 'Shibuya Crossing',               'World''s busiest pedestrian crossing at rush hour',                 0.00, 60,  4.6),
(6,  2, 'Tsukiji Outer Market Breakfast', 'Fresh sushi and street food at famous fish market',                20.00, 90,  4.8),
(6,  4, 'teamLab Planets',                'Immersive digital art museum in Toyosu',                           30.00, 120, 4.9),
(6,  1, 'Senso-ji Temple',                'Tokyo''s oldest temple in Asakusa district',                        0.00, 90,  4.7),
(6,  7, 'Golden Gai Bar Hopping',         'Tiny atmospheric bars in Shinjuku''s Golden Gai',                  40.00, 180, 4.5),
(9,  1, 'Grand Palace & Wat Phra Kaew',   'Thailand''s most sacred royal temple complex',                     15.00, 150, 4.7),
(9,  2, 'Street Food Tour Yaowarat',      'Chinatown night market — pad thai, mango sticky rice',             25.00, 180, 4.8),
(9,  3, 'Muay Thai Match',                'Watch live Muay Thai boxing at Rajadamnern Stadium',               30.00, 180, 4.6),
(9,  6, 'Floating Market Day Trip',       'Damnoen Saduak floating market by longtail boat',                  35.00, 240, 4.4),
(13, 1, 'Sagrada Família',                'Gaudí''s unfinished masterpiece basilica',                         26.00, 120, 4.9),
(13, 1, 'Park Güell',                     'Gaudí mosaic park with panoramic city views',                      10.00, 90,  4.6),
(13, 2, 'La Boqueria Market',             'Vibrant covered market — fresh produce, tapas, seafood',            0.00, 60,  4.5),
(13, 6, 'Barceloneta Beach',              'Sandy city beach with chiringuitos and Mediterranean sea',           0.00, 180, 4.4),
(17, 4, 'British Museum',                 'World culture collection — Rosetta Stone, Egyptian mummies',        0.00, 180, 4.8),
(17, 1, 'Tower of London & Bridge',       'Crown Jewels and iconic bascule bridge',                           30.00, 150, 4.7),
(17, 2, 'Borough Market Food Tour',       'London''s oldest food market — cheese, bread, street food',        30.00, 120, 4.6),
(17, 1, 'Buckingham Palace',              'Royal residence with Changing of the Guard ceremony',               0.00, 60,  4.3),
(20, 6, 'Tegallalang Rice Terraces',      'UNESCO rice terrace landscape — sunrise hike',                      5.00, 120, 4.7),
(20, 4, 'Uluwatu Temple Sunset',          'Clifftop Balinese temple with Kecak fire dance',                   10.00, 120, 4.8),
(20, 3, 'Surfing Lesson Kuta',            '2-hour beginner surf lesson on Kuta beach',                        30.00, 120, 4.5),
(20, 8, 'Ubud Spa & Rice Walk',           'Traditional Balinese massage + rice paddy walk',                   40.00, 240, 4.7);

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@traveloop.com', '$2b$10$rOzJqQ9X1k2mN8vL3pYwOeKjH5tUi7sG4nM6fE0dC1bA9yZ8xW2qP', 'admin');
