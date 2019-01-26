const mysql = require('mysql');
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'knix_learning'
    }
  });
  module.exports = knex;