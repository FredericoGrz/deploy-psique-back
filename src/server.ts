import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import AppError from "./utils/AppError";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT || 3000;
const allowedOrigins = [process.env.FRONT_URL || ""];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(PORT, () => console.log("Running on port:", PORT));
