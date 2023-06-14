const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy; //Linkedin Authentication Passport Module

//Linkedin Stratergy
//When ever we use the authentication function in index.js(104) it sends that to this strategy
module.exports = (passport) => {
  passport.use(
    new LinkedinStrategy(
      {
        //Linkedin Credintials
        clientID: '867wxronify9gb',
        clientSecret: 'FiipSVo0UuVb3Gu6',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback',
        scope: ['r_emailaddress', 'r_liteprofile'],

        passReqToCallback: true,
      },
      async function (request, accesstoken, refreshtoken, profile, done) {
        //Sends the data to the serialize user.
        done(null, profile);
      }
    )
  );
};
