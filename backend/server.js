require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');  

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

 app.use("/api/auth", require('./routes/authRoutes'));
app.use("/api/tasks", require('./routes/taskRoutes'));
app.use("/api/ai", require('./routes/aiRoutes'));

 app.use(express.static(path.join(__dirname, '../frontend/dist')));

 app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

 app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
