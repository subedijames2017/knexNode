var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "knix_learning"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE knix_learning", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });