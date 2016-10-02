import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';

FlowRouter.route('/', {
  name: 'home',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "home" });
  }
});

/*FlowRouter.route('/map', {
  name: 'maps',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "maps" });
  }
});*/

FlowRouter.route('/server/:_id', {
  name: 'server',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "server" });
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
var dashCode;

Meteor.subscribe('lines', function() {
  lineNum = Lines.find({}).fetch()[0].lineSize;
});

Template.dashboard.helpers({
  line: function(){
    dashCode = FlowRouter.getParam("_id");
    return Lines.find({code: dashCode}).fetch()[0];
  }
});

Template.maps.rendered = function(){
  //GoogleMaps.load({ v: '3', key: '12345', libraries: 'geometry,places' });
  GoogleMaps.load({key: 'AIzaSyAlvw8Vw4HAy8DCD08Pue62prn04NDA0HU'});
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });

    if (dashCode == 'E29V') {
      var marker2 = new google.maps.Marker({
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        position: new google.maps.LatLng(32.879694, -117.236567),
        map: map.instance
      });
    } else {
      //other locations
    }

  });
};

Template.maps.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        //34°02'37.6"N 118°15'55.9"W
        center: new google.maps.LatLng(32.885246, -117.239136),
        zoom: 15
      };
    }
  }
});

Template.server.rendered = function(){
  console.log('Server rendered')
  Meteor.call('lineAdjust', 'E29V', 15);

  lineInterval = setInterval(intervalFunction, 3000);

  var code = FlowRouter.getParam("_id");
  //Tick Tock
  function intervalFunction() {
    Meteor.call('lineMinus', code)
    lineNum = Lines.find({code: code}).fetch()[0].lineSize;
    var timeLeft = lineNum*5;
    var cHour = Math.round(timeLeft/60)
    var cMinute = Math.round(timeLeft%60)
    var hourMin = cHour + 'hr ' + cMinute + 'm';
    Meteor.call('hourMin', code, hourMin);
    if (lineNum < 1) {
      window.clearInterval(lineInterval);
      //fire trillo event!
    }
    console.log(hourMin);
    //$('#qPosition').text(lineNum);
  }
};

Template.dashboard.rendered = function(){
  $('.button-collapse').sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true});
  var ProgressBar = require('progressbar.js')
  var line = new ProgressBar.Line('#circleProgressBar');
  var bar = new ProgressBar.Circle(circleProgressBar, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#2980b9',
    trailColor: '#eee',
    trailWidth: 0,
    svgStyle: null
  });

  bar.animate(1.0);  // Number from 0.0 to 1.0
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

  $("#lineRegisterForm").submit(function (e) {
    //e.preventDefault();
    var code = $('#lineRegister').val().toUpperCase();
    console.log(code)
    var line = Lines.find({code: code}).fetch()[0];
    if (line != undefined) {
      FlowRouter.go('line', { _id: code});
    } else {
      console.log('Invalid Event Code!');
      //alert('Invalid Event Code!');
    }
    //return false;
  });
};

Template.home.helpers({
});

Template.home.events({
  'click #download-button'() {
    var code = $('#lineRegister').val().toUpperCase();
    console.log(code)
    var line = Lines.find({code: code}).fetch()[0];
    if (line != undefined) {
      FlowRouter.go('line', { _id: code});
    } else {
      console.log('Invalid Event Code!');
      //alert('Invalid Event Code!');
    }
  }
});

Template.home.rendered = function(){
  $('.button-collapse').sideNav();
};
