const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to the chat server!");
});

io.on("connection", (socket) => {
    console.log(`[${new Date().toLocaleString()}] User connected: ${socket.id}`);

    socket.on("sendMessage", async (data) => {
        console.log(`[${new Date().toLocaleString()}] Message received:`, data);

        try {
            const messageData = data;

            const response = await axios.post("http://localhost:3000/api/chats", messageData);

            io.emit("receiveMessage", { chatId: data.chatId, message: messageData });
            console.log("Message added successfully:", response.data);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error adding message:`, error);
        }
    });

    socket.on("sendGroupMessage", async (data) => {
        console.log(`[${new Date().toLocaleString()}] Group message received:`, data);

        try {
            io.emit("receiveGroupMessage", data);

            console.log("Group message broadcasted successfully:", data);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error sending group message:`, error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`[${new Date().toLocaleString()}] User disconnected: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`[${new Date().toLocaleString()}] Server running on port ${PORT}`);
});