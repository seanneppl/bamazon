// __________________IMPORTANT__________CHANGE PARSE INT TO PARSE FLOAT OR CHANGE PRICE OF ITEMS TO WHOLE INTEGERS ONLY______________ toFixed(2);


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
            message: "Manager View Options",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"],
            name: "menuChoice"
        }
    ]).then(function (response) {

        switch (response.menuChoice) {

            case "View Product Sales by Department":
                // console.log("Choice 1");
                display();
                break;

            case "Create New Department":
                // console.log("Choice 2");
                createDept();
                break;

            case "Quit":

                console.log("Sorry to see you go, come again soon.");
                connection.end();
                break;
        }
    });
};


var display = function () {

    var selection = "SELECT department_id, products.department_name, over_head_costs, SUM(product_sales) AS product_sales,";
    selection += " SUM(product_sales) - over_head_costs AS total_profit";
    selection += " FROM products JOIN departments";
    selection += " ON products.department_name = departments.department_name";
    selection += " GROUP BY department_name;";

    // the connection query pushes the name of each item into the inquirer choices selection
    connection.query(selection, function (err, res) {
        if (err) throw err;
        // console.log(res);

        var table = new Table({
            head: ['department_id', 'department_name','over_head_costs','product_sales','total_profit']
            // , colWidths: [100, 200]
        });
      
        res.forEach(each => {
                var tableRow = [];
                for (property in each){
                    tableRow.push(each[property]);
                }
                table.push(tableRow);  
        });

        console.log(table.toString());

        menu();
    });
}

function createDept() {
    // INSERT INTO departments(department_name, over_head_cost)
    inquirer.prompt([
        {
            type: "input",
            message: "Department Name?",
            name: "DepartmentName"
        },
        {
            type: "input",
            message: "Over Head Cost?",
            name: "OverHead"
        }
    ]).then(function (result) {

        var departmentName = result.DepartmentName;
        var overHead = result.OverHead;

        inquirer.prompt([
            {
                type: "confirm",
                message: `Would you like to add ${departmentName} with an over head cost of $${overHead}? Confirm new department?`,
                name: "ConfirmNewDepartment"
            }

        ]).then(function (result) {

            if (result.ConfirmNewDepartment) {
                // console.log(result);
                var newQuery = connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: departmentName,
                        over_head_costs: overHead,
                        
                    },
                    function (err, res) {
                        if(err) throw err;
                        // console.log(res);
                        // console.log(newQuery.sql);
                        console.log(`New Department ${departmentName} added!`);
                        menu();
                    }
                );

            } else { menu(); };

        });
    });
}