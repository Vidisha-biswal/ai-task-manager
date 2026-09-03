const express = require("express");
const { body } = require("express-validator");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const { protect } =
  require("../middleware/authMiddleware");

const router = express.Router();


/*
 * CREATE TASK
 */

router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("priority")
      .optional()
      .isIn([
        "low",
        "medium",
        "high"
      ])
      .withMessage(
        "Priority must be low, medium, or high"
      ),

    body("dueDate")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage(
        "Due date must be a valid date"
      )
  ],
  createTask
);


/*
 * GET ALL TASKS
 */

router.get(
  "/",
  protect,
  getTasks
);


/*
 * GET SINGLE TASK
 */

router.get(
  "/:id",
  protect,
  getTaskById
);


/*
 * UPDATE TASK
 */

router.put(
  "/:id",
  protect,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage(
        "Title cannot be empty"
      ),

    body("priority")
      .optional()
      .isIn([
        "low",
        "medium",
        "high"
      ])
      .withMessage(
        "Priority must be low, medium, or high"
      ),

    body("status")
      .optional()
      .isIn([
        "pending",
        "in-progress",
        "completed"
      ])
      .withMessage(
        "Invalid task status"
      ),

    body("dueDate")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage(
        "Due date must be a valid date"
      )
  ],
  updateTask
);


/*
 * DELETE TASK
 */

router.delete(
  "/:id",
  protect,
  deleteTask
);


module.exports = router;