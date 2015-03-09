/*global $:false*/
'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var App = (function(){

  var authToken, apiHost;

  var run = function() {
    authToken = localStorage.getItem('authToken');

    apiHost = 'http://localhost:3000/api/v1';
    setupAjaxRequests();

    $('#loginForm').on('submit', submitLogin);
    $('#registrationForm').on('submit', submitRegistration);
  }

  var submitRegistration = function(event) {
    event.preventDefault();

    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {user: {email: $('#email').val(), password: $('#password').val()}},
    })
    .done(loginSuccess)
    .fail(function(err) {
      console.log(err);
    });

    return false;
  }

  var loginSuccess = function(userData) {
    localStorage.setItem('authToken', userData.token);
    console.log('logged in!');
    window.location.href = '/'; //might have to change?? expecting the index of movies
  }

  var submitLogin = function(event) {
    var $form;
    event.preventDefault();
    $form = $(this);
    $.ajax({
      url: apiHost + '/users/sign_in',
      type: 'POST',
      data: $form.serialize()
    })
    .done(loginSuccess)
    .fail(function(err) {
      console.log(err);
    });

    return false;
  }

  var setupAjaxRequests = function() {
    $.ajaxPrefilter(function( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + authToken;
    });
  }


  var url = 'http://localhost:3000';

  var getMovies = function(){
    $.ajax({
      url: url + '/movies',
      type: 'GET',
    }).done(function(data){
      render_all_movies(data);
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    });
  }

  var render_all_movies = function(movies){
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
      }
       html += '</article>'
       html += "</ul>";
       html += '<hr>'
       //html += "<input type='submit' id='delete-" + movie.id + "' value='Add Movie' />";
       html += '</div>';
    });
    $('.movies').append(html);
    show_a_movie();
  }



  // var show_a_movie = function(){
  //   var queryString = window.location.search;
  //   queryString = queryString.substring(1);
  //   $.ajax({
  //     url: url + '/movies/' + queryString,
  //     type: 'GET',
  //   }).done(function(movie){
  //     var html = "<ul>";
  //     html += "<h1>" + movie.title + "</h1>";
  //     html += '<li> Total Gross: $' + movie.total_gross + "</li>";
  //     html += '<li> MPAA Rating: ' + movie.mpaa_rating + "</li>";
  //     html += '<li> Release Date: ' + movie.release_date + "</li>";
  //     html += '<li> Description: ' + movie.description + "</li>";
  //     if (movie.reviews.length > 0){
  //       movie.reviews.forEach(function(review){
  //       html += "<br><h3>Reviews: </h3>";
  //       html += '<li> Author: ' + review.author + "</li>";
  //       html += '<li> Comment: ' + review.comment + "</li>";
  //       html += '<li> Rating(Number of Stars): ' + review.star_rating + "</li>";
  //       html += "<ul>";
  //       });
  //     }
  //     html += "</ul>";
  //     $('.show-movie').append(html);
  //   }).fail(function(jqXHR, textStatus, errorThrown){
  //     trace(jqXHR, textStatus, errorThrown);
  //   });
  // }

})();




  var submitMovie = function(event){
    if(event.preventDefault) event.preventDefault();
    $.ajax({
      url: url + '/movies',
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

  var submitReview = function(event){
    if(event.preventDefault) event.preventDefault();
    var queryString = window.location.search;
    queryString = queryString.substring(1);
    $.ajax({
      url: "http://localhost:3000/movies",
      type: 'POST',
      dataType: 'JSON',
      data: {
        review: {
          author: $('#review-author').val(),
          comment: $('#comment').val(),
          star_rating: $('#star-rating').val(),
        }
      }
    }).done(function(data){
      trace(data);
      window.location.href = '/';
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    });
  };




$(document).ready(function(){
  // App.getMovies();
  // App.render_all_movies();
  // App.show_a_movie();
  // App.submitMovie();
  // App.submitReview();
  App.run();

  var $movieForm = $('form#new-movie-form');
  $movieForm.on('submit', function(event){
    App.submitMovie(event);
  });
  var $reviewForm = $('form#new-review-form');
  $reviewForm.on('submit', function(event){
    App.submitReview(event);
  });
});
