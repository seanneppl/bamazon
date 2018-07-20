const mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require('cli-table');

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
            message: "Customer Selection Menu?",
            choices: ["Display", "Place Order", "Quit"],
            name: "postOrBid"
        }
    ]).then(function (response) {

        if (response.postOrBid == "Display") {
            display();

        }
        else if (response.postOrBid == "Place Order") {
            choose();
        }

        else if (response.postOrBid == "Quit") {

            console.log("Sorry to see you go, come again soon.");
            connection.end();
            return;
        }

    });
};


var display = function () {
    var choices = [];

    // the connection query pushes the name of each item into the inquirer choices selection
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;


        res.forEach(each => {
            // if (each.stock_quantity > 0) {
            choices.push("id " + each.item_id.toString() + ": " + each.product_name + "  -  $" + each.price.toString());
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
            choose();
        });
    });
}


var choose = function () {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                message: "What would you like to order? Please type the item's id number to select.",
                name: "ItemID"
            }
        ]).then(function (result) {

            // console.log(result.ItemID);
            // console.log(typeof result.ItemID);
            // console.log(typeof +result.ItemID !== "number");
            // console.log(result.ItemID > res.length)

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


                if (res[itemIndex].stock_quantity === 0) {
                    console.log("Sorry that item is currently out of stock.");
                    choose();
                }
                else {
                    howMany(itemIndex);
                }

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
        // Log all results of the SELECT statement
        // console.log("select from", res);


        inquirer.prompt([
            {
                type: "input",
                message: "How many " + res[item].product_name + " would you like to order?",
                //placeholder choices, pull from db
                name: "OrderQuantity"
            }
        ]).then(function (result) {

            var newTotal = parseInt(res[item].stock_quantity) - parseInt(result.OrderQuantity);
            var cost = (parseInt(result.OrderQuantity) * parseInt(res[item].price));
            var newCost = parseInt(res[item].product_sales) + cost;
            var id = res[item].item_id;
            // console.log(cost);
            // console.log(newCost);

            inquirer.prompt([
                {
                    type: "confirm",
                    message: "Total cost is $" + cost + ". Confirm purchase?",
                    //placeholder choices, pull from db
                    name: "OrderQuantity"
                }
            ]).then(function (result) {


                if (result.OrderQuantity) {


                    if (newTotal >= 0) {
                        //update db

                        console.log("Thank you. Order succesfully placed!");

                        // it triggers a connection query to reset your choices price
                        var query = connection.query(
                            `UPDATE products SET stock_quantity = '${newTotal}' WHERE item_id = '${id}'`,
                            function (err, res) {
                                if (err) throw err;
                                // console.log("update response", res);


                                connection.query(

                                    `UPDATE products SET product_sales = '${newCost}' WHERE item_id = '${id}'`,
                                    function (err, res) {
                                        if (err) throw err;
                                        // console.log("update response", res);
                                        menu();

                                    }
                                );
                            }
                        );

                    }
                    else {
                        console.log("Insufficient Stock Quanity. Please order a smaller amount."); howMany(item);
                    }
                }
                else {
                    howMany(item);
                }
            });
        });
    });
}

