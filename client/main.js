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

FlowRouter.route('/:_id', {
  name: 'line',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "headerMain", main: "dashboard" });
  }
});

FlowRouter.route('/view/:_id', {
  name: 'lineView',
  action(params, queryParams) {
    BlazeLayout.render('layout1', { top: "header", main: "dashboard" });
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
Template.charts.rendered = function(){
  window.onload = function () {
    CanvasJS.addColorSet("blueShades",
    [//colorSet Array
    "#2980b9"
    ]);
    var chart = new CanvasJS.Chart("chartContainer", {
      colorSet: "blueShades",
                              animationEnabled: true,
                  animationDuration: 2000,
                              title: {
      },
      axisY:{
         valueFormatString: " ",
         tickLength: 0,
         gridColor: "white"
      },
      axisX:{
        valueFormatString: "Time (24hr)",
          tickLength: 0
      },
      data: [{
        type: "column",
        dataPoints: [
        { x: 9, y: 3 },
        { x: 10, y: 3 },
        { x: 11, y: 7 },
        { x: 12, y: 10 },
        { x: 13, y: 12 },
        { x: 14, y: 10 },
        { x: 15, y: 8 },
        { x: 16, y: 6 },
        { x: 17, y: 9 },
        { x: 18, y: 13 },
        { x: 19, y: 15 },
        { x: 20, y: 12 },
        { x: 21, y: 8 },
        { x: 22, y: 3 },
        { x: 23, y: 0 },
        ]
      }]
    });
    chart.render();
  }
  $('.canvasjs-chart-credit').hide()
}

Template.headerMain.rendered = function(){
  console.log('Server rendered')
  Meteor.call('lineAdjust', 'E29V', 15);

  lineInterval = setInterval(intervalFunction, 3000);

  var code = FlowRouter.getParam("_id");
  //Tick Tock
  var per = 0;
  var total = Lines.find({code: code}).fetch()[0].lineSize;
  function intervalFunction() {
    Meteor.call('lineMinus', code)
    var lineNum = Lines.find({code: code}).fetch()[0].lineSize;
    var timeLeft = lineNum*5;
    var cHour = Math.round(timeLeft/60)
    var cMinute = Math.round(timeLeft%60)
    var hourMin = cHour + 'hr ' + cMinute + 'm';
    Meteor.call('hourMin', code, hourMin);
    if (lineNum == 0) {
      per = 0;
    } else {
      per = 1-(lineNum/total);
    }

    if (per < 1.0) {
      bar.animate(per)
    } else {
      //change circle to something bright
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

Template.header.events({
  'click #logo-container'() {
    //Meteor.call('newCLine', 'Panda Express', 'Panda Express, 453 Horton Plaza, San Diego, CA 92101', 'E29V');
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
