require("dotenv").config();
const express = require("express");
const cors = require("cors");
const transformRoutes = require("./routes/transform");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "PromptImage API", version: "1.0.0" });
});

// Routes
app.use("/transform", transformRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large",
      message: "Maximum file size is 5MB",
    });
  }

  if (err.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only JPEG, PNG, WebP, TIFF, and GIF images are allowed",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 PromptImage API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
