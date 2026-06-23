const express=require('express');
const router=express.Router();

const {generatePriority, generateDailyPlan,generateInsights}=require("../controllers/aiController");
const {protect}=require("../middleware/authMiddleware");

router.post("/priority", protect, generatePriority);
router.post("/planner", protect, generateDailyPlan);
router.post(
 "/insights",
 protect,
 generateInsights
);
module.exports=router;