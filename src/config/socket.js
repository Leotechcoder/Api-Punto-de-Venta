import { Server } from "socket.io";

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_URL || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io no inicializado");
  }
  return io;
}
