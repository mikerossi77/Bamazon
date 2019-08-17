var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    inquirer.prompt([

        {
            type: "list",
            name: "doWhat",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }

    ]).then(function (answer) {
        if (answer.doWhat === "View Products for Sale") {
            listProducts();
        }
        else if (answer.doWhat === "View Low Inventory") {
            viewLowInventory();
        }
        else if (answer.doWhat === "Add to Inventory") {
            addToInventory();
        }
        else if (answer.doWhat === "Add New Product") {
            addNewProduct();
        }
    });
});

function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (product) {
            console.log("Item Number: " + product.item_id + ", " + product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
        })
        console.log("============")
        connection.end();
    });
}

function viewLowInventory() {
    console.log("============")
    console.log("The products below have inventory below 5");
    console.log("============")
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (product) {
            if (product.stock_quantity < 5) {
                console.log("Item Number: " + product.item_id + ", " + product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
            }
        })
        console.log("============")
        connection.end();
    });
}

function addToInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (product) {
            console.log("Item Number: " + product.item_id + ", " + product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
        })
        console.log("============")
        inquirer.prompt([

            {
                type: "input",
                message: "Enter the Id of the product you would like to add inventory to",
                name: "selectedProduct"
            }

        ]).then(function (answer) {
            updateQuantity(answer.selectedProduct);
        });
    });
}

function updateQuantity(itemId) {
    numItemId = Number(itemId);
    var newQuery = connection.query(
        "UPDATE products SET stock_quantity = (stock_quantity + 1) WHERE ?",
        [
            {
            item_id: [itemId]
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Product Updated!\n");   
        }

    );

    connection.end();
}

function addNewProduct() {
    console.log("in AddnewProduct");
    inquirer
        .prompt([
            {
                type: "input",
                message: "Product Name?",
                name: "productName"
            },
            {
                type: "input",
                message: "Department Name?",
                name: "departmentName"
            },
            {
                type: "input",
                message: "Price?",
                name: "price"
            },
            {
                type: "input",
                message: "Quantity?",
                name: "quantity"
            }
        ])
        .then(function (answer) {
            var newQuery = connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                [answer.productName, answer.departmentName, answer.price, answer.quantity],
                function (err, res) {
                    if (err) throw err;
                    console.log(answer.productName + " has been created\n");
                }
            );
            connection.end();
        });
};