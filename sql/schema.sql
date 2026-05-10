CREATE DATABASE IF NOT EXISTS traveloop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traveloop;

CREATE TABLE countries (
  country_id   INT AUTO_INCREMENT PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL,
  country_code CHAR(2) NOT NULL,
  currency     VARCHAR(10),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_country_code (country_code)
);

CREATE TABLE activity_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  UNIQUE KEY uq_category_name (name)
);

CREATE TABLE packing_categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

CREATE TABLE cities (
  city_id          INT AUTO_INCREMENT PRIMARY KEY,
  country_id       INT NOT NULL,
  city_name        VARCHAR(150) NOT NULL,
  description      TEXT,
  avg_daily_cost   DECIMAL(8,2),
  popularity_score INT DEFAULT 0,
  image_url        VARCHAR(500),
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_city_country (city_name, country_id),
  KEY idx_cities_country (country_id),
  FULLTEXT KEY ft_city_search (city_name, description),
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE activities (
  activity_id                INT AUTO_INCREMENT PRIMARY KEY,
  city_id                    INT NOT NULL,
  category_id                INT NOT NULL,
  activity_name              VARCHAR(200) NOT NULL,
  description                TEXT,
  estimated_cost             DECIMAL(8,2),
  estimated_duration_minutes INT,
  rating                     DECIMAL(3,2),
  image_url                  VARCHAR(500),
  created_at                 DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_activities_city     (city_id),
  KEY idx_activities_category (category_id),
  FULLTEXT KEY ft_activity_search (activity_name, description),
  FOREIGN KEY (city_id)     REFERENCES cities(city_id),
  FOREIGN KEY (category_id) REFERENCES activity_categories(category_id)
);

CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(500),
  role          ENUM('user','admin') DEFAULT 'user',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_email (email),
  KEY idx_users_email (email)
);

CREATE TABLE trips (
  trip_id     CHAR(36) PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  start_date  DATE,
  end_date    DATE,
  visibility  ENUM('private','public','link_only') DEFAULT 'private',
  cover_image VARCHAR(500),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_trips_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trip_stops (
  stop_id        INT AUTO_INCREMENT PRIMARY KEY,
  trip_id        CHAR(36) NOT NULL,
  city_id        INT NOT NULL,
  arrival_date   DATE,
  departure_date DATE,
  position       INT NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_stops_trip (trip_id),
  KEY idx_stops_city (city_id),
  FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
);

CREATE TABLE stop_activities (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  stop_id        INT NOT NULL,
  activity_id    INT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  actual_cost    DECIMAL(8,2),
  notes          TEXT,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_stopact_stop     (stop_id),
  KEY idx_stopact_activity (activity_id),
  FOREIGN KEY (stop_id)     REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);

CREATE TABLE trip_budgets (
  budget_id      INT AUTO_INCREMENT PRIMARY KEY,
  trip_id        CHAR(36) NOT NULL,
  total_budget   DECIMAL(12,2) DEFAULT 0,
  transport_cost DECIMAL(12,2) DEFAULT 0,
  stay_cost      DECIMAL(12,2) DEFAULT 0,
  food_cost      DECIMAL(12,2) DEFAULT 0,
  activity_cost  DECIMAL(12,2) DEFAULT 0,
  misc_cost      DECIMAL(12,2) DEFAULT 0,
  total_cost     DECIMAL(12,2) DEFAULT 0,
  currency       VARCHAR(10) DEFAULT 'USD',
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_budget_trip (trip_id),
  FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE transport_segments (
  segment_id       INT AUTO_INCREMENT PRIMARY KEY,
  trip_id          CHAR(36) NOT NULL,
  from_stop_id     INT,
  to_stop_id       INT,
  transport_type   ENUM('flight','train','bus','cab','metro') DEFAULT 'flight',
  transport_cost   DECIMAL(10,2),
  duration_minutes INT,
  notes            TEXT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_seg_trip      (trip_id),
  KEY idx_seg_from_stop (from_stop_id),
  KEY idx_seg_to_stop   (to_stop_id),
  FOREIGN KEY (trip_id)      REFERENCES trips(trip_id) ON DELETE CASCADE,
  FOREIGN KEY (from_stop_id) REFERENCES trip_stops(stop_id) ON DELETE SET NULL,
  FOREIGN KEY (to_stop_id)   REFERENCES trip_stops(stop_id) ON DELETE SET NULL
);

CREATE TABLE packing_checklist_items (
  item_id     INT AUTO_INCREMENT PRIMARY KEY,
  trip_id     CHAR(36) NOT NULL,
  user_id     INT NOT NULL,
  category_id INT,
  item_name   VARCHAR(200) NOT NULL,
  is_packed   TINYINT(1) DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pack_trip (trip_id),
  FOREIGN KEY (trip_id)     REFERENCES trips(trip_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES packing_categories(category_id)
);

CREATE TABLE trip_notes (
  note_id      INT AUTO_INCREMENT PRIMARY KEY,
  trip_id      CHAR(36) NOT NULL,
  stop_id      INT DEFAULT NULL,
  user_id      INT NOT NULL,
  note_title   VARCHAR(200),
  note_content TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_notes_trip (trip_id),
  FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES trip_stops(stop_id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE shared_links (
  link_id     INT AUTO_INCREMENT PRIMARY KEY,
  trip_id     CHAR(36) NOT NULL,
  share_token CHAR(64) NOT NULL,
  is_active   TINYINT(1) DEFAULT 1,
  expires_at  DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_share_token (share_token),
  KEY idx_shared_trip (trip_id),
  FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE Extra_info (
  link_id     INT AUTO_INCREMENT PRIMARY KEY,
  trip_id     CHAR(36) NOT NULL,
  info_key    VARCHAR(100) NOT NULL,
  info_value  TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_extra_trip (trip_id),
  FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

