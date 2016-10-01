import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';

FlowRouter.route('/', {
  name: 'home',
  action(params, queryParams) {
    console.log("Looking at a list?");
    BlazeLayout.render('layout1', { top: "header", main: "home" });
  }
});

FlowRouter.route('/:_id', {
  name: 'line',
  action(params, queryParams) {
    console.log(params)
    BlazeLayout.render('layout1', { top: "header", main: "dashboard" });
  }
});

Meteor.subscribe('lines', function() {
  //console.log(Lines.find({}).fetch()[0]);
});

Template.dashboard.helpers({
  //No need for jquery if I have handlebars?
  line: function(){
    return Lines.find({}).fetch()[0];
  }
});

Template.dashboard.rendered = function(){
  var lineNum = 99;
  $('#qPosition').text(lineNum);
  var myVar = setInterval(myTimer, 3000);

  function myTimer() {
      var d = new Date();
      lineNum --;
      $('#qPosition').text(lineNum);
      //qPosition
      document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  }
  //window.clearInterval(timerVariable)
};

Template.home.rendered = function() {
  //console.log('rendered')
  //this is like rendered
  //$('#lineRegisterForm').submit();

  $("#lineRegisterForm").submit(function (e) {
    //console.log(e);
    console.log($('#lineRegister').val())
    var code = $('#lineRegister').val();
    if (code == '123') {
      FlowRouter.go('line', { _id: code});
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
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.dashboard.rendered = function(){
  $('.button-collapse').sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true});
};

Template.home.rendered = function(){
  $('.button-collapse').sideNav();
};
