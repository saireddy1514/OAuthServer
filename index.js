//Required Modules
const express = require("express");
const app = express();
const http = require("http");
const socket = require("socket.io"); //SOCKETIO Module helps to creating a connection between client and server
const passport = require("passport"); //creating an configuration for social media logins
const session = require("express-session");
const ratelimit = require("socket-rate-limiter"); //rate limit check from server side
const loginRouter = require("./routes/loginRouter");

require("dotenv").config();

//Creating a server with HTTP module
const server = http.createServer(app);

//Using 3000 port for Local server and for global we declared process.env.PORT
const port = process.env.PORT || 3000;

/* SOCKET IO CONNECTION */

//Creating a server to the socket
//Based on this server we can send & recieve the data between client and server.
var io = socket(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
});

io.use((socket, next) => {
  //Handshake Token
  if (socket.handshake.query.token === "UNITY") {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

const namespace = io.of("/hwauth");
//Creating a connection
namespace.on("connection", async function (socket) {
  //Rate Limit check when an user joins from the system ip address
  let haveEnoughTokens = ratelimit.checkAvailableTokens(
    socket.conn.remoteAddress, //remoteaddress of socket
    100 //No:of Requests
  );
  if (haveEnoughTokens instanceof Error) {
    socket.emit("limit-exceed", haveEnoughTokens.message); //if Limit exceeded, then disconnect the server.
    socket.disconnect();
    return;
  }

  console.log(new Date(new Date().toUTCString())+"---> Connection Ready on id:- " + socket.id);
  socket.on("joinRoom", (roomid) => {
    socket.join(roomid); //Here we join in that room.
    console.log(new Date(new Date().toUTCString())+"---> Room Created:-" + roomid);
  });
  //For Sending the message to a particular room.
  socket.on("sendMessage", (message, roomid) => {
    if (roomid === "") {
      console.log("Public Message");
    } else {
      namespace.in(roomid).emit("Message", message); // Sending a message to all the clients in that room.
      //socket.to(room).emit("Message",message);     --> Sending a message to that room instead to the client.
      //socket.disconnect();
    }
  });

  socket.on("roomId", (deviceId) => {
    //creating a unique room id for the user.
    var userRoom = socket.id + deviceId;
    socket.emit("socketid", userRoom);
  });

  //Disconnect the socket
  socket.on("disconnect", (room) => {
    //Disconnect with the room
    socket.leave(room);
    //Disconnect with socket
    socket.disconnect(true);
  });
});

/* PASSPORT JS SETUP CONFIGURATUION */

//Passport Intialization
app.use(passport.initialize());
//Passport Session usage
//app.use(passport.session());
//Session Creation for the Client
app.use(
  session({
    secret: "Club Website Secret Password Handler",
    resave: false,
    saveUninitialized: false,
  })
);

//serializeUser function to persist user data (after successful authentication) into session
passport.serializeUser(function (user, done) {
  //data sends to the callback function
  done(null, user);
});

//deserializeUser is used to retrieve user data from session
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//Stratergies Importing
// require("./stratergies/facebookStratergy")(passport);
require("./stratergies/linkedinStratergy")(passport);
require("./stratergies/googleStratergy")(passport);

//Creating a setter method for the socket connection. This method will helps to use the socket server inside the router.
app.set("socketio", namespace);

//Routers importing
app.use("/auth", loginRouter);

module.exports = app;

server.listen(port, () => {
  console.log("listening on *:" + port);
});
