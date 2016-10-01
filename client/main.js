import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';


Meteor.subscribe('lines', function() {
  console.log(Lines.find({}).fetch()[0]);
});

Template.home.onCreated(function homeOnCreated() {
  console.log('rendered')
  //this is like rendered
  $('#lineRegister').on("change paste keyup click input", function(){
    console.log('submit')
    $('#lineRegisterForm').submit();
  });

  $("#lineRegisterForm").submit(function (e) {
    console.log(e);
    e.preventDefault();
  });
});

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
