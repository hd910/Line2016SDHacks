import { Template } from 'meteor/templating';

import { Lines } from '../imports/server.js';

import './main.html';


Meteor.subscribe('lines', function() {
  console.log(Lines.find({}).fetch()[0]);
});

Template.home.onCreated(function homeOnCreated() {

});

Template.home.helpers({
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
