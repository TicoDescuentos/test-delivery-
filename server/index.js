const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const AuthRoutes = require("./routes/auth");
const ParcelRoutes = require("./routes/percel");
const RouteRoutes = require("./routes/route");  // Importar las rutas del "route"

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(errorHandler);

const BaseUrl = "/api/v1";
app.use(`${BaseUrl}/auth`, AuthRoutes);
app.use(`${BaseUrl}/percel`, ParcelRoutes);
app.use(`${BaseUrl}/route`, RouteRoutes);  // Añadir las rutas del "route"

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to backend" });
});

const Port = process.env.PORT || 5000;

async function connectToDatabaseAndStartServer() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully.");

    app.listen(Port, () => {
      console.log(`Server Running on port ${Port}`);
    });

  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

connectToDatabaseAndStartServer();
