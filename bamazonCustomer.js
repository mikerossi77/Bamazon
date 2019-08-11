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
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();

    inquirer.prompt([

        {
            type: "input",
            name: "myProduct",
            message: "What product can I get for you?"
        },
        {
            type: "input",
            name: "howMany",
            message: "How many would you like to order?"
        }

    ]).then(function (answer) {
        console.log("Product Number: " + answer.myProduct);
        console.log("Quantity: " + answer.howMany);
        var available = getQuantity(answer.myProduct);
        if(Number(answer.howMany) < available) {
            console.log("Sorry pal, we ain't got that many");
        }
    });
});


function createProduct() {
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            flavor: "Rocky Road",
            price: 3.0,
            quantity: 50
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            // Call updateProduct AFTER the INSERT completes
            updateProduct();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function updateProduct() {
    console.log("Updating all Rocky Road quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: 100
            },
            {
                flavor: "Rocky Road"
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            deleteProduct();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function deleteProduct() {
    console.log("Deleting all strawberry icecream...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        {
            flavor: "strawberry"
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products deleted!\n");
            // Call readProducts AFTER the DELETE completes
            readProducts();
        }
    );
}
function getQuantity(id) {
    connection.query("SELECT stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
        res.forEach(function (product) {
            if (product.item_id === id) {
                return product.stock_quantity;
            }
        })
        connection.end();
    });
}


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
        res.forEach(function (product) {
            console.log(product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
            // item_id: 8,
            // product_name: 'Chromebook',
            // department_name: null,
            // price: '200',
            // stock_quantity: 2
        })
        console.log("============")
    });
}
