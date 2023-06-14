const GoogleStrategy = require("passport-google-oauth2").Strategy; //Google Authentication Passport Module

//Google Stratergy
//When ever we use the authentication function in index.js(77) it sends that to this strategy
module.exports = (passport) => {
  passport.use(
    //creating a stratergy to the user.
    new GoogleStrategy(
      {
        //Google Credintials
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_URL,
        passReqToCallback: true,
      },

      async function (request, accesstoken, refreshtoken, profile, done) {
        //Sends the data to the serialize user.
        done(null, profile);
      }
    )
  );
};
