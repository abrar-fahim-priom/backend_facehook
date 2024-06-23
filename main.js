const jsonServer = require("json-server");
const customRouter = require("./router");
const express = require("express");
const checkAuth = require("./middleware/checkAuth");
require("dotenv").config();
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("./database/db.json");

// CORS configuration
const corsOptions = {
  origin: "https://frontend-facehook-1.onrender.com/", // Your frontend origin
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and other credentials
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// /!\ Bind the router db to the app
app.db = router.db;

app.use(express.json());

// This middleware will add extra information before storing
app.use(checkAuth);

// CustomRoute Middleware to Handle Extra Routes
app.use("/", customRouter);

app.use(router);

// Error handle Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  res.status(500).json({
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
