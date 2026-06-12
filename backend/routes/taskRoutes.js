const express=require("express");
const router=express.Router();
const {body}=require("express-validator");
const {
    createTask, 
    getTasks, 
    getTaskById, 
    updateTask,
    deleteTask
}=require("../controllers/taskController");

const {protect}=require("../middleware/authMiddleware");

router.post("/",protect,[
    body("title")
    .notEmpty()
    .withMessage("Title is required")
],createTask);
router.get("/",protect,getTasks);
router.get("/:id",protect,getTaskById);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,deleteTask);

module.exports=router;