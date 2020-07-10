CREATE TABLE users(
   id INT AUTO_INCREMENT,
   first_name VARCHAR(100),
   last_name VARCHAR(100),
   position VARCHAR(40),
   PRIMARY KEY(user_id)
);

CREATE TABLE products(
   product_id INT AUTO_INCREMENT,
   product_name VARCHAR(100),   
   price INT,
   PRIMARY KEY(product_id)
);

CREATE TABLE sales(
   month_name VARCHAR(100),
   user_id INT,
   product_id INT,
   amount INT,
   price INT,
   PRIMARY KEY(month_name, user_id, product_id),
   FOREIGN KEY(user_id) references users(id),
   FOREIGN KEY(product_id) references products(product_id)
);

CREATE TABLE totality (
	user_id INT,
    month_name VARCHAR(100),
    karnet_sum INT,
    product_sum INT,
    PRIMARY KEY(user_id, month_name),
    FOREIGN KEY(user_id) references users(id),
    FOREIGN KEY(month_name) references sales(month_name)
);

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM sales;
SELECT * FROM totality;
DROP TABLE sales;


INSERT INTO users (first_name, last_name, position, createdAt, updatedAt) 
values 
('Jacek', 'Atamańczuk', 'leader', now(), now()),
('Aleksander', 'Atamańczuk', 'partner', now(), now()),
('Adam', 'Dyduch', 'customer', now(), now()),
('Barbara', 'Kumur', 'partner', now(), now());

INSERT INTO products (product_name, price, createdAt, updatedAt) 
values 
('Karnet', 225, now(), now()), 
('Karnet_xl', 400, now(), now()), 
('Koktajl_550', 137, now(), now()), 
('Koktajl_triblend', 168, now(), now()),
('Koktajl_780', 173, now(), now()),
('Herbata_50', 92, now(), now()),
('Herbata_100', 150, now(), now());

INSERT INTO sales (month_name, user_id, product_id, amount, price, createdAt, updatedAt) 
values 
('july20', 2, 5, 1, 173, now(), now()),
('july20', 3, 2, 1, 400, now(), now()),
('july20', 3, 6, 1, 92, now(), now()),
('jun20', 1, 1, 2, 300, now(), now()),
('jun20', 5, 7, 1, 150, now(), now()),
('jun20', 5, 3, 2, 220, now(), now());

INSERT INTO sales (month_name, user_id, product_id, price, amount, createdAt, updatedAt)
values
('july20', 1, 1, 173, 2, now(), now()),
('jun20', 1, 3, 300, 2, now(), now()),
('july20', 3, 2, 400, 1, now(), now()),
('july20', 3, 6, 92, 1, now(), now()),
('jun20', 4, 7, 150, 1, now(), now()),
('jun20', 4, 3, 220, 2, now(), now());


SELECT users.first_name,
products.product_name
FROM sales
INNER JOIN users on users.id = sales.user_id
INNER JOIN products on products.product_id = sales.product_id
ORDER BY users.first_name;