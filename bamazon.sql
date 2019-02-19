DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("Blade Runner 2049", "Movies & TV", 29.99, 200),
		("The Big Short", "Movies & TV", 19.99, 100),
        ("The Pioneers", "Books", 17.96, 500),
        ("John Adams", "Books", 15.86, 500),
        ("NIN, The Fragile", "Music", 17.71, 900),
        ("Xylitol Sweetener, 1 lb", "Grocery", 11.16, 300),
        ("Planters Mixed Nuts, 16oz", "Grocery", 9.78, 450),
        ("Victure Trail Game Camera 1080P", "Hunting & Fishing", 49.99, 50),
        ("Titleist Pro V1 Golf Balls, One Dozen", "Sports", 47.99, 250),
        ("Bushnell Pro X2 Golf Laser Rangefinder", "Sports", 514.93, 25)
        
        
        
        
        