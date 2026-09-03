require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

/*
 * ================================
 * DATABASE
 * ================================
 */

connectDB();

/*
 * ================================
 * CORS
 * ================================
 */

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-task-manager-lemon-five.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    /*
     * Allow requests without an origin.
     *
     * This can be useful for tools such as
     * Postman or server-to-server requests.
     */

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(
        `CORS blocked for origin: ${origin}`
      )
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: true,

  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

/*
 * Explicitly handle browser preflight requests.
 */

app.options(
  /./,
  cors(corsOptions)
);

/*
 * ================================
 * BODY PARSER
 * ================================
 */

app.use(express.json());

/*
 * ================================
 * API ROUTES
 * ================================
 */

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

/*
 * ================================
 * ROOT
 * ================================
 */

app.get("/", (req, res) => {
  res.json({
    message:
      "AI Task Manager API Running"
  });
});

/*
 * ================================
 * ERROR HANDLER
 * ================================
 */

app.use(errorHandler);

/*
 * ================================
 * SERVER
 * ================================
 */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});