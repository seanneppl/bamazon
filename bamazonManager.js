// __________________IMPORTANT__________CHANGE PARSE INT TO PARSE FLOAT OR CHANGE PRICE OF ITEMS TO WHOLE INTEGERS ONLY______________ toFixed(2);


const mysql = require("mysql");

var inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

// initial connection to database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        menu();
    });
});

var menu = function () {
    inquirer.prompt([
        {
            type: "list",
            message: "Manager View Options",
            choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "menuChoice"
        }
    ]).then(function (response) {

        switch (response.menuChoice) {

            case "View Products For Sale":
                display();
                break;

            case "View Low Inventory":
                var where = "WHERE stock_quantity <= 5";
                display(where);
                break;

            case "Add to Inventory":
                choose();
                break;

            case "Add New Product":
                createProduct()
                break;

            case "Quit":

                console.log("Sorry to see you go, come again soon.");
                connection.end();
                break;
        }
    });
};


var display = function (where = "") {
    var choices = [];

    // the connection query pushes the name of each item into the inquirer choices selection
    connection.query("SELECT * FROM products " + where, function (err, res) {
        if (err) throw err;

        if(res.length === 0){
            console.log("No low stock items!");
            menu();
           
        }
        else{


        res.forEach(each => {
            // if (each.stock_quantity > 0) {
            choices.push("id " + each.item_id.toString() + ": " + each.product_name + "  -  $" + each.price.toString() + " (" + each.stock_quantity + ")");
            // };
        });

        inquirer.prompt([
            {
                type: "list",
                message: "Products List: Click Enter to continue.",
                //placeholder choices, pull from db
                choices: choices,
                name: "chooseBidItem"
            }

        ]).then(function (result) {
            menu();
        });
    }
    });
}


var choose = function () {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                message: "What item would you like to add inventory to? Please type the item's id number to select.",
                //placeholder choices, pull from db
                name: "ItemID"
            }
            
        ]).then(function (result) {


            if ((result.ItemID <= res.length) && (typeof +result.ItemID === "number") && (+result.ItemID !== 0)) {

            var chosenItem;
            var itemIndex;

            for (var i = 0; i < res.length; i++) {

                if (parseInt(res[i].item_id) === parseInt(result.ItemID)) {
                    chosenItem = res[i].product_name;
                    itemIndex = i;
                }
                // console.log(res[i].item_id);
                // console.log(result.ItemID);
            }

            if (chosenItem === undefined) {
                console.log("Sorry, please select an existing item or add a new one."); choose();
            }
            else { howMany(itemIndex); }
            // console.log("chosen ", chosenItem, "chosenIndex", itemIndex);
            // console.log("result", result.ItemID);
            } else {
                console.log("Please choose an item currently for sale.");
                choose();
            }
        });

    });

};


var howMany = function (item) {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                message: "How many would you like to add to inventory?",
                name: "Quantity"
            }
        ]).then(function (result) {

            var newTotal = parseInt(res[item].stock_quantity) + parseInt(result.Quantity);


            inquirer.prompt([
                {
                    type: "confirm",
                    message: `Would you like to add ${result.Quantity} stock to ${res[item].product_name}? New total: ${newTotal}. Confirm stock update?`,
                    name: "AddQuantity"
                }
            ]).then(function (result) {


                if (result.AddQuantity) {

                    console.log("Thank you. Stock updated!");

                    // it triggers a connection query to reset your choices price
                    var query = connection.query(
                        `UPDATE products SET stock_quantity = '${newTotal}' WHERE item_id = '${res[item].item_id}'`,
                        function (err, res) {
                            if (err) throw err;
                            // console.log("update response", res);
                            menu();
                        }
                    );
                }

                else {
                    howMany(item);
                }

            });
        });
    });
}



function createProduct() {
    // INSERT INTO products(product_name, department_name, price, stock_quantity)
    inquirer.prompt([
        {
            type: "input",
            message: "Product Name?",
            name: "ProductName"
        },
        {
            type: "input",
            message: "Department Name?",
            name: "DepartmentName"
        },
        {
            type: "input",
            message: "Price?",
            name: "Price"
        },
        {
            type: "input",
            message: "Quantity?",
            //placeholder choices, pull from db
            name: "Quantity"
        }

    ]).then(function (result) {

        var productName = result.ProductName;
        var departmentName = result.DepartmentName;
        var price = result.Price;
        var stockQuantity = result.Quantity;

        inquirer.prompt([
            {
                type: "confirm",
                message: `Would you like to add ${stockQuantity}, ${productName} for $${price} each? Confirm new product?`,
                //placeholder choices, pull from db
                name: "ConfirmNewProduct"
            }

        ]).then(function (result) {

            if (result.ConfirmNewProduct){

            // console.log(result);

            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: productName,
                    department_name: departmentName,
                    price: price,
                    stock_quantity: stockQuantity

                },
                function (err, res) {
                    console.log(`New Product ${result.ProductName} added!`);
                    menu();
                }
            );

            } else {menu();};

        });
    });
}