const FacebookStrategy = require("passport-facebook").Strategy; //Facebook Authentication Passport Module

//Facebook Stratergy
//When ever we use the authentication function in index.js(133) it sends that to this strategy
module.exports = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        //Facebook Credintials
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CLIENT_URL,
        passReqToCallback: true,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async function (request, accesstoken, refreshtoken, profile, done) {
        //Sends the data to the serialize user.
        done(null, profile);
      }
    )
  );
};
