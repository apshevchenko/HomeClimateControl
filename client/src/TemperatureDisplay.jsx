import React, { useState, useEffect } from "react";
import "./TemperatureDisplay.css";

const TemperatureDisplay = () => {
    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.temperature !== undefined) {
                setTemperature(data.temperature);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const getBackgroundColor = (temp) => {
        const normalizedTemp = Math.min(Math.max((temp + 10) / 40, 0), 1);
        const red = Math.floor(255 * normalizedTemp);
        const blue = Math.floor(255 * (1 - normalizedTemp));
        return `rgb(${red}, 0, ${blue})`;
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