
$(document).ready(() => {

  $('#meal-button').on('click', function() {
     makeRequest($('#menu-options'));
     return false;
});
});

function badRequest(statusCode, statusDescription){
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
    displayRecipe('200', 'OK', response);
  },
  error: function() {
    badRequest('404', 'Not Found');
    let error = (`<li><p>Oops the app made a mistake :/ </p></li>`)
    displayRecipe('200', 'OK', error);
  }
});
}
