DROP TABLE ratings;
DROP TABLE stores;
DROP TABLE users;

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


INSERT INTO users (name, email, password, address, role) VALUES 
-- Store owners
('Rajesh Patil', 'rajesh.patil@gmail.com', '$2b$10$hashed_password_1', 'Shop No. 15, FC Road, Pune, Maharashtra 411005', 'store_owner'),
('Priya Sharma', 'priya.sharma@gmail.com', '$2b$10$hashed_password_2', '201, Linking Road, Bandra West, Mumbai, Maharashtra 400050', 'store_owner'),
('Amit Deshmukh', 'amit.deshmukh@gmail.com', '$2b$10$hashed_password_3', 'Plot No. 45, Sitabuldi, Nagpur, Maharashtra 440012', 'store_owner'),
('Sunita Joshi', 'sunita.joshi@gmail.com', '$2b$10$hashed_password_4', 'Galli No. 3, Kasba Peth, Pune, Maharashtra 411011', 'store_owner'),
('Sachin Kulkarni', 'sachin.kulkarni@gmail.com', '$2b$10$hashed_password_5', 'Shop No. 23, Station Road, Nashik, Maharashtra 422001', 'store_owner'),
('Meera Bhosale', 'meera.bhosale@gmail.com', '$2b$10$hashed_password_6', '105, MG Road, Aurangabad, Maharashtra 431001', 'store_owner'),
-- Regular users
('Rahul Jadhav', 'rahul.jadhav@gmail.com', '$2b$10$hashed_password_7', 'Flat 302, Kothrud, Pune, Maharashtra 411038', 'user'),
('Neha Marathe', 'neha.marathe@gmail.com', '$2b$10$hashed_password_8', 'B-wing, Thane West, Maharashtra 400601', 'user'),
('Arjun Singh', 'arjun.singh@gmail.com', '$2b$10$hashed_password_9', 'Sector 15, Vashi, Navi Mumbai, Maharashtra 400703', 'user'),
('Kavita Rane', 'kavita.rane@gmail.com', '$2b$10$hashed_password_10', 'Near Dagdusheth Temple, Pune, Maharashtra 411002', 'user'),
('Vikram Pawar', 'vikram.pawar@gmail.com', '$2b$10$hashed_password_11', 'Camp Area, Pune, Maharashtra 411001', 'user'),
('Pooja Kale', 'pooja.kale@gmail.com', '$2b$10$hashed_password_12', 'Shivaji Nagar, Nagpur, Maharashtra 440010', 'user'),
('Rohit Sawant', 'rohit.sawant@gmail.com', '$2b$10$hashed_password_13', 'Goregaon East, Mumbai, Maharashtra 400063', 'user'),
('Anjali Deshpande', 'anjali.deshpande@gmail.com', '$2b$10$hashed_password_14', 'Deccan Gymkhana, Pune, Maharashtra 411004', 'user'),
('Sanjay More', 'sanjay.more@gmail.com', '$2b$10$hashed_password_15', 'Kolhapur Road, Sangli, Maharashtra 416416', 'user'),
('Manisha Chavan', 'manisha.chavan@gmail.com', '$2b$10$hashed_password_16', 'Civil Lines, Nagpur, Maharashtra 440001', 'user');

INSERT INTO stores (name, email, address, owner_id) VALUES 
('Maharashtra Electronics', 'info@maharashtraelectronics.com', 'Shop No. 15, FC Road, Pune, Maharashtra 411005', 2),
('Mumbai Fashion Store', 'contact@mumbaifashion.com', '201, Linking Road, Bandra West, Mumbai, Maharashtra 400050', 3),
('Nagpur Sweets & Snacks', 'orders@nagpursweets.com', 'Plot No. 45, Sitabuldi, Nagpur, Maharashtra 440012', 4),
('Pune Book Palace', 'hello@punebookpalace.com', 'Galli No. 3, Kasba Peth, Pune, Maharashtra 411011', 5),
('Nashik Sports Corner', 'info@nashiksports.com', 'Shop No. 23, Station Road, Nashik, Maharashtra 422001', 6),
('Aurangabad Jewellers', 'contact@aurangabadjewellers.com', '105, MG Road, Aurangabad, Maharashtra 431001', 7),
('Kolhapuri Chappal House', 'sales@kolhapurichappal.com', 'Main Market, Kolhapur, Maharashtra 416012', 2),
('Pune Organic Foods', 'orders@puneorganicfoods.com', 'Near Swargate, Pune, Maharashtra 411037', 3),
('Mumbai Mobile Zone', 'support@mumbaimbilezone.com', 'Dadar West, Mumbai, Maharashtra 400028', 4),
('Nashik Wine Store', 'info@nashikwinestore.com', 'Gangapur Road, Nashik, Maharashtra 422013', 5);


INSERT INTO ratings (user_id, store_id, rating) VALUES 
(8, 1, 5), (9, 1, 4), (10, 1, 5), (11, 1, 4), (12, 1, 5), (13, 1, 4), (14, 1, 5),
(8, 2, 5), (9, 2, 5), (10, 2, 4), (11, 2, 5), (12, 2, 5), (13, 2, 4), (15, 2, 5), (16, 2, 5),
(8, 3, 4), (9, 3, 4), (10, 3, 5), (11, 3, 4), (12, 3, 5), (13, 3, 4), (14, 3, 5),
(9, 4, 4), (10, 4, 3), (11, 4, 4), (12, 4, 3), (13, 4, 4), (15, 4, 3), (16, 4, 4),
(9, 5, 4), (10, 5, 5), (11, 5, 4), (12, 5, 4), (14, 5, 5), (15, 5, 4), (16, 5, 5),
(8, 6, 5), (9, 6, 5), (10, 6, 5), (11, 6, 4), (13, 6, 5), (14, 6, 5), (15, 6, 5),
(9, 7, 4), (10, 7, 5), (11, 7, 4), (12, 7, 4), (13, 7, 5), (16, 7, 4),
(8, 8, 3), (10, 8, 4), (11, 8, 3), (12, 8, 4), (15, 8, 3), (16, 8, 4),
(9, 9, 4), (10, 9, 5), (11, 9, 4), (13, 9, 4), (14, 9, 5), (15, 9, 4),
(8, 10, 3), (9, 10, 4), (12, 10, 2), (13, 10, 5), (14, 10, 3), (16, 10, 4);

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

SELECT * FROM users ;

UPDATE users
SET name = 'Yuvraj Patil' where id = 25; 

UPDATE users SET role='store_owner' WHERE email = 'yuvrajpatil12092004@gmail.com';
