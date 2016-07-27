// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var gameSchema = mongoose.Schema({

    games : {
        game : String,
        other: String
    }

});

// generating a hash
gameSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
gameSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Game', gameSchema);
