const express = require('express');
const knex = require('../db/knex');
const router = express.Router();
const multer = require('multer');
const Cart = require('../cart/cart');

///seting the upload critaria
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

//joining of the catogories
router.get('/product/:id',(req,res)=>{
  knex('products')
  .leftJoin('productsdiscounts','products.product_id','productsdiscounts.ProductId')
  .leftJoin('discounts','productsdiscounts.DiscountId','discounts.id')
  .where('products.product_id',req.params.id)
  .then((result)=>{
    const discounts =[];
    for(var i=0;i<result.length;i++){
      let object={discount:result[i].discount_rate,
        startdate:result[i].start_date,
        enddate:result[i].end_date}
     discounts.push( object)
    }
    knex('products')
    .where('product_id',req.params.id)
    .then((product)=>{
      res.render('product',{
        product
      })
    })
  })
})
//home route
router.get('/',(req,res)=>{
  knex.from('products').join('catogories', 'products.catogory_id', 'catogories.id')
  .select('*')
  .then((products)=>{
   knex('catogories')
   .select('catogory_name')
   .then((catogories)=>{
    let  catogoryArray=[]
    for(var i=0;i<catogories.length;i++){
      catogoryArray.push(catogories[i].catogory_name)
    }
    knex.from('discounts')
    .innerJoin('productsdiscounts','discounts.id', 'productsdiscounts.DiscountId')
    .select('*')
    .then((discounts)=>{
      const q = new Date();
      const m = q.getMonth();
      const d = q.getDate();
      const y = q.getFullYear();
      const date = new Date(y,m,d); 
      var discountArray=[];
      if(discounts.length>0){
        for(var i=0;i<discounts.length;i++){
          if(discounts[i].end_date>date){
            discountArray.push(discounts[i])
          }
        }
      } 
      res.render('index',{
        products,
        catogoryArray,
        discountArray
      })
    })
   })
  })
  });

 //add products
router.post('/add/catogory',(req,res)=>{
  const data = {catogory_name:req.body.catogory}
  knex.insert(data).into('catogories').then((catogory)=>{
    console.log('add catogory successfull')
    return res.json(catogory)
  })
  .catch(err=>console.log(err))
})
//add discount
router.post('/add/discount/:id',(req,res)=>{
  console.log(req.params.id)
  const data = {
    discount_rate:req.body.discount,
    start_date:req.body.startdate,
    end_date:req.body.enddate
  }
  console.log(data)
  knex.insert(data).into('discounts').then((discount)=>{
    const dataField ={
      ProductId:req.params.id,
      DiscountId:discount[0]
    }
    knex('productsdiscounts')
    .insert(dataField)
    .then((response)=>{
      res.redirect('/')
    })
  })
  .catch(err=>console.log(err))
}) 
//get post view
router.get('/add',(req,res)=>{
    res.render('addproduct')
})
//Post the product
router.post('/add',(req,res)=>{
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
        knex('catogories')
        .select('id')
        .where('catogory_name',req.body.catogory)
        .then((catogoryid)=>{
          const data = {
            catogory_id:catogoryid[0].id,
            type:req.body.type,
            title:req.body.title,
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            image:req.file.path
          }
          knex('products')
          .insert(data)
          .then((result)=>{
            res.redirect('/')
          })
        })
      }
    }
  })
})
//update get
router.get('/update/:id',(req,res)=>{
  console.log(req.params.id)
  knex.table('products')
  .innerJoin('catogories','catogories.id','products.catogory_id')
  .where('products.id',req.params.id)
  .then((product)=>{
    console.log(product)
   res.render('editproduct',{
     product
   })
  })
})
//update product
router.post('/update/:id',(req,res)=>{
  const errors = {}
  knex.table('products')
  .innerJoin('catogories','catogories.id','products.catogory_id')
  .where('products.product_id',req.params.id)
  .then((result)=>{
    if(!result[0]){
      errors.product ="product not found"
      return res.json(errors)
    }
    var update1;
    if(req.body.price == result[0].price){
      update1={
        type:req.body.type,
        title:req.body.title,
        name:req.body.name,
        description:req.body.description,
        price:req.body.price
      }
    }
      update1={
        type:req.body.type,
        title:req.body.title,
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        previousPrice:result[0].price
      }
    knex('products')
    .where('id',req.params.id)
    .update(update1).then((updates)=>{
       if(!updates){
         errors.product ="Product not updated"
         return res.json(errors)
       }
       if(req.body.catogory_name!==result[0].catogory_name){
         knex('catogories')
         .where('catogory_name',req.body.catogory_name)
         .select('id')
         .then((id)=>{
           knex('catogoryproducts')
          .where({
             CatogoryId:result[0].CatogoryId,
            ProductId:result[0].ProductId
          })
          .update({
            CatogoryId:id[0].id,
            ProductId:result[0].ProductId
          })
          .then((updated)=>{
            return res.json(updated);
          })
        })
      }else{
      console.log("update successfull");
      return res.json(updates)
      }
    })
  })
  .catch(err=>console.log(err))
})
//delete product
router.delete('/delete/:id',(req,res)=>{
  const errors = {}
  knex('products')
  .innerJoin('catogoryproducts','products.id','catogoryproducts.ProductId')
  .innerJoin('catogories','catogoryproducts.CatogoryId','catogories.id')
  .innerJoin('discounts','catogoryproducts.DiscountId','discounts.id')
  .where('products.id',req.params.id)
  .then((result)=>{
    if(!result[0]){
      errors.product ="product not found"
      return res.json(errors)
    }
    knex('products').where('id',req.params.id)
   .del().then((count)=>{
     knex('catogoryproducts')
     .where({
      CatogoryId:result[0].CatogoryId,
      ProductId:result[0].CatogoryId
     })
     .del()
     .then((count)=>{
       console.log("delete successfull")
       return res.json(count)
     })
   })    
  })
  .catch(err=>console.log(err))
})
//get by catogory
router.get('/get-by/:catogory',(req,res)=>{
  const errors ={}
 knex('products')
 .innerJoin('catogoryproducts','products.id','catogoryproducts.ProductId')
 .innerJoin('catogories','catogoryproducts.CatogoryId','catogories.id')
 .innerJoin('discounts','catogoryproducts.DiscountId','discounts.id')
 .where('catogory_name',req.params.catogory)
 .then((products)=>{
   if(!products[0]){
     errors.product = "No Product found"
     return res.status(400).json(errors)
   }
   return res.json(products)
 })
})
 //add to cart
 router.get('/add-to-cart/:id',(req, res)=> {
  var cart = new Cart(req.session.cart ? req.session.cart.items : {});
  knex('products')
  .innerJoin('catogoryproducts','products.id','catogoryproducts.ProductId')
  .innerJoin('catogories','catogoryproducts.CatogoryId','catogories.id')
  .innerJoin('discounts','catogoryproducts.DiscountId','discounts.id')
  .where('products.id',req.params.id).then((product)=>{
    cart.add(product[0],product[0].id)
    req.session.cart = cart;
    res.redirect('/');
  })
});
router.get('/get/cart/',(req,res)=>{
  if (!req.session.cart||req.session.cart.totalPrice==0) {
    return res.render('cart', {products: null});
}
var cart = new Cart(req.session.cart.items);
res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty:cart.totalQty});
})
//reduce cart
router.get('/reduce/cart/:id',(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart.items : {});
  const id = req.params.id;
  cart.reduceByOne(id);
  req.session.cart = cart;
  res.redirect('/get/cart/')
})
//remove all the cart
router.get('/remove/cart/:id',(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart.items : {});
  const id = req.params.id;
  cart.removeItem(id);
  req.session.cart = cart;
  res.redirect('/get/cart/')
})
//increse car by the given number
router.post('/increase/cart/:id',(req,res)=>{
  const ammount = req.body.ammount;
   var cart = new Cart(req.session.cart ? req.session.cart.items : {});
   const id = req.params.id;
   cart.totalQty = 0;
   cart.increseBy(id,ammount)
        for (var i in cart.items) {
          cart.totalQty+=parseInt(cart.items[i].qty)
        }
   req.session.cart = cart;
   res.redirect('/get/cart/')
})
module.exports = router;