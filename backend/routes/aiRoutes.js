const express=require('express');
const router=express.Router();

const {generatePriority, generateDailyPlan}=require("../controllers/aiController");
const {protect}=require("../middleware/authMiddleware");

router.post("/priority", protect, generatePriority);
router.post("/daily-plan", protect, generateDailyPlan);

module.exports=router;