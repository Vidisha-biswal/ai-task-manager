require("dotenv").config();

const express=require('express');
const cors=require('cors');

const connectDB=require('./config/db');
const {errorHandler}=require('./middleware/errorMiddleware');
const app=express();

connectDB();

app.use(cors());
        
app.use(express.json());

app.use("/api/auth",require('./routes/authRoutes'));

app.get("/",(req,res)=>{
    res.send("API is running");
});

app.use("/api/tasks", require('./routes/taskRoutes'));

app.use(errorHandler);

app.use("/api/ai",require('./routes/aiRoutes'));
const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});