const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  booking: [{
    parkingSlotId: Number,
    parkingSubSlotId: Number,
    bookingtime: Date,
    validity: Date
  }],
  vehicle: [{
    registrationNumber: { type: String },
    vehicletype: { type: String }
  }],
  facebookId: {
    type: String
  },
  access_token: {
    type: String
  },
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
  // get access to the user model
  const user = this;

  //Facebook users doesn't have password
  if (!user.password) { next(); }

  // generate a salt then run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

userSchema.statics.findOrCreate = function (filters, cb) {
  User = this;
  this.find(filters, function (err, results) {

    if (err) { return cb(err); }

    if (results.length == 0) {
      var newUser = new User();
      newUser.facebookId = filters.facebookId;
      newUser.email = filters.facebookId;
      //::Check save function sends savedUser in callback or not
      newUser.save(function (err, savedUser) {
        console.log(savedUser);
        cb(err, savedUser);
      });
    }
    else {
      cb(err, results[0]);
    }
  });
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
