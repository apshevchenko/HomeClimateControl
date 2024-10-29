import React, { useState, useEffect } from "react";
import "./TemperatureDisplay.css";

const TemperatureDisplay = () => {
    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("wss://homeclimatecontrol-production.up.railway.app/");

        socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.temperature !== undefined) {
                setTemperature(data.temperature);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.reason}`);
        };


        return () => {
            socket.close();
        };
    }, []);

    // Функция для вычисления цвета на основе температуры
    const getBackgroundColor = (temp) => {
        const maxTemp = 39;
        const minTemp = 0;

        // Ограничиваем температуру в пределах от 0 до 39
        const clampedTemp = Math.max(minTemp, Math.min(temp, maxTemp));

        // Вычисляем процентное значение температуры от minTemp до maxTemp
        const percentage = (clampedTemp - minTemp) / (maxTemp - minTemp);

        // Интерполяция цветов от темно-синего к темно-красному
        const red = Math.round(percentage * 255);
        const green = 0;
        const blue = Math.round((1 - percentage) * 255);

        return `rgb(${red}, ${green}, ${blue})`;
    };

    return (
        <div
            className="temperature-display"
            style={{
                backgroundColor: temperature !== null ? getBackgroundColor(temperature) : "gray",
            }}
        >
            <h1>{temperature !== null ? `${temperature.toFixed(1)}°C` : "Loading..."}</h1>
        </div>
    );
};

export default TemperatureDisplay;