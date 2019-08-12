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
    readProducts();
});


function updateQuantity(itemId, quantity, howMany, price) {
    newQuantity = quantity-howMany;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: [newQuantity]
            },
            {
                item_id: [itemId]
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Product(s) Ordered!\n");
            console.log("Your purchase total is:  " + quantity * price);
        }
    );

    connection.end();
}


function getQuantity(id) {
    var myQuantity = 0;
    connection.query("SELECT item_id, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(function (product) {
            if (product.item_id == id) {
                console.log(product.item_id);
                myQuantity = product.stock_quantity;
                console.log("myQuantity is:  " + product.stock_quantity)
            }
        })
        connection.end();
        console.log("Now myQuantity is:  " + myQuantity);
        return myQuantity;
    });
    console.log("Now myQuantity is:  " + myQuantity);

}


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
        res.forEach(function (product) {
            console.log("Item Number: " + product.item_id + ", " + product.product_name + ", Price: $" + product.price + ",  Quantity: " + product.stock_quantity);
            // item_id: 8,
            // product_name: 'Chromebook',
            // department_name: null,
            // price: '200',
            // stock_quantity: 2
        })
        console.log("============")
        getOrder();
    });
}

function getOrder() {
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
        var myQuantity = 0;
        var id = answer.myProduct;
        var price = 0;
        connection.query("SELECT item_id, stock_quantity, price FROM products", function (err, res) {
            if (err) throw err;
            res.forEach(function (product) {
                if (product.item_id == id) {
                    myQuantity = product.stock_quantity;
                    price = product.price;
                }
            })

            var available = myQuantity;
            if (Number(answer.howMany) > available) {
                console.log("Sorry pal, we ain't got that many");
            }
            else {
                updateQuantity(answer.myProduct, Number(myQuantity), answer.howMany, price);
            }
            
        });
    });
}
