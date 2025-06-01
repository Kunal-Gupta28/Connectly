const io = require('socket.io');

const initializeSocket = (server) => {
  const socketIO = io(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  socketIO.on("connection", (socket) => {

    // Create room
    socket.on("create-room", ({roomId}) => {
      socket.join(roomId);
      socket.emit("navigate_host", {joinHostToRoomId:roomId});
    });

    // Join room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.emit("join_the_user", { joinNewUser: roomId });
      socket.to(roomId).emit("new-user-connected", {newUserJoinId :socket.id});
    });

    // Stream handling
    socket.on("stream", (stream, roomId) => {
      socket.to(roomId).emit("stream", stream);
    });

    // Chat messages
    socket.on("send-message", (message, roomId) => {
      socket.to(roomId).emit("receive-message", message);
    });

    // Mic/Camera toggle updates
    socket.on("user-status", (status, roomId) => {
      socket.to(roomId).emit("user-status-update", {
        ...status,
        id: socket.id,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      const rooms = [...socket.rooms].filter((r) => r !== socket.id);
      rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-disconnected", socket.id);
      });
    });
  });

  return socketIO;
};

module.exports = initializeSocket;
