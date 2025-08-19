-- Create database
CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    owner_id INT,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ratings table
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_store (user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator', 'admin@system.com', '$2b$10$8K1p/a0dCVWFUwsLdNmr7uPiRNEkgJAI3Q7J8YLOxJ5Kv7wH9ZKdG', 'System Address', 'admin');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_address ON stores(address(100));
CREATE INDEX idx_ratings_user_store ON ratings(user_id, store_id);
CREATE INDEX idx_ratings_store ON ratings(store_id);

-- Trigger to update store average rating when a rating is added/updated
DELIMITER //
CREATE TRIGGER update_store_rating_after_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET average_rating = (
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    )
    WHERE id = NEW.store_id;
END//

CREATE TRIGGER update_store_rating_after_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET average_rating = (
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    )
    WHERE id = NEW.store_id;
END//

CREATE TRIGGER update_store_rating_after_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET average_rating = COALESCE((
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = OLD.store_id
    ), 0.00),
    total_ratings = (
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = OLD.store_id
    )
    WHERE id = OLD.store_id;
END//

DELIMITER ;

-- DUMMY DATA INSERTION

-- Insert dummy users (mix of regular users and store owners)
INSERT INTO users (name, email, password, address, role) VALUES 
-- Store owners
('John Smith', 'john.smith@email.com', '$2b$10$hashed_password_1', '123 Main St, New York, NY 10001', 'store_owner'),
('Sarah Johnson', 'sarah.johnson@email.com', '$2b$10$hashed_password_2', '456 Oak Ave, Los Angeles, CA 90210', 'store_owner'),
('Mike Chen', 'mike.chen@email.com', '$2b$10$hashed_password_3', '789 Pine Rd, Chicago, IL 60601', 'store_owner'),
('Emily Davis', 'emily.davis@email.com', '$2b$10$hashed_password_4', '321 Elm St, Houston, TX 77001', 'store_owner'),
('Robert Wilson', 'robert.wilson@email.com', '$2b$10$hashed_password_5', '654 Maple Dr, Phoenix, AZ 85001', 'store_owner'),
-- Regular users
('Alice Brown', 'alice.brown@email.com', '$2b$10$hashed_password_6', '111 First St, Miami, FL 33101', 'user'),
('David Miller', 'david.miller@email.com', '$2b$10$hashed_password_7', '222 Second Ave, Seattle, WA 98101', 'user'),
('Jessica Garcia', 'jessica.garcia@email.com', '$2b$10$hashed_password_8', '333 Third Blvd, Denver, CO 80201', 'user'),
('Michael Taylor', 'michael.taylor@email.com', '$2b$10$hashed_password_9', '444 Fourth St, Boston, MA 02101', 'user'),
('Lisa Anderson', 'lisa.anderson@email.com', '$2b$10$hashed_password_10', '555 Fifth Ave, Atlanta, GA 30301', 'user'),
('James Martinez', 'james.martinez@email.com', '$2b$10$hashed_password_11', '666 Sixth St, Portland, OR 97201', 'user'),
('Maria Rodriguez', 'maria.rodriguez@email.com', '$2b$10$hashed_password_12', '777 Seventh Ave, Nashville, TN 37201', 'user'),
('Kevin Thompson', 'kevin.thompson@email.com', '$2b$10$hashed_password_13', '888 Eighth St, Austin, TX 73301', 'user'),
('Jennifer White', 'jennifer.white@email.com', '$2b$10$hashed_password_14', '999 Ninth Ave, San Francisco, CA 94101', 'user'),
('Daniel Lewis', 'daniel.lewis@email.com', '$2b$10$hashed_password_15', '1010 Tenth St, Las Vegas, NV 89101', 'user');

-- Insert dummy stores
INSERT INTO stores (name, email, address, owner_id) VALUES 
('Tech Paradise', 'contact@techparadise.com', '100 Technology Blvd, Silicon Valley, CA 94000', 2),
('Gourmet Corner', 'info@gourmetcorner.com', '250 Foodie Street, New York, NY 10002', 3),
('Fashion Hub', 'hello@fashionhub.com', '375 Style Avenue, Los Angeles, CA 90211', 4),
('Book Haven', 'support@bookhaven.com', '500 Literature Lane, Boston, MA 02102', 5),
('Sports Zone', 'contact@sportszone.com', '625 Athletic Drive, Chicago, IL 60602', 6),
('Home & Garden', 'info@homeandgarden.com', '750 Domestic Way, Houston, TX 77002', 2),
('Music World', 'hello@musicworld.com', '875 Harmony Street, Nashville, TN 37202', 3),
('Pet Paradise', 'support@petparadise.com', '1000 Animal Avenue, Miami, FL 33102', 4);

-- Insert dummy ratings (this will trigger the rating calculation automatically)
INSERT INTO ratings (user_id, store_id, rating) VALUES 
-- Tech Paradise (store_id: 1) - Good ratings
(7, 1, 5), (8, 1, 4), (9, 1, 5), (10, 1, 4), (11, 1, 5), (12, 1, 4),
-- Gourmet Corner (store_id: 2) - Mixed ratings
(7, 2, 3), (8, 2, 4), (9, 2, 2), (10, 2, 5), (11, 2, 3), (12, 2, 4), (13, 2, 3),
-- Fashion Hub (store_id: 3) - Excellent ratings
(7, 3, 5), (8, 3, 5), (9, 3, 4), (10, 3, 5), (11, 3, 5),
-- Book Haven (store_id: 4) - Average ratings
(8, 4, 3), (9, 4, 4), (10, 4, 3), (11, 4, 4), (12, 4, 3), (13, 4, 4), (14, 4, 3), (15, 4, 4),
-- Sports Zone (store_id: 5) - Good ratings
(7, 5, 4), (8, 5, 5), (9, 5, 4), (10, 5, 4), (11, 5, 5), (12, 5, 4), (13, 5, 5),
-- Home & Garden (store_id: 6) - Poor ratings
(8, 6, 2), (9, 6, 3), (10, 6, 2), (11, 6, 1), (12, 6, 2),
-- Music World (store_id: 7) - Very good ratings
(7, 7, 5), (8, 7, 4), (9, 7, 5), (10, 7, 5), (11, 7, 4), (12, 7, 5), (13, 7, 4), (14, 7, 5), (15, 7, 5),
-- Pet Paradise (store_id: 8) - Mixed ratings
(7, 8, 3), (8, 8, 4), (9, 8, 3), (10, 8, 2), (11, 8, 4), (12, 8, 3);

-- Query to verify the data and see calculated ratings
SELECT 
    s.name AS store_name,
    s.average_rating,
    s.total_ratings,
    u.name AS owner_name
FROM stores s
LEFT JOIN users u ON s.owner_id = u.id
ORDER BY s.average_rating DESC;

-- Query to check if your email exists (as in your original query)
SELECT email FROM users WHERE email = 'yuvrajpatil120904@gmail.com';