-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  Products Table Schema


-- CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
-- item_id (unique id for each product)
item_id int NOT NULL AUTO_INCREMENT,

-- product_name (Name of product)
product_name VARCHAR(255) NOT NULL,

-- department_name
department_name VARCHAR(255),

-- price (cost to customer)
price DECIMAL(7,2),

-- stock_quantity (how much of the product is available in stores)
stock_quantity int,

PRIMARY KEY(item_id)
);

-- DROP TABLE products;

ALTER TABLE products
ADD COLUMN product_sales int NOT NULL;



-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  Products Table Inserts

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales)
VALUES ( "Game Boy", "Electronics", "100", "100", "10000");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Game Boy Color", "Electronics", "90", "100", "1800");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Game Boy Advanced", "Electronics", "80", "100", "480");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Snickers Bar", "Food", "2", "100", "20034");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "The Bible", "Books", "30", "100", "3000");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Light Up Sneakers", "Shoes", "50", "100", "200");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Game Boy Micro", "Electronics", "40", "100","800");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Harry Potter", "Books", "30", "100", "30000");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Roller Shoes", "Shoes", "80", "100", "160");

INSERT INTO products ( product_name, department_name, price, stock_quantity, product_sales )
VALUES ( "Ice Skates", "Shoes", "40", "100", "160");




-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  Products Table selections

-- select all
SELECT * FROM products;

-- select stock quantity less than five for bamazonManager.js
SELECT * FROM products
WHERE stock_quantity < 5;


-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  departments table Schema



USE bamazonDB;

CREATE TABLE departments(
-- department_id
department_id int NOT NULL AUTO_INCREMENT,

-- product_name (Name of product)
department_name VARCHAR(255) NOT NULL,

-- over_head_costs (A dummy number you set for each department)
over_head_costs int,

PRIMARY KEY(department_id)
);

-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  departments table inserts

INSERT INTO departments ( department_name, over_head_costs )
VALUES ( "Shoes" , 10000);

INSERT INTO departments ( department_name, over_head_costs )
VALUES ( "Electronics" , 50000);



-- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- --  -- -- -- -- -- -- -- products join on departments selection

-- selection for bamazonSupervisor.js
SELECT department_id, products.department_name, over_head_costs, SUM(product_sales) AS product_sales,
SUM(product_sales) - over_head_costs AS total_profit
FROM products
JOIN departments
ON products.department_name=departments.department_name
GROUP BY department_name;