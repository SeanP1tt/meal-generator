
$(document).ready(() => {

  $('#meal-button').on('click', function() {
    let meal = $('#menu-options');
    let diet = $('diet-options');
    // console.log(meal[0].value)
     makeRequest(meal);
     return false;
});
$('#settings-icon').on('click', function() {
  $('#settings-icon').animate({display: 'none !important'}, "slow")

});
});

async function displayLoading(nextOperation){
  
}

function badRequest(statusCode, statusDescription){
console.log("the request was bad");
};

function displayRecipe(statusCode, statusDescription, response){
  const $expressionTabs = $('#expressions-information .tabs');
  const $panel = $('#expressions-information');
  $expressionTabs.html('');
  $panel.addClass('inactive');
  $('.loader').removeClass('inactive');
  setTimeout(()=>{
    $('.loader').addClass('inactive')
  }, 1000)
  setTimeout(()=>{
    $panel.removeClass('inactive');
    $expressionTabs.append(response)
  }, 1200)
  
}

function makeRequest(data){
$.ajax(`/`, {
  type: "POST",
  data: data,
  success: function(response) {
    displayRecipe('200', 'OK', response);
  },
  error: function() {
    badRequest('404', 'Not Found');
    let error = (`<li><p>Oops the app made a mistake :/ </p></li>`)
    displayRecipe('200', 'OK', error);
  }
});
}
