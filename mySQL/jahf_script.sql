CREATE TABLE users(
   user_id INT AUTO_INCREMENT,
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

CREATE TABLE sale(
   month_name VARCHAR(100),
   user_id INT,
   product_id INT,
   amount INT,
   price INT,
   PRIMARY KEY(month_name, user_id, product_id),
   FOREIGN KEY(user_id) references users(user_id),
   FOREIGN KEY(product_id) references products(product_id)
);

CREATE TABLE totality (
	user_id INT,
    month_name VARCHAR(100),
    karnet_sum INT,
    product_sum INT,
    PRIMARY KEY(user_id, month_name),
    FOREIGN KEY(user_id) references users(user_id),
    FOREIGN KEY(month_name) references sale(month_name)
);

USE jahf;

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM sale;
SELECT * FROM totality;
DROP TABLE sale;


INSERT INTO users (first_name, last_name, position) 
values 
('Jacek', 'Atamańczuk', 'leader'), 
('Aleksander', 'Atamańczuk', 'partner'),
('Adam', 'Dyduch', 'customer'),
('Barbara', 'Kumur', 'partner'),
('Hanna', 'Kapłowska', 'supervisor');

INSERT INTO products (product_name, price) 
values 
('Karnet', 225), 
('Karnet_xl', 400), 
('Koktajl_550', 137), 
('Koktajl_triblend', 168),
('Koktajl_780', 173),
('Herbata_50', 92),
('Herbata_100', 150);

INSERT INTO sale (month_name, user_id, product_id, amount, price) 
values 
('july20', 2, 5, 1, 173),
('july20', 3, 2, 1, 400),
('july20', 3, 6, 1, 92),
('jun20', 1, 1, 2, 300),
('jun20', 5, 7, 1, 150),
('jun20', 5, 3, 2, 220);

ALTER USER 'tengosc'@'localhost' IDENTIFIED WITH mysql_native_password BY 'reja69';
flush privileges;

SELECT users.first_name,
products.product_name
FROM sale
INNER JOIN users on users.user_id = sale.user_id
INNER JOIN products on products.product_id = sale.product_id
ORDER BY users.first_name;

ALTER USER 'root'@'localhost' IDENTIFIED BY 'reja69productsuser_id';

DROP DATABASE nodemysql;

USE nodemysql;

SELECT * FROM posts;
