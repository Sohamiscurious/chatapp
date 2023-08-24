const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const contact = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set contact", (contactName) => {
    socket.contactName = contactName;
    contact.push(contactName);
    io.emit("contacts update", contact);
    io.emit("user count", contact.length);
    const index = contact.indexOf(contactName);
    console.log(contact.length, index);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // contact.pop(socket.contactName);
    const index = contact.indexOf(socket.contactName);
    if (index !== -1) {
      contact.splice(index, 1);
    }
    io.emit("user count", contact.length);
    console.log(index, contact.length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
