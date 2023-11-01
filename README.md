# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Server.js
    socket.emit(<variable name>, <whatever you want to send back>)
    socket.emit is use to send and socket.on listens
    the socket arg is like express' (req,res)


# Chatbot.js
   socket.on(<variable name>, <a call back function>)
   socket.emit is use to send and socket.on listens
   the variable name for the on and emit for a particular event must be the same
   newMessage arg represents what was sent from the socket.emit