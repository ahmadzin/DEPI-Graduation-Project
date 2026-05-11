let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      },
    });

    io.on("connection", (socket) => {
      
      socket.on("join", (userId) => {
        socket.join(userId);
      });

      // انضمام المدير لغرفة المطعم
      socket.on("joinRestaurant", (restaurantId) => {
        socket.join(restaurantId);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io لم يتم تهيئته بعد!");
    }
    return io;
  },
};
