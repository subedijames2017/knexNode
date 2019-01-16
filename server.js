const express = require('express');
const app = express();
const mysql = require('mysql');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const methodOverride = require('method-override');

//seting the upload critaria
var uploadFnct = function(){
  var storage = multer.diskStorage({ 
      //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './public/uploads/');
      },
      filename: function (req, file, cb) {
          var datetimestamp = Date.now();
          cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname);
      }
  });
  //achieving the file filter
  const fileFilter = (req, file, cb) => {
      // reject a file
      
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(null, false);
      }
  };
  //uploadinig storage andcritaria
  var upload = multer({
       storage: storage,
      fileFilter:fileFilter
  }).single('image');

  return upload;
};
//making the port to listen
const port =process.env.PORT||3000
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'knix_learning'
  }
});
//methode override
app.use(methodOverride('_method'))
//body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('image');

//setting viewing engine
//app.engine('pug', pug({extname: 'pug', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//setting static folder
app.use(express.static(path.join(__dirname)))

//home route
app.get('/',(req,res)=>{
  knex.select().table('products').then((products)=>{
    const catogories = products.map((products)=>products.catogory);
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }
  var uniqueCatogory = catogories.filter( onlyUnique ).sort();
  console.log(uniqueCatogory)
  res.render('index',{
    products,
    uniqueCatogory
  })
  })
});
//get add product form
app.get('/add',(req,res)=>{
  res.render('addproduct')
})
//add products
app.post('/add',(req,res)=>{
  const currentUpload = uploadFnct();
  currentUpload(req,res,(err)=>{
    if(err){
      console.log(err)
      res.redirect('/')
    }else{
      if(req.file==undefined){
        console.log("undefined image")
      res.redirect('/')
      }else{
        const data = {catogory:`${req.body.catogory}`,type:`${req.body.type}`,title:`${req.body.title}`,name:`${req.body.name}`,price:`${req.body.price}`,description:`${req.body.description}`,image:`${req.file.path}`}
        knex.insert(data).into('products').then((id)=>{
          console.log(id)
          res.redirect('/')
          console.log("inserted a data")
        })
      }
    }
  })
})
//get by catogory
app.get('/:catogory',(req,res)=>{
  knex.select().table('products').then((products)=>{
    const catogories = products.map((products)=>products.catogory);
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }
  var uniqueCatogory = catogories.filter( onlyUnique ).sort();
  knex('products').where('catogory',req.params.catogory).then((products)=>{
    res.render('product',{
      products,
      uniqueCatogory
    })
  })
  })
  .catch(err=>console.log(err))
})
app.get('/edit/:id',(req,res)=>{
  knex('products').where('id',req.params.id).then((product)=>{
    res.render('editproduct',{
      product:product
    })
  })
  .catch(err=>console.log(err));
})
//edit the product
app.post('/edit/:id',(req,res)=>{
  const update1={catogory:`${req.body.catogory}`,type:`${req.body.type}`,title:`${req.body.title}`,name:`${req.body.name}`,description:`${req.body.description}`,price:`${req.body.price}`}
   knex('products').where('id',req.params.id)
   .update(update1).then((count)=>{
     console.log(count)
     res.redirect('/')
   }).catch(err=>console.log(err))
 })
 //delete the produt
 app.delete('/delete/:id',(req,res)=>{
   knex('products').where('id',req.params.id)
   .del().then((count)=>{
     res.redirect('/')
    console.log(count)
   })
 })
app.listen(port,()=>{
  console.log(`listning to the port ${port}`)
})


