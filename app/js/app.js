/*global $:false*/
'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var App = App || {
  url: 'http://localhost:3000'
};

App.getMovies = function(){
  $.ajax({
    url: App.url + '/movies',
    type: 'GET',
  }).done(function(data){
    App.render_all_movies(data);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });
};

App.render_all_movies = function(movies){
  var html = "<ul>";

  movies.forEach(function(movie){
    var show_url = "http://localhost:9000/show.html?" + movie.id
    $('.dropdown-menu').append('<li><a href="' + show_url + '">' + movie.title +'</a></li><li class="divider"></li>');

    html += "<div id='movie-" + movie.id + "'>";
    html += '<article>';
    html += "<h2>" + movie.title + "</h2>";
    html += '<li> Total Gross: $' + movie.total_gross + "</li>";
    html += '<li> MPAA Rating: ' + movie.mpaa_rating + "</li>";
    html += '<li> Release Date: ' + movie.release_date + "</li>";
    html += '<li> Description: ' + movie.description + "</li>";
    if (movie.reviews.length > 0){
      movie.reviews.forEach(function(review){
      html += "<br><h3>Reviews: </h3>";
      html += '<li> Author: ' + review.author + "</li>";
      html += '<li> Comment: ' + review.comment + "</li>";
      html += '<li> Rating(Number of Stars): ' + review.star_rating + "</li>";
      html += "<ul>";
      });
    };
     html += '</article>'
     html += "</ul>";
     html += '<hr>'
     //html += "<input type='submit' id='delete-" + movie.id + "' value='Add Movie' />";
     html += '</div>';
  });
  $('.movies').append(html);
  App.show_a_movie();
};

App.show_a_movie = function(){
  var queryString = window.location.search;
  queryString = queryString.substring(1);
  $.ajax({
    url: App.url + '/movies/' + queryString,
    type: 'GET',
  }).done(function(movie){
    var html = "<ul>";
    html += "<h2>" + movie.title + "</h2>";
    html += '<li> Total Gross: $' + movie.total_gross + "</li>";
    html += '<li> MPAA Rating: ' + movie.mpaa_rating + "</li>";
    html += '<li> Release Date: ' + movie.release_date + "</li>";
    html += '<li> Description: ' + movie.description + "</li>";
    if (movie.reviews.length > 0){
      movie.reviews.forEach(function(review){
      html += "<br><h3>Reviews: </h3>";
      html += '<li> Author: ' + review.author + "</li>";
      html += '<li> Comment: ' + review.comment + "</li>";
      html += '<li> Rating(Number of Stars): ' + review.star_rating + "</li>";
      html += "<ul>";
      });
    };
    html += "</ul>";
    $('.show-movie').append(html);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });
};

App.submitMovie = function(event){
  if(event.preventDefault) event.preventDefault();
  $.ajax({
    url: App.url + '/movies',
    type: 'POST',
    dataType: 'JSON',
    data: {
      movie: {
        title: $('#movie-title').val(),
        total_gross: $('#total-gross').val(),
        release_date: $('#release-date').val(),
        mpaa_rating: $('#rating').val(),
        description: $('#description').val()
      }
    }
  }).done(function(data){
    trace(data);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });
};


$(document).ready(function(){
  App.getMovies();
  var $selectedMovie = $('h2#theMovie');
  $selectedMovie.on('click', function(event){
    alert("Movie clicked");
  });
  var $movieForm = $('form#new-movie-form');
  $movieForm.on('submit', function(event){
    App.submitMovie(event);
  });
});
