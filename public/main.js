
$(document).ready(() => {

  $('#meal-button').on('click', function() {
     makeRequest($('#menu-options'));
     return false;
});
//try hide and show
$('.tab button').on('click', function(){
  $('.tab button').removeClass('active');
  $(this).addClass('active');
  if($('.addtab').hasClass('active')){
    $('.add-meal').removeClass('inactive');
    $('.generate-meal').removeClass('active');
    $('.generate-meal').addClass('inactive');
    $('.add-meal').addClass('active');
  } else {
    $('.add-meal').addClass('inactive');
    $('.generate-meal').addClass('active');
    $('.generate-meal').removeClass('inactive');
    $('.add-meal').removeClass('active');
  }
});

$('#add-button').on('click', function() {
   let data =$('.add-meal').serializeArray();
   makeRequest(data);
   return false;
});

});
function animateGoodExpressionRequest(statusCode, statusDescription, response) {
  let expressions = response;
  if(expressions !='The meal has been added!'){
    expressions= expressions[Math.floor(Math.random() * expressions.length)];
    const $expressionTabs = $('#expressions-information .tabs').html('');
    for (var i = 0; i < expressions.length; i++) {
      if(i===2){
        $expressionTabs.append(`<li><img src='${expressions[i]}'></li>`);
      } else {
        $expressionTabs.append(`<li><p>${expressions[i]}</p></li>`);
      }

    }
  } else {
    const $expressionTabs = $('#expressions-information .tabs').html('');
    $expressionTabs.append(`<li><p>${expressions}</p></li>`)

  }

}

function animateBadExpressionRequest(statusCode, statusDescription){
console.log("the request was bad");
};

function displayRecipe(statusCode, statusDescription, response){
  const $expressionTabs = $('#expressions-information .tabs').html('');
    $expressionTabs.append(response);
}

function makeRequest(data){
$.ajax(`/`, {
  type: "POST",
  data: data,
  success: function(response) {
    console.log(response)
    displayRecipe('200', 'OK', response);
  },
  error: function() {
    animateBadExpressionRequest('404', 'Not Found');
  }
});
}
