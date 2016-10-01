import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//DB Schema -> seperate document for each location or array
//inside a single document
export const Lines = new Mongo.Collection('lines');

Meteor.methods({
  newLine(cName, cAddress){
    //relevant parameters
    Lines.insert({
      name: cName,
      address: cAddress,
      lineSize: 0,
    });
  },
  //store local instance
  lineMinus(cName){
    //easier to just do seperate methods for different operations?
    //switch chase?
    Lines.update({"name": cName}, {$inc: {views: -1}});
  },
  lineAdd(cName){
    Lines.update({"name": cName}, {$inc: {views: -1}});
  }
});

//Needs db to store info about files
Meteor.startup(() => {
  //Meteor.call('newLine', 'Panda Express', 'Panda Express, 453 Horton Plaza, San Diego, CA 92101')
  // code to run on server at startup

});

if (Meteor.isServer) {
  //Restivus API?
  Meteor.publish("lines", function () {
    return Lines.find({});
  });
}
