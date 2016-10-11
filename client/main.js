import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';
import '../imports/templates.html';

FlowRouter.route('/', {
  name: 'home',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "home" });
  }
});

FlowRouter.route('/:_id', {
  name: 'line',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "dashM" });
  }
});

FlowRouter.route('/view/:_id', {
  name: 'lineView',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "dash" });
  }
});

Meteor.subscribe('lines', function() {
  var code = FlowRouter.getParam("_id");
  //console.log(Lines.find({code: code}).fetch()[0]);
});

var lineInterval;
var dashCode;
var bar;

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

    /*if (dashCode == 'E29V') {
      var marker2 = new google.maps.Marker({
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        position: new google.maps.LatLng(32.884890, -117.239047),
        map: map.instance
      });
    } else {
      //other locations
    }*/

  });
};

Template.maps.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        //34°02'37.6"N 118°15'55.9"W
        center: new google.maps.LatLng(48.858487, 2.294172),
        scrollwheel: false,
        zoom: 18
      };
    }
  }
});

Template.charts.rendered = function(){
    CanvasJS.addColorSet("blueShades",
    [//colorSet Array
    "#2980b9"
    ]);
    var chart = new CanvasJS.Chart("chartContainer", {
      colorSet: "blueShades",
      animationEnabled: true,
      animationDuration: 2000,
      axisY:{
         valueFormatString: " ",
         gridColor: "white"
      },
      axisX:{
        valueFormatString: "",
      },
      data: [{
        type: "column",
        dataPoints: [
        { label: "9am", y: 3 },
        { label: "10am", y: 3 },
        { label: "11am", y: 7 },
        { label: "12pm", y: 10 },
        { label: "1pm", y: 12 },
        { label: "2pm", y: 10 },
        { label: "3pm", y: 8 },
        { label: "4pm", y: 6 },
        { label: "5pm", y: 9 },
        { label: "6pm", y: 13 },
        { label: "7pm", y: 22 },
        { label: "8pm", y: 12 },
        { label: "9pm", y: 8 },
        { label: "10pm", y: 3 },
        { label: "11pm", y: 2 }
        ]
      }]
    });
    chart.render();
  $('.canvasjs-chart-credit').hide()
}

Template.dashM.rendered = function(){
  Meteor.call('lineAdjust', 'E29V', 27);
  Meteor.call('lineAdjust', 'MK5V', 15);

  lineInterval = setInterval(intervalFunction, 2000);

  var code = FlowRouter.getParam("_id");
  //Tick Tock
  var per = 0;

  if (code == 'E29V') {
    var total = 28;
  } else {
    var total = 16;
  }

  //Lines.find({code: code}).fetch()[0].lineSize;
  function intervalFunction() {
    Meteor.call('lineMinus', code)
    var lineNum = Lines.find({code: code}).fetch()[0].lineSize;
    var timeLeft = lineNum*5;

    var cHour = Math.floor(timeLeft/60)
    var cMinute = Math.round(timeLeft%60)

    var hourMin = cHour + 'hr ' + cMinute + 'm';
    Meteor.call('hourMin', code, hourMin);
    if (lineNum == 0) {
      per = 0;
    } else {
      per = 1-(lineNum/total);
    }
    if (per < 1.0 && per > 0) {
      bar.animate(per)
    } else {
      //change circle to something bright
      $("#circleProgressBar").html("");
      var ProgressBar = require('progressbar.js')
      var line = new ProgressBar.Line('#circleProgressBar');
      bar = new ProgressBar.Circle(circleProgressBar, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1400,
        color: '#2ed06e',
        trailColor: '#eee',
        trailWidth: 0,
        svgStyle: null
      });
      $("html, body").animate({ scrollTop: 0 }, "slow");
      var hourMin = "Ready";
      Meteor.call('hourMin', code, hourMin);
      $('#lineSize').hide();
      $('#cDone').show();
      bar.animate(1);
    }

    if (lineNum < 1) {
      window.clearInterval(lineInterval);
      //fire trillo !
    }
  }
};

Template.dashboard.rendered = function(){
  $('.button-collapse').sideNav();
  $('.carousel.carousel-slider').carousel({full_width: true});
  var ProgressBar = require('progressbar.js')
  var line = new ProgressBar.Line('#circleProgressBar');
  bar = new ProgressBar.Circle(circleProgressBar, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#2980b9',
    trailColor: '#eee',
    trailWidth: 0,
    svgStyle: null
  });
};

Template.header.rendered = function() {
  console.log('header')
};

Template.header.events({
  'click #logo-container'() {
    console.log('adding new lines');
    //Meteor.call('newCLine', 'Panda Express', 'Panda Express, 453 Horton Plaza, San Diego, CA 92101', 'E29V');
    //Meteor.call('newCLine', 'Eiffel Tower', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France', 'MK5V');
    //Meteor.call('newCLine', 'RIMAC Arena', '9730 Hopkins Dr, La Jolla, CA 92093', 'E29V');
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
    }
    //return false;
  });
};

Template.home.helpers({
});

Template.home.events({
  'click #download-button'() {
    window.clearInterval(lineInterval);
    var code = $('#lineRegister').val().toUpperCase();
    console.log(code)
    var line = Lines.find({code: code}).fetch()[0];
    if (line != undefined) {
      FlowRouter.go('line', { _id: code});
    } else {
      console.log('Invalid Event Code!');
    }
  },
  'click #logo-container'() {
    console.log('adding new lines');
    //Meteor.call('newCLine', 'Panda Express', 'Panda Express, 453 Horton Plaza, San Diego, CA 92101', 'E29V');
    Meteor.call('newCLine', 'Eiffel Tower', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France', 'MK5V');
    Meteor.call('newCLine', 'RIMAC Arena', '9730 Hopkins Dr, La Jolla, CA 92093', 'E29V');
    window.clearInterval(lineInterval);
    $('#lineSize').show();
    $('#cDone').hide();
    FlowRouter.go('home');
  }
});

Template.home.rendered = function(){
  $('.button-collapse').sideNav();
};
