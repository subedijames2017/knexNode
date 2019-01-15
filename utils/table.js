const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "knix_learning"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database");
    let sql = 'CREATE TABLE IF NOT EXISTS products (id int primary key auto_increment, catogory VARCHAR(255), type VARCHAR(255), title VARCHAR(255), name VARCHAR(255), description VARCHAR(1000), price DECIMAL(12, 2),image VARCHAR(255))'
    connection.query(sql,(err,result)=>{
        if(err) throw err
        console.log("table created")
        console.log(result);
    })
});