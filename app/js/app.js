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
    trace(data);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });
};
