const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const cors = require('cors');
const { default: axios } = require("axios");

const app = express();
const PORT = 8000;
const API_BASE_URL = "http://localhost:8080/api/leaderboard";

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(cors());

// Proxy API to fetch leaderboard data
app.get("/leaderboard/top", async (req, res) => {
    try {
        console.log("Fetching leaderboard data...");
        const response = await axios.get(`${API_BASE_URL}/top`).catch(err => {
            throw new Error("Fetch request failed: " + err.message);
        });
        console.log("response", response.data);
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        //const data = await response.json();
        //console.log("myData ===== >",data);
        return res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching leaderboard data" });
    }
});

// Proxy API to fetch user rank
app.get("/leaderboard/rank/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(`${API_BASE_URL}/rank/${userId}`);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid JSON response");
        }
        console.log("response", response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user rank" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
