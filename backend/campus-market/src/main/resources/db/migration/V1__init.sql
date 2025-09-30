-- USERS
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100)  NOT NULL,
  role ENUM('BUYER','SELLER','ADMIN') NOT NULL,
  status ENUM('ACTIVE','SUSPENDED')   NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- LISTINGS
CREATE TABLE IF NOT EXISTS listings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  seller_id  BIGINT NOT NULL,
  title      VARCHAR(160) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  currency   CHAR(3) NOT NULL DEFAULT 'USD',
  category_id BIGINT,
  status ENUM('ACTIVE','SOLD','REMOVED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listing_seller   FOREIGN KEY (seller_id)  REFERENCES users(id),
  CONSTRAINT fk_listing_category FOREIGN KEY (category_id) REFERENCES categories(id),
  FULLTEXT KEY ft_title_desc (title, description)  -- MySQL uses; H2 safely ignores
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- LISTING IMAGES
CREATE TABLE IF NOT EXISTS listing_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  listing_id BIGINT NOT NULL,
  url VARCHAR(1024) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_image_listing FOREIGN KEY (listing_id) REFERENCES listings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  listing_id BIGINT NOT NULL,
  buyer_id   BIGINT NOT NULL,
  seller_id  BIGINT NOT NULL,
  last_message_at TIMESTAMP NULL,
  CONSTRAINT fk_conv_listing FOREIGN KEY (listing_id) REFERENCES listings(id),
  CONSTRAINT fk_conv_buyer   FOREIGN KEY (buyer_id)   REFERENCES users(id),
  CONSTRAINT fk_conv_seller  FOREIGN KEY (seller_id)  REFERENCES users(id),
  UNIQUE KEY uq_conv_unique (listing_id, buyer_id, seller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users(id),
  INDEX idx_msg_conv_created (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  listing_id BIGINT NOT NULL,
  reporter_id BIGINT NOT NULL,
  reason VARCHAR(200) NOT NULL,
  notes  TEXT NULL,
  status ENUM('OPEN','RESOLVED','REJECTED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  moderator_id BIGINT NULL,
  CONSTRAINT fk_rep_listing   FOREIGN KEY (listing_id)   REFERENCES listings(id),
  CONSTRAINT fk_rep_reporter  FOREIGN KEY (reporter_id)  REFERENCES users(id),
  CONSTRAINT fk_rep_moderator FOREIGN KEY (moderator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_listings_cat_status ON listings(category_id, status);
CREATE INDEX idx_listings_seller     ON listings(seller_id, status, created_at);
