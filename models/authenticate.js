const mongoose = require('mongoose');
var _ = require('underscore');
const Schema = mongoose.Schema;


let Registeration = new Schema({
	name:{type:String},
	email:{type:String},
	password:{type:String}
});

//Pre hook middleware to check email is already registered or not
Registeration.pre('save', function(next){
  var user = this ;
  mongoose.model('Registeration',Registeration).find({email: user.email},
            function(err, users){
    if(err) {
      return next(err);
    } else if(users) {
      if (_.find(users , {email: user.email})){
        user.invalidate('email', 'Email is already registered');
				console.log('Email is already registered');
        next( new Error("Email is already registered"));
      }
			else next();
    }
  })
})


module.exports = mongoose.model('Registeration',Registeration);
