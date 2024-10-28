const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let currentTemperature = null;

// Настроим WebSocket соединение
wss.on("connection", (ws) => {
    console.log("Client connected via WebSocket");

    ws.on("message", (message) => {
        try {
            const temperatureData = JSON.parse(message);
            if (temperatureData.temperature !== undefined) {
                currentTemperature = temperatureData.temperature;
                console.log("Temperature updated:", currentTemperature);

                // Отправка температуры всем подключенным клиентам React
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ temperature: currentTemperature }));
                    }
                });
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// REST API для получения текущей температуры
app.get("/api/temperature", (req, res) => {
    if (currentTemperature !== null) {
        res.json({ temperature: currentTemperature });
    } else {
        res.status(503).json({ error: "Temperature data is not available" });
    }
});

// Обслуживание статических файлов React из папки client/build
app.use(express.static(path.join(__dirname, "client", "build")));

// Обработка всех остальных маршрутов для React (SPA)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
