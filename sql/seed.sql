USE traveloop;

INSERT IGNORE INTO countries (country_name, country_code, currency) VALUES
('India',         'IN', 'INR'),
('Japan',         'JP', 'JPY'),
('France',        'FR', 'EUR'),
('Indonesia',     'ID', 'IDR'),
('Greece',        'GR', 'EUR'),
('United States', 'US', 'USD'),
('United Kingdom','GB', 'GBP'),
('Thailand',      'TH', 'THB'),
('Singapore',     'SG', 'SGD'),
('Italy',         'IT', 'EUR'),
('Iceland',       'IS', 'ISK');

INSERT IGNORE INTO activity_categories (name, description) VALUES
('Sightseeing',   'Landmarks, monuments, and iconic views'),
('Food & Dining', 'Local cuisine, street food, restaurants'),
('Adventure',     'Outdoor and adrenaline activities');

INSERT IGNORE INTO packing_categories (category_name) VALUES
('Essentials'),
('Clothing');

INSERT IGNORE INTO cities (country_id, city_name, description, avg_daily_cost, popularity_score, image_url) VALUES
((SELECT country_id FROM countries WHERE country_code='JP'), 'Tokyo',    'Neon-lit megalopolis blending tradition and ultra-modernity',   180.00, 97, '/images/city-tokyo.png'),
((SELECT country_id FROM countries WHERE country_code='FR'), 'Paris',    'City of Lights — Eiffel Tower, Louvre, world-class cuisine',    150.00, 98, '/images/city-paris.png'),
((SELECT country_id FROM countries WHERE country_code='ID'), 'Bali',     'Rice terraces, temples, surf, and spiritual retreats',           55.00, 91, '/images/city-bali.png'),
((SELECT country_id FROM countries WHERE country_code='JP'), 'Kyoto',    'Ancient temples, geisha districts, and bamboo forests',         110.00, 88, '/images/city-kyoto.png'),
((SELECT country_id FROM countries WHERE country_code='GR'), 'Santorini','Whitewashed cliffs and volcanic sunsets',                       120.00, 90, '/images/city-santorini.png'),
((SELECT country_id FROM countries WHERE country_code='IN'), 'Andaman',  'Pristine island beaches with crystal clear waters',              60.00, 82, '/images/city-andaman.png'),
((SELECT country_id FROM countries WHERE country_code='IN'), 'Jaipur',   'Pink City — forts, palaces, and vibrant Rajasthani culture',     30.00, 76, '/images/city-jaipur.png'),
((SELECT country_id FROM countries WHERE country_code='IN'), 'Kerala',   'Backwaters, houseboats, and lush hill stations',                 35.00, 80, '/images/city-kerala.png'),
((SELECT country_id FROM countries WHERE country_code='IN'), 'Dehradun', 'Gateway to Uttarakhand hill stations and Mussoorie',             25.00, 68, '/images/city-dehradun.png'),
((SELECT country_id FROM countries WHERE country_code='IS'), 'Reykjavik','Capital of Iceland with geothermal spas and Northern Lights',  140.00, 80, '/images/city-reykjavik.png'),
((SELECT country_id FROM countries WHERE country_code='US'), 'New York', 'The Big Apple — Times Square, Central Park, world culture',     200.00, 99, '/images/city-newyork.png'),
((SELECT country_id FROM countries WHERE country_code='GB'), 'London',   'Tower Bridge, Buckingham Palace, world-class museums',          170.00, 96, '/images/city-london.png'),
((SELECT country_id FROM countries WHERE country_code='SG'), 'Singapore','Garden city — Marina Bay, hawker food, and world efficiency',   130.00, 87, '/images/city-singapore.png'),
((SELECT country_id FROM countries WHERE country_code='TH'), 'Bangkok',  'Street food, temples, rooftop bars, and floating markets',       60.00, 92, '/images/city-bangkok.png'),
((SELECT country_id FROM countries WHERE country_code='IT'), 'Rome',     'Eternal City — Colosseum, Vatican, ancient history',            120.00, 95, '/images/city-rome.png');

INSERT IGNORE INTO activities (city_id, category_id, activity_name, description, estimated_cost, estimated_duration_minutes, rating) VALUES
((SELECT city_id FROM cities WHERE city_name='Tokyo'),     (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Shibuya Crossing',             'World''s busiest pedestrian crossing at rush hour',              0.00, 60,  4.6),
((SELECT city_id FROM cities WHERE city_name='Tokyo'),     (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Tsukiji Market Breakfast',     'Fresh sushi and street food at famous fish market',             20.00, 90,  4.8),
((SELECT city_id FROM cities WHERE city_name='Tokyo'),     (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Sumo Wrestling Match',         'Watch sumo wrestlers at Ryogoku Kokugikan',                     50.00, 150, 4.7),
((SELECT city_id FROM cities WHERE city_name='Paris'),     (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Eiffel Tower Visit',           'Skip-the-line summit access with city views',                   28.00, 120, 4.7),
((SELECT city_id FROM cities WHERE city_name='Paris'),     (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Louvre Museum',                'World''s largest art museum — Mona Lisa, Venus de Milo',        17.00, 180, 4.8),
((SELECT city_id FROM cities WHERE city_name='Paris'),     (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Seine River Dinner Cruise',    'Gourmet 3-course dinner while floating past landmarks',         95.00, 150, 4.6),
((SELECT city_id FROM cities WHERE city_name='Bali'),      (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Tegallalang Rice Terraces',    'UNESCO rice terrace landscape — sunrise hike',                   5.00, 120, 4.7),
((SELECT city_id FROM cities WHERE city_name='Bali'),      (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Surfing Lesson Kuta Beach',    '2-hour beginner surf lesson on Kuta beach',                     30.00, 120, 4.5),
((SELECT city_id FROM cities WHERE city_name='Bali'),      (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Balinese Cooking Class',       'Learn to prepare traditional Balinese dishes',                  35.00, 180, 4.8),
((SELECT city_id FROM cities WHERE city_name='Kyoto'),     (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Fushimi Inari Shrine',         'Thousands of vermilion torii gates on forested hillside',        0.00, 180, 4.9),
((SELECT city_id FROM cities WHERE city_name='Kyoto'),     (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Arashiyama Bamboo Grove',      'Serene bamboo forest walk at sunrise',                           0.00, 90,  4.8),
((SELECT city_id FROM cities WHERE city_name='Kyoto'),     (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Nishiki Market Food Tour',     'Street food tasting at Kyoto''s Kitchen',                       25.00, 120, 4.7),
((SELECT city_id FROM cities WHERE city_name='Santorini'), (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Oia Sunset Viewpoint',         'Famous blue-domed church with dramatic sunset views',            0.00, 90,  4.9),
((SELECT city_id FROM cities WHERE city_name='Santorini'), (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Caldera Boat Tour',            'Cruise around volcanic caldera and hot springs',                45.00, 240, 4.7),
((SELECT city_id FROM cities WHERE city_name='Santorini'), (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Greek Seafood Dinner',         'Fresh grilled octopus and mezze with caldera views',            70.00, 120, 4.8),
((SELECT city_id FROM cities WHERE city_name='Andaman'),   (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Scuba Diving at Radhanagar',   'Coral reef diving in crystal clear waters',                     80.00, 180, 4.9),
((SELECT city_id FROM cities WHERE city_name='Andaman'),   (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Cellular Jail Night Show',     'Historic light and sound show at colonial prison',              10.00, 90,  4.6),
((SELECT city_id FROM cities WHERE city_name='Andaman'),   (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Sea Walk Havelock Island',     'Underwater walking experience for non-swimmers',                60.00, 60,  4.7),
((SELECT city_id FROM cities WHERE city_name='Jaipur'),    (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Amber Fort Tour',              'Majestic hilltop palace with intricate architecture',           20.00, 120, 4.8),
((SELECT city_id FROM cities WHERE city_name='Jaipur'),    (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Hawa Mahal Pink Palace',       'Iconic pink five-story palace facade',                          10.00, 45,  4.6),
((SELECT city_id FROM cities WHERE city_name='Jaipur'),    (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Camel Safari Thar Desert',     'Ride camels across golden sand dunes at sunset',                50.00, 240, 4.7),
((SELECT city_id FROM cities WHERE city_name='Kerala'),    (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Alleppey Houseboat Cruise',    'Overnight houseboat on scenic Kerala backwaters',               80.00, 480, 4.9),
((SELECT city_id FROM cities WHERE city_name='Kerala'),    (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Munnar Tea Plantation Walk',   'Guided walk through rolling tea estates',                       15.00, 150, 4.7),
((SELECT city_id FROM cities WHERE city_name='Kerala'),    (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Kerala Sadya Meal',            'Traditional banana-leaf feast with 24 dishes',                  10.00, 60,  4.8),
((SELECT city_id FROM cities WHERE city_name='Dehradun'),  (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Robbers Cave Trekking',        'Scenic gorge trek through Gaulahar Cave stream',                 5.00, 120, 4.5),
((SELECT city_id FROM cities WHERE city_name='Dehradun'),  (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Mussoorie Day Trip',           'Queen of Hills — Mall Road, Kempty Falls',                      20.00, 480, 4.6),
((SELECT city_id FROM cities WHERE city_name='Reykjavik'), (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Northern Lights Tour',         'Hunt for Aurora Borealis on guided night tour',                 80.00, 300, 4.9),
((SELECT city_id FROM cities WHERE city_name='Reykjavik'), (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Blue Lagoon Geothermal Spa',   'Hot spring with milky blue mineral water',                      60.00, 180, 4.9),
((SELECT city_id FROM cities WHERE city_name='Reykjavik'), (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Golden Circle Day Tour',       'Geysir, Gullfoss waterfall, and Thingvellir National Park',     90.00, 480, 4.8),
((SELECT city_id FROM cities WHERE city_name='New York'),  (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Empire State Building',        'Iconic skyscraper with observation deck',                       39.00, 90,  4.7),
((SELECT city_id FROM cities WHERE city_name='New York'),  (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Central Park Walking Tour',    'Iconic urban park with lake, bridges, and gardens',              0.00, 120, 4.6),
((SELECT city_id FROM cities WHERE city_name='New York'),  (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Pizza in Greenwich Village',   'Famous New York pizza tour',                                    25.00, 90,  4.5),
((SELECT city_id FROM cities WHERE city_name='London'),    (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Tower of London',              'Royal residence with historic artifacts and Crown Jewels',      30.00, 150, 4.7),
((SELECT city_id FROM cities WHERE city_name='London'),    (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'British Museum',               'World culture collection — Rosetta Stone, Egyptian mummies',     0.00, 180, 4.8),
((SELECT city_id FROM cities WHERE city_name='London'),    (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Borough Market Food Tour',     'London''s oldest food market — cheese, bread, street food',     30.00, 120, 4.6),
((SELECT city_id FROM cities WHERE city_name='Singapore'), (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Gardens by the Bay',           'Futuristic Supertrees and stunning biodomes',                   20.00, 180, 4.8),
((SELECT city_id FROM cities WHERE city_name='Singapore'), (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Hawker Centre Food Tour',      'Singapore''s famous street food at Maxwell Food Centre',         15.00, 120, 4.9),
((SELECT city_id FROM cities WHERE city_name='Singapore'), (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Sentosa Island Adventure',     'Universal Studios, beaches, and cable car',                     50.00, 360, 4.6),
((SELECT city_id FROM cities WHERE city_name='Bangkok'),   (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Grand Palace & Wat Phra Kaew', 'Thailand''s most sacred royal temple complex',                  15.00, 150, 4.7),
((SELECT city_id FROM cities WHERE city_name='Bangkok'),   (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Yaowarat Street Food Tour',    'Chinatown night market — pad thai, mango sticky rice',          25.00, 180, 4.8),
((SELECT city_id FROM cities WHERE city_name='Bangkok'),   (SELECT category_id FROM activity_categories WHERE name='Adventure'),     'Floating Market Day Trip',     'Damnoen Saduak floating market by longtail boat',               35.00, 240, 4.4),
((SELECT city_id FROM cities WHERE city_name='Rome'),      (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Colosseum & Roman Forum',      'Ancient amphitheater and ruins of ancient Rome',                18.00, 150, 4.8),
((SELECT city_id FROM cities WHERE city_name='Rome'),      (SELECT category_id FROM activity_categories WHERE name='Sightseeing'),   'Vatican Museums & Sistine Chapel','Michelangelo ceiling and St. Peter''s Basilica',               27.00, 240, 4.9),
((SELECT city_id FROM cities WHERE city_name='Rome'),      (SELECT category_id FROM activity_categories WHERE name='Food & Dining'), 'Trastevere Food Walk',         'Roman street food — supplì, porchetta, gelato',                 45.00, 120, 4.6);

INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@traveloop.com', '$2a$10$XEY0BySfydektudd1lclb.y37HHrUCIlFGItszOtZBaLchakYf/DS', 'admin');
