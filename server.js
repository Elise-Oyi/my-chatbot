import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

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
function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

//--storing in memory
let conversations = {};

// -- listening for connection
io.on("connection", (socket) => {

  const existingClientId = socket.handshake.query.id;
  let clientId;

  if (existingClientId) {

    console.log(`an existing client has joined with id: ${existingClientId}`);
    clientId = existingClientId;
    const existingMessages = conversations[existingClientId];

    if (existingMessages) {
      socket.emit("EXISTING_MESSAGES", existingMessages);
    }
  } else {
    //-- generating a new id when a client connects
    const newClientId = uuid();
    clientId = newClientId;

    socket.emit("ID_ASSIGNED", newClientId);

    //-- sending a message when a user first opens the chatbot...
    setTimeout(() => {
      const newMessage =
       {
        Id: 1,
        isUser: false,
        from: "Zeekay",
        text: "Hello, how can I assist you?",
        unread: true,
        sentAt: new Date(),
      };

      socket.emit("GREETING", newMessage);
      conversations[newClientId] = [newMessage];
    }, randomInRange(1500, 4000));
  }

  let goodQuestionResponseTimeout;
  socket.on('MARK_ALL_AS_READ', ()=> {
    conversations[clientId] = (conversations[clientId] || []).map((message)=>({
        ...message,
        unread: false
    }))
  })

  socket.on("NEW_MESSAGE", (newMessage) => {

    // conversations[clientId] = conversations[clientId]
    //   ? conversations[clientId].push(newMessage)
    //   : [newMessage];
    // console.log(conversations);

    if (!conversations[clientId]) {
        conversations[clientId] = [];
      }
    
      conversations[clientId].push(newMessage);
    
      console.log(conversations);

    //-- sending its been read
    setTimeout(() => {
      socket.emit("MESSAGE_READ");
    }, randomInRange(1000, 3000));

    //-- typing
    setTimeout(() => {
      socket.emit("IS_TYPING");
    }, randomInRange(3000, 4000));

    //-- clearing timeout id it has already executed yo avoid sending multiple of the same messages 
    if(goodQuestionResponseTimeout){
        clearTimeout(goodQuestionResponseTimeout)
    }

    goodQuestionResponseTimeout = setTimeout(() => {
      const newMessage = {
        Id: 1,
        isUser: false,
        from: "Zeekay",
        text: "Thats a great question, let me get someone to help you ",
        unread: true,
        sentAt: new Date(),
      };

      socket.emit("NEW_MESSAGE", newMessage);

      conversations[clientId].push(newMessage)   
      
      goodQuestionResponseTimeout = undefined
    
    }, randomInRange(5000, 6000));
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
