import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//DB Schema -> seperate document for each location or array
//inside a single document
export const Lines = new Mongo.Collection('lines');

Meteor.methods({
  newLine(){
    //relevant parameters
    Lines.insert({});
  }
});

Meteor.startup(() => {
  // code to run on server at startup
  //Restivus API?

  Meteor.publish("mixes", function () {
    return Lines.find();
  });
});
