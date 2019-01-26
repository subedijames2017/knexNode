const express = require('express');
const app = express();
const mysql = require('mysql');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const products = require('./routes/products')
const session = require('express-session');
var RedisStore = require('connect-redis')(session);
const redis = require('redis').createClient();
const getDiscount =require('./utils/getDiscount');

//making the port to listen
const port =process.env.PORT||3000
//methode override
app.use(methodOverride('_method'))
//body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//setting viewing engine
//app.engine('pug', pug({extname: 'pug', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//initializing the session
app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new RedisStore({ host: 'localhost', port: 3000, client: redis,ttl :  260}),
  saveUninitialized: false,
  resave: false
}));

//setting static folder
app.use(express.static(path.join(__dirname)))
//applying session variable to the server
app.use(function(req, res, next) {
  res.locals.session = req.session;
  app.locals.map = getDiscount
  next();
});
app.use('/',products)

app.listen(port,()=>{
  console.log(`listning to the port ${port}`)
})


