module.exports=function(array,product){
    var priceAfterDiscount = product.price;
      for(i=0;i<array.length;i++){
        if(array[i].ProductId==product.product_id){
          priceAfterDiscount-=(priceAfterDiscount*array[i].discount_rate)/100
       // finalPrice-= product.price;
        }
    }
    return priceAfterDiscount;
  }