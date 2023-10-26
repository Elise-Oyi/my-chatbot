import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

//a function to return random numbers
function randomInRange(min,max){
    return min + (Math.random() * (max - min))
}

// -- listening for connection
// ** the socket arg is like express' (req,res)
io.on("connection", (socket) => {
  console.log("A connection has been extablished");

  //-- sending a message when a user first opens the chatbot...
  // ** socket.emit(<variable name>, <whatever you want to send back>)
  //** socket.emit is use to send and socket.on listens
  setTimeout(() => {
    socket.emit("GREETING", {
      Id: 1,
      isUser: false,
      from: "Zeekay",
      text: "Hello, how can I assist you?",
      unread: true,
      sentAt: new Date(),
    });
  },  randomInRange(1500,4000));

  socket.on("NEW_MESSAGE", (message) => {
    //-- sending its been read
    setTimeout(() => {
      socket.emit("MESSAGE_READ");
    }, randomInRange(1000,3000))

    setTimeout(() => {
      socket.emit("NEW_MESSAGE", {
        Id: 1,
        isUser: false,
        from: "Zeekay",
        text: "Thats a great question, let me get someone to help you ",
        unread: true,
        sentAt: new Date(),
      });
    },  randomInRange(4000,6000));
  });


  //-- when a client disconnects
  socket.on("disconnect", () => {
    console.log("The client has disconnected");
  });
});

const port = 8080;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
