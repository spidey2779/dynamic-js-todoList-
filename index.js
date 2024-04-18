import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/router/user.routes.js";
import connectToMongoDB from "./src/db/connectToMongoDB.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the 'public' directory inside the 'src' directory
app.use(express.static(path.join(__dirname, "src", "public")));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    // Check if the user is authenticated (logged in)
    if (!req.cookies.jwt) {
      // If not authenticated, serve the login page
      console.log("home route: Not authenticated");
      return res.sendFile(path.join(__dirname, "src", "public", "login.html"));
    }
    // If authenticated, redirect to the todo page or any other authenticated route
    console.log("home route: Authenticated");
    res.redirect("/api/todo"); // Redirect to the todo page or any other authenticated route
  });
app.get("/api/todo", (req, res) => {
  console.log("todo route");
  return res.sendFile(path.join(__dirname, "src", "public", "index.html"));
});
app.use("/api/user", router);

app.use((req, res, next) => {
  // Check if the request path starts with '/api'
  if (req.path.startsWith("/api")) {
    // If it starts with '/api', continue to the next middleware
    return next();
  }

  // Redirect to the login page for any other unmatched routes
  res.redirect("/");
});

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running in port ${PORT}`);
});
