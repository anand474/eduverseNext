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

// Add a route for the root path "/"
app.get("/", (req, res) => {
    res.send("Welcome to the chat server!");
});

// --- Socket.IO Connection ---
io.on("connection", (socket) => {
    console.log(`[${new Date().toLocaleString()}] User connected: ${socket.id}`);

    // Fetch chats from the API using GET request
    socket.on("getChats", async () => {
        try {
            const userId = socket.id;

            const response = await axios.get(`http://localhost:3000/api/chats?userId=${userId}`);
            const chats = response.data;

            console.log(`[${new Date().toLocaleString()}] Chat list sent to ${socket.id}`);
            socket.emit("chatsList", chats);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error fetching chats:`, error);
            socket.emit("error", "Failed to fetch chats");
        }
    });

    // Handle sending new messages via the API using POST request
    socket.on("sendMessage", async (data) => {
        console.log(`[${new Date().toLocaleString()}] Message received:`, data);

        try {
            const messageData = data;

            const response = await axios.post("http://localhost:3000/api/chats", messageData);

            const newMessage = {
                sender: data.sender,
                text: data.text,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                type: "sent",
            };

            io.emit("receiveMessage", { chatId: data.chatId, message: newMessage });
            console.log("Message added successfully:", response.data);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Error adding message:`, error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`[${new Date().toLocaleString()}] User disconnected: ${socket.id}`);
    });
});

// --- Start Server ---
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`[${new Date().toLocaleString()}] Server running on port ${PORT}`);
});
