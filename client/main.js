import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';

FlowRouter.route('/', {
  name: 'home',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "home" });
  }
});

FlowRouter.route('/:_id', {
  name: 'line',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "dashboard" });
  }
});

var lineInterval;
var lineNum;

Meteor.subscribe('lines', function() {
  lineNum = Lines.find({}).fetch()[0].lineSize;
});

Template.dashboard.helpers({
  //No need for jquery if I have handlebars?
  line: function(){
    return Lines.find({}).fetch()[0];
  }
});

Template.dashboard.rendered = function(){
  $('#qPosition').text(lineNum);
  lineInterval = setInterval(intervalFunction, 3000);

  var code = FlowRouter.getParam("_id");
  function intervalFunction() {
      Meteor.call('lineMinus', code)
      lineNum = Lines.find({code: code}).fetch()[0].lineSize;
      $('#qPosition').text(lineNum);
  }
};
Template.header.events({
  'click #logo-container'() {
    window.clearInterval(lineInterval);
    FlowRouter.go('home');
  }
});

Template.home.rendered = function() {
  //console.log('rendered')
  //this is like rendered
  //$('#lineRegisterForm').submit();

  $("#lineRegisterForm").submit(function (e) {
    //console.log(e);
    var code = $('#lineRegister').val().toUpperCase();
    console.log(code)
    var line = Lines.find({code: code}).fetch()[0];
    if (line != undefined) {
      FlowRouter.go('line', { _id: code});
    } else {
      alert('Invalid Event Code!')
    }
    e.preventDefault();
  });
};

Template.home.helpers({
  //No need for jquery if I have handlebars?
  line: function(){
    return Lines.find({}).fetch()[0];
  }
});

Template.home.events({
  'click #download-button'() {
    $('#lineRegisterForm').submit();
  },
});

Template.dashboard.rendered = function(){
  $('.button-collapse').sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true});
};

Template.home.rendered = function(){
  $('.button-collapse').sideNav();
};
