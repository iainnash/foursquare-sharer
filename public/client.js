$(function() {
  $.getJSON('/where', function(data) {
    //console.log(data);
    $('#country').text(data.country);
    $('#city').text(data.city);
    $('#cat').text(data.cat);
  });
})