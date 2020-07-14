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
  userId INT,
  productId INT,
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

SELECT * FROM0 users;
SELECT * FROM products;
SELECT * FROM sales;
SELECT * FROM totality;
DROP TABLE sales;

INSERT INTO
  users ( first_name, last_name, position, createdAt, updatedAt )
values
  ('Jacek', 'Atamańczuk', 'leader', now(), now()),
  ('Aleksander', 'Atamańczuk', 'partner', now(), now()),
  ('Adam', 'Dyduch', 'starszy', now(), now()),
  ('Barbara', 'Kumur', 'partner', now(), now()),
  ('Hanna', 'Kapłanowska', 'supervisor', now(), now());

INSERT INTO
  products (product_name, price, createdAt, updatedAt)
values
  ('Karnet', 225, now(), now()),
  ('Karnet_xl', 400, now(), now()),
  ('Koktajl_550', 137, now(), now()),
  ('Koktajl_triblend', 168, now(), now()),
  ('Koktajl_780', 173, now(), now()),
  ('Herbata_50', 92, now(), now()),
  ('Herbata_100', 150, now(), now());

INSERT INTO
  sales ( month_name, month_year, userId, productId,
         price, amount, createdAt, updatedAt)
values
  ('Lipiec', 2020, 1, 1, 173, 1, now(), now()),
  ('Lipiec', 2020, 2, 1, 0, 0, now(), now()),
  ('Lipiec', 2020, 3, 3, 400, 1, now(), now()),
  ('Lipiec', 2020, 3, 2, 92, 2, now(), now()),
  ('Lipiec', 2020, 4, 1, 0, 0, now(), now()),
  ('Lipiec', 2020, 5, 1, 0, 0, now(), now()),
  ('Czerwiec', 2020, 1, 1, 300, 2, now(), now()),
  ('Czerwiec', 2020, 2, 1, 0, 0, now(), now()),
  ('Czerwiec', 2020, 3, 1, 0, 0, now(), now()),
  ('Czerwiec', 2020, 4, 1, 0, 0, now(), now()),
  ('Czerwiec', 2020, 5, 1, 0, 0, now(), now()),
  ('Maj', 2020, 1, 1, 0, 0, now(), now()),
  ('Maj', 2020, 2, 1, 0, 0, now(), now()),
  ('Maj', 2020, 3, 1, 0, 0, now(), now()),
  ('Maj', 2020, 4, 4, 100, 1, now(), now()),
  ('Maj', 2020, 5, 1, 0, 0, now(), now()),
  ('Kwiecień', 2020, 1, 1, 0, 0, now(), now()),
  ('Kwiecień', 2020, 2, 6, 209, 3, now(), now()),
  ('Kwiecień', 2020, 3, 1, 0, 0, now(), now()),
  ('Kwiecień', 2020, 4, 1, 0, 0, now(), now()),
  ('Kwiecień', 2020, 5, 1, 0, 0, now(), now());
INSERT INTO
  months (month_name, month_year, userId, total_product, createdAt, updatedAt)
values
  ('Lipiec', 2020, 1, 173, now(), now()),
  ('Lipiec', 2020, 2, 0, now(), now()),
  ('Lipiec', 2020, 3, 492, now(), now()),
  ('Lipiec', 2020, 4, 0, now(), now()),
  ('Lipiec', 2020, 5, 0, now(), now()),
  ('Czerwiec', 2020, 1, 300, now(), now()),
  ('Czerwiec', 2020, 2, 0, now(), now()),
  ('Czerwiec', 2020, 3, 0, now(), now()),
  ('Czerwiec', 2020, 4, 0, now(), now()),
  ('Czerwiec', 2020, 5, 0, now(), now()),
  ('Maj', 2020, 1, 0, now(), now()),
  ('Maj', 2020, 2, 0, now(), now()),
  ('Maj', 2020, 3, 0, now(), now()),
  ('Maj', 2020, 4, 100, now(), now()),
  ('Maj', 2020, 5, 0, now(), now()),
  ('Kwiecień', 2020, 1, 0, now(), now()),
  ('Kwiecień', 2020, 2, 209, now(), now()),
  ('Kwiecień', 2020, 3, 0, now(), now()),
  ('Kwiecień', 2020, 4, 0, now(), now()),
  ('Kwiecień', 2020, 5, 0, now(), now());

SELECT
  users.first_name,
  products.product_name,
  sales.price,
  sales.total
FROM
  sales
  JOIN users on users.id = sales.userId
  JOIN products on products.id = sales.productId
WHERE users.first_name = 'Adam'
ORDER BY users.first_name;

SELECT SUM(price)
FROM sales
WHERE month_name = 'july20' AND userId = 3;

SELECT
  users.first_name,
  users.last_name,
  months.month_name,
  months.total_product
FROM users
LEFT JOIN months on months.userId = users.id
ORDER BY users.first_name, months.month_name;

CREATE TABLE IF NOT EXISTS `months` (
    `month_name` VARCHAR(255),
    `month_year` INTEGER,
    `userId` INTEGER,
    `total_product` INTEGER ,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`month_name`, `month_year`, `userId`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB;

  DROP TABLE IF EXISTS display;

CREATE TABLE IF NOT EXISTS display (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    position_name VARCHAR (255),
    total_product_1 INTEGER,
    total_product_2 INTEGER,
    total_product_3 INTEGER,
    PRIMARY KEY (id)
  ) ENGINE = InnoDB;