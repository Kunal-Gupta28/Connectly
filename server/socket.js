const io = require('socket.io');

const initializeSocket = (server) => {
  const socketIO = io(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Log when a new socket connection is established
  socketIO.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Create room
    socket.on("create-room", ({ roomId }) => {
      try {
        console.log(`Creating room: ${roomId} by user: ${socket.id}`);
        socket.join(roomId);
        socket.emit("navigate_host", { joinHostToRoomId: roomId });
        console.log(`Room created successfully: ${roomId}`);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    // Join room
    socket.on("join-room", async ({ roomId }) => {
      try {
        console.log(`User ${socket.id} attempting to join room: ${roomId}`);
        const roomExists = socket.adapter.rooms.has(roomId);

        if (roomExists) {
          socket.join(roomId);
          console.log(`User ${socket.id} joined room: ${roomId}`);

          // Notify the joining user
          socket.emit("join_the_user", { joinNewUserToRoomId: roomId });

          // Notify existing users in the room
          socket.to(roomId).emit("new-user-connected", { newlyJoinUser: socket.id });

          // Emit updated participant count to all in the room
          const socketsInRoom = await socketIO.in(roomId).allSockets();
          socketIO.to(roomId).emit("participant-count", { count: socketsInRoom.size });
          console.log(`Room ${roomId} now has ${socketsInRoom.size} participants`);
        } else {
          console.log(`Room not found: ${roomId}`);
          socket.emit("room_not_found", { roomId });
        }
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Offer
    socket.on("send-offer", ({ offer, newlyJoinUser }) => {
      const alreadyJoinedUser = socket.id;
      socket.to(newlyJoinUser).emit("receive-offer", { offer, alreadyJoinedUser });
    });

    // Answer
    socket.on("send-answer", ({ answer, alreadyJoinedUser }) => {
      const newlyJoinUser = socket.id;
      socket.to(alreadyJoinedUser).emit("receive-answer", { answer, newlyJoinUser });
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

    // Handle disconnection
    socket.on("disconnect", async (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      const rooms = [...socket.rooms].filter((r) => r !== socket.id);

      for (const roomId of rooms) {
        socket.to(roomId).emit("user-disconnected", socket.id);
        const socketsInRoom = await socketIO.in(roomId).allSockets();
        socketIO.to(roomId).emit("participant-count", { count: socketsInRoom.size });
        console.log(`Room ${roomId} now has ${socketsInRoom.size} participants after disconnect`);
      }
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for client ${socket.id}:`, error);
    });
  });

  return socketIO;
};

module.exports = initializeSocket;
