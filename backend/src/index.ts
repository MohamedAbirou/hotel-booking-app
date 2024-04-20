import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";

// connect to mongodb test database
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .catch((error) => {
    console.log(error);
  });

// Initialize the express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS (Cross-Origin Resource Sharing)
const corsOptions = {
  origin: function (
    origin: string | undefined = process.env.FRONTEND_URL,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS! LOL!"));
    }
  }, // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the HTTP methods you want to allow
  optionsSuccessStatus: 204, // Set the response status for preflight requests to 204
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_PARSER_KEY));
app.use(
  session({
    name: "auth_cookie",
    secret: process.env.SESSION_SECRET_KEY as string,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(7000, () => {
  console.log("Server running on http://localhost:7000");
});
