// Initialize the npm package mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");
//require("console.table");

// Initialize the connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "0911",
    database: "bamazon"
});

// Connect to the server
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showInventory();
});

// Function to show present inventory in database
function showInventory() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        // Show the table in the terminal
        // console.table(response);
        // Prompt for user to select product
        promptUpdate(response);
    });
}

function promptUpdate(products) {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "\n Hello Manager!  What would you like to do? \n",
        choices: ["View Products for Sale...", "View Low Inventory...", "Add to Inventory...", "Add New Product...", "Remove a Product..."]
    }]).then(function (answers) {

        switch (answers.action) {

            case "View Products for Sale...":
                console.table(products);
                showInventory();
                break;

            case "View Low Inventory...":
                viewLow();
                break;

            case "Add to Inventory...":
                addRequest();
                break;

            case "Add New Product...":
                addNewProduct();
                break;

            case "Remove a Product...":
                deleteProduct();
                break;
        }
    });
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, response) {
        if (err) throw err;
        var quantity = response.stock_quantity;
        if (quantity <= 5) {
            console.table(response);

        } else {
            console.log("\n *******   You have more than 5 of each product in stock... \n");
        }
        showInventory();
    });
}

function addRequest() {
    inquirer.prompt([{
            type: "input",
            name: "ID",
            message: "\n What is the ID of the item you wish to add to? \n",
            validate: function (answer) {
                return !isNaN(answer);
            }
        },
        {
            type: "input",
            name: "Quantity",
            message: "How many of the item would you like to add? \n",
            validate: function (answer) {
                return answer > 0;
            }
        }
    ]).then(function (answers) {
        var quantityAdded = parseInt(answers.Quantity);
        var productID = answers.ID;
        addQuantity(productID, quantityAdded);
    });
}

function addQuantity(ID, Quantity) {
    connection.query("SELECT * FROM products WHERE item_id = " + ID, function (err, response) {
        if (err) throw err;
        if (Quantity > 0) {
            var totalProduct = response[0].stock_quantity + Quantity;
            console.log("\n *******   Successfully added " + Quantity + " of '" + response[0].product + "'.  You now have a total of " + totalProduct + " in stock... \n");
            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [Quantity, ID]);
        }
        showInventory();
    });
}

function addNewProduct() {
    inquirer.prompt([{
            type: "input",
            name: "product",
            message: "What is the name of the product you would like to stock? \n"
        },
        {
            type: "input",
            name: "department",
            message: "In which department should we list this product? \n"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price per product? \n",
            validate: function (answer) {
                return answer > 0;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you want to add to the present stock?",
            validate: function (answer) {
                return !isNaN(answer);
            }
        }
    ]).then(commitNewItem);
}

function commitNewItem(answer) {
    connection.query("INSERT INTO products (product, department, price, stock_quantity) VALUES(?, ?, ?, ?)",
        [answer.product, answer.department, answer.price, answer.quantity],
        function (err, response) {
            if (err) throw err;
            console.log("\n *******   '" + answer.product + "' successfully added to the inventory! \n");
            showInventory();
        }
    );
}

function deleteProduct() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "What is the item ID of the product you wish to remove from inventory... (Not the (index) number)?"
    }]).then(function (answer) {
        var id = answer.ID;
        removeFromInventory(id);
    });
}

function removeFromInventory(id) {
    connection.query("DELETE FROM products WHERE item_id = " + id);
    console.log("\n *******   Item ID number '" + id + "' successfully removed from inventory... \n");
    showInventory();
}