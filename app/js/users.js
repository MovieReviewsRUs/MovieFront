/*global $:false*/
'use strict';

var UserApp = (function() {
  var authToken, apiHost;

  var run = function() {
    authToken = localStorage.getItem('authToken');

    apiHost = 'http://localhost:3000';
    setupAjaxRequests();

    $('#loginForm').on('submit', submitLogin);
    $('#registrationForm').on('submit', submitRegistration);
    $('#sign-out').on('click', signOut);
  };

  var submitRegistration = function(event) {
    event.preventDefault();

    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {user: {
        email: $('#email').val(),
        password: $('#password').val()
      }},
    })
    .done(loginSuccess)
    .fail(function() {
      console.log('error');
    });
    return false;
  };

  var loginSuccess = function(userData) {
    localStorage.setItem('authToken', userData.token);
    console.log('Logged in!');
    window.location.href = '/';
    console.log('Logged in!');
  };

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
    .fail(function() {
      console.log('error');
    });
    return false;
  };

   var setupAjaxRequests = function() {
    $.ajaxPrefilter(function( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = 'Token token=' + authToken;
    });
  };

  var acceptFailure = function(error) {
    if (error.status === 401) {
      console.log('send to login screen');
      window.location.href = '/sign_in.html';
    }
  };

  var signOut = function(event){
    event.preventDefault();
    localStorage.removeItem('authToken');
    authToken = undefined;
    console.log('signed out');
  };

  return {run: run,
          acceptFailure: acceptFailure};

})();

$(document).ready(function(){
  UserApp.run();

});
