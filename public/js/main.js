$(document).ready(function(argument){
    $("#catogory_error").hide();
    $("#title_error").hide();
    $("#type_error").hide();
    $("#name_error").hide();
    $("#description_error").hide();
    $("#price_error").hide();

    var error_catogory = false;
    var error_title = false;
    var error_type = false;
    var error_name = false;
    var error_description = false;
    var error_price = false;

     $("#form_catogory").focusout(function(){
      check_catogory();
      });
      $("#form_title").focusout(function(){
      check_title();
      });
      $("#form_type").focusout(function(){
      check_type();
      });
      $("#form_name").focusout(function(){
      check_name();
      });
      $("#form_description").focusout(function(){
      check_description();
      });
      $("#form_price").focusout(function(){
      check_price();
      });

      function check_catogory(){
          var pattern = /^[a-zA-Z]*$/;
          var catogory = $("#form_catogory").val()
          if (pattern.test(catogory) && catogory !==''){
          $("#catogory_error").hide();
          $("#form_catogory").css("border-bottom","2px solid #34F458");
          } else {
          $("#catogory_error").html("should contain only alphabatic");
          $("#catogory_error").show();
          $("#catogory_error").css("color","red");
          $("#form_catogory").css("border-bottom","2px solid red");
          error_catogory = true;
          }
          }
          function check_title(){
          var pattern = /^[a-zA-Z]*$/;
          var title = $("#form_title").val()
          if (pattern.test(title) && title !==''){
          $("#title_error").hide();
          $("#form_title").css("border-bottom","2px solid #34F458");
          } else {
          $("#title_error").html("should contain only alphabatic");
          $("#title_error").show();
          $("#title_error").css("color","red");
          $("#form_title").css("border-bottom","2px solid red");
          error_title = true;
          }
          }
          function check_type(){
          var pattern = /^[a-zA-Z]*$/;
          var type = $("#form_type").val()
          if (pattern.test(type) && type !==''){
          $("#type_error").hide();
          $("#form_type").css("border-bottom","2px solid #34F458");
          } else {
          $("#type_error").html("should contain only alphabatic");
          $("#type_error").show();
          $("#type_error").css("color","red");
          $("#form_type").css("border-bottom","2px solid red");
          error_type = true;
          }
          }
          function check_name(){
          var pattern = /^[a-zA-Z]*$/;
          var name = $("#form_name").val()
          if (pattern.test(name) && name !==''){
          $("#name_error").hide();
          $("#form_name").css("border-bottom","2px solid #34F458");
          } else {
          $("#name_error").html("should contain only alphabatic");
          $("#name_error").show();
          $("#name_error").css("color","red");
          $("#form_name").css("border-bottom","2px solid red");
          error_name = true;
          }
          }
          function check_description(){
          var description = $("#form_description").val()
          description=description.replace(/\s/g, '');
          if (description !==''){
          $("#description_error").hide();
          $("#form_description").css("border-bottom","2px solid #34F458");
          } else {
          $("#description_error").html("should not be empty");
          $("#description_error").show();
          $("#description_error").css("color","red");
          $("#form_description").css("border-bottom","2px solid red");
          error_description = true;
          }
          }
          function check_price(){
          var pattern = /^[0-9]*$/;
          var price = $("#form_price").val()
          if (pattern.test(price) && price !==''){
          $("#price_error").hide();
          $("#form_price").css("border-bottom","2px solid #34F458");
          } else {
          $("#price_error").html("should contain only number");
          $("#price_error").show();
          $("#price_error").css("color","red");
          $("#form_price").css("border-bottom","2px solid red");
          error_price = true;
          }
          }
          $("#add-product").submit(function(){
             error_catogory = false;
             error_title = false;
             error_type = false;
             error_name = false;
             error_description = false;
             error_price = false;
           
             check_catogory();
             check_type();
             check_title();
             check_name();
             check_description();
             check_price();
           if (error_catogory === false && error_title === false && error_title === false && error_type === false && error_name === false && error_description === false && error_price === false) {
                alert ("registration successfull")
                return true;
                }
                else {
                alert("Please fill the form correctly")
                return false;
                }

          })

   })