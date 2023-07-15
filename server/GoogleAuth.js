const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('./myModel')
require('dotenv').config(); 




passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    const user = await User.findOne({
      accountId:profile.id,
      provider:'facebook',
    })
    if(!user) {
      const user = await  User({
        name:profile.displayName,
        accountId:profile.id,
        provider:profile.provider,
        scope:['profile', 'email']
      })
      
      await user.save();
      return cb(null, profile);
    }else{
      console.log('Facebook User already exits');
      return cb(null, profile)
    }
   
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  return done(null, user);
})