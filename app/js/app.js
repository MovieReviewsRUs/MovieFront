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

$(document).ready(function(){
  trace('hello world');
  App.getMovies();
});

App.getMovies = function(){
  $.ajax({
    url: App.url + '/movies',
    type: 'GET',
  }).done(function(data){
    App.render_all_movies(data);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });

  App.render_all_movies = function(movies){
   var html = '';
   html += "<ul>"
    movies.forEach(function(movie){
      html += '<article>'
      html += "<h2>" + movie.title + "</h2>";
      html += '<li> Total Gross: ' + movie.total_gross + "</li>";
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
        html += "<li>" + review.name + "</li>";
        });
      };
       html += '<article>'
       html += "</ul>";
    });
    $('.movies').append(html);
  };
};
