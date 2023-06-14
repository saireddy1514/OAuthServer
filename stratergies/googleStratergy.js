const GoogleStrategy = require("passport-google-oauth2").Strategy; //Google Authentication Passport Module

//Google Stratergy
//When ever we use the authentication function in index.js(77) it sends that to this strategy
module.exports = (passport) => {
  passport.use(
    //creating a stratergy to the user.
    new GoogleStrategy(
      {
        //Google Credintials
        clientID: '325544379137-k54v89uln14l91i43rjjpd1e6nkr4jj1.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'https://o-auth-server.vercel.app/auth/google/callback',
        passReqToCallback: true,
      },

      async function (request, accesstoken, refreshtoken, profile, done) {
        //Sends the data to the serialize user.
        done(null, profile);
      }
    )
  );
};
