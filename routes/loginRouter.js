const express = require("express");
const Router = express.Router();
const passport = require("passport");
const app = require("../index");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  max: 5,
  windowMs: 10000,
});
var sendDate =null;
var recieveDate=null;

//Here the Client Google Request is taken
Router.get("/oauth/google/:roomid", limiter, function (req, res, next) {
  sendDate = (new Date()).getTime();

  var userRoomId = req.params.roomid;
  //userRoomId is basically a unique id of the client.
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: userRoomId,
  })(req, res, next);
  //Here I authenticate the data of the user and by using **state** keyword we can send our own parameters into the authentication function
});

//Callback Function for Google Authentication.
Router.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: "/"}), //If the authentication is failed then it redirects to the '/' router.
  (req, res) => {
    recieveDate = (new Date()).getTime();
    //This is the get method of socketio server.(index.js->113)
    var namespace = req.app.get("socketio");
    //In req.user we can find the response from the google. It contains all the data of the user.
    //Here I send the data as a message using emit function and that message is sent to the room based on the user id
    var profile={
      id:"",
      username:"",
      email:"",
      picture:""
    };
    profile.id=req.user.id;
    profile.username=req.user.displayName;
    profile.email=req.user.email;
    profile.picture=req.user.picture;
    console.log("date:- "+(recieveDate-sendDate))
    // console.log(profile);
    namespace
      .in(req.query.state)
      .emit("Message", JSON.stringify(profile));
      res.send("User Signed in Succesfully!! Close the Window and Open the Unity..");
  }
);


//Here the Client Linkedin Request is taken
Router.get("/oauth/linkedin/:roomid", limiter, function (req, res, next) {
  sendDate = (new Date()).getTime();
  var userRoomId = req.params.roomid;
  //userRoomId is basically a unique id of the client.

  passport.authenticate("linkedin", {
    scope: ['r_emailaddress', 'r_liteprofile'],
    //Scope is basically the required data from the linkedin server, I need emailaddress and profile so, I mention that
    state: userRoomId,
  })(req, res, next);
  //Here I authenticate the data of the user and by using **state** keyword we can send our own parameters into the authentication function
});

//Callback Function for Linkedin Authentication.
Router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {failureRedirect: "/"}), //If the authentication is failed then it redirects to the '/' router.
  (req, res) => {
    recieveDate = (new Date()).getTime();

    //This is the get method of socketio server.(index.js->113)
    var namespace = req.app.get("socketio");
    //In req.user we can find the response from the linkedin. It contains all the data of the user.
    //Here I send the data as a message using emit function and that message is sent to the room based on the user id
    var profile={
      id:"",
      username:"",
      email:"",
      picture:""
    };
    console.log("date:- "+(recieveDate-sendDate))

    const obj = JSON.parse(req.user._raw);
    profile.id=req.user.id;
    profile.username=req.user.displayName;
    profile.email=req.user.emails[0].value;
    profile.picture=obj.profilePicture["displayImage~"].elements[0].identifiers[0].identifier;
    namespace
      .in(req.query.state)
      .emit("Message", JSON.stringify(profile));
    res.send("User Signed in Succesfully!! Close the Window and Open the Unity..");

  }
);

//Here the Client Facebook request is taken
Router.get("/oauth/facebook", limiter, function (req, res, next) {
  //Basically in the client side, I sent the roomid as a query parameter with name did.
  // https://localhost:4000/auth/facebook/?did=roomid --> This is the url that i used in the client side.
  var userRoomId = req.query.roomid; //To taking the data from the parameter I used req.query.paramatername
  //userRoomId is basically a unique id of the client.

  passport.authenticate("facebook", {scope: "email", state: userRoomId})(
    req,
    res,
    next
  );
  //Here I authenticate the data of the user and by using **state** keyword we can send our own parameters into the authentication function
});

//Callback Function for Facebook Authentication.
Router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {failureRedirect: "/"}), ////If the authentication is failed then it redirects to the '/' router.
  (req, res) => {
    //This is the get method of socketio server.(index.js->113)
    var namespace = req.app.get("socketio");
    //In req.user we can find the response from the facebook. It contains all the data of the user.
    //Here I send the data as a message using emit function and that message is sent to the room based on the userid
    var profile={
      id:"",
      username:"",
      email:"",
      picture:""
    };
    
    profile.id=req.user._json.id;
    profile.username=req.user._json.name;
    profile.email=req.user._json.email;
    profile.picture=req.user._json.picture.data.url;

    namespace
      .in(req.query.state)
      .emit("Message", JSON.stringify(profile));
    res.send("User Signed in Succesfully!! Close the Window and Open the Unity..");

  }
);

module.exports = Router;
