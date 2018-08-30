# Bamazon 

## Cli customer checkout and inventor management application

Bamazon is an Amazon-like storefront using the command line and MySQL.

A customer (bamazonCustomer.js) can view products for sale and place orders for a certain amount of a given item.
When an order is placed bamazon checks the mySQL database to ensure there is enough product; if there is, the customer
is shown the total cost and to confirm their order and then the database is updated with the correct quantity.

A manager (bamazonManager.js) can view a list of products for sale including inventory, check low stock products, update stock,
and create new items to sell.

A supervisor (bamazonSupervisor.js) can view a table of departments displaying each departments department id,
department name, over head costs, product sales, and total profit (product sale - over head costs).
They can also create new departments, which updates the table.


* Bamazon uses npm inquirer and npm cli-table.


[Working Project Images](https://drive.google.com/drive/folders/1n008tzaPhF99H1a2ZLsle4BqUFEtz6Rk?usp=sharing)
