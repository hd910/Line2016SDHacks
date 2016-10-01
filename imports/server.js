import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//DB Schema -> seperate document for each location or array
//inside a single document
export const Lines = new Mongo.Collection('lines');

Meteor.methods({
  newLine(cName, cAddress, code){
    //relevant parameters
    Lines.insert({
      name: cName,
      address: cAddress,
      lineSize: 0,
      hourMin: 0,
      code: code
    });
  },
  //store local instance
  lineMinus(code){
    //easier to just do seperate methods for different operations?
    //switch chase?
    Lines.update({"code": code}, {$inc: {lineSize: -1}});
  },
  lineAdd(code){
    Lines.update({"code": code}, {$inc: {lineSize: -1}});
  },
  lineAdjust(code, value){
    Lines.update({"code": code}, {"$set" : {lineSize : value}});
  },
  codeAdjust(code, newCode){
    Lines.update({"code": code}, {"$set" : {code : newCode}});
  },
  hourMin(code, hourMin){
    Lines.update({"code": code}, {"$set" : {hourMin : hourMin}});
  }
});

//Needs db to store info about files
Meteor.startup(() => {
  //Meteor.call('codeAdjust', '1499', '4B5V')
  //Meteor.call('lineAdjust', 'E29V', 149);
  //Meteor.call('newLine', 'Panda Express', 'Panda Express, 453 Horton Plaza, San Diego, CA 92101')
  //Meteor.call('newLine', 'Which Wich', '926 Orange Ave, Coronado, CA 92118', '4B5V');
  // code to run on server at startup
});

if (Meteor.isServer) {
  //Restivus API?
  Meteor.publish("lines", function () {
    return Lines.find({});
  });
}
