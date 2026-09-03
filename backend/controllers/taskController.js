const mongoose = require("mongoose");
const Task = require("../models/Task");

/*
 * CREATE TASK
 */
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate
    } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority || "medium",
      dueDate: dueDate || null
    });

    return res.status(201).json(task);

  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Unable to create task."
    });
  }
};


/*
 * GET ALL TASKS
 */
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .lean();

    return res.status(200).json(tasks);

  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Unable to fetch tasks."
    });
  }
};


/*
 * GET SINGLE TASK
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    /*
     * Prevent MongoDB CastError for invalid IDs.
     */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    return res.status(200).json(task);

  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Unable to fetch task."
    });
  }
};


/*
 * UPDATE TASK
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    /*
     * Validate MongoDB ObjectId.
     */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    const {
      title,
      description,
      priority,
      dueDate,
      status
    } = req.body;


    /*
     * TITLE
     */
    if (title !== undefined) {
      task.title = title.trim();
    }


    /*
     * DESCRIPTION
     */
    if (description !== undefined) {
      task.description = description.trim();
    }


    /*
     * PRIORITY
     */
    if (priority !== undefined) {
      task.priority = priority;
    }


    /*
     * DUE DATE
     */
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }


    /*
     * STATUS
     */
    if (status !== undefined) {
      task.status = status;

      if (status === "completed") {
        /*
         * Only set completedAt when task becomes completed.
         */
        if (!task.completedAt) {
          task.completedAt = new Date();
        }
      } else {
        /*
         * If task is moved back from completed,
         * remove completion timestamp.
         */
        task.completedAt = null;
      }
    }


    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);

  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Unable to update task."
    });
  }
};


/*
 * DELETE TASK
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    /*
     * Validate MongoDB ObjectId.
     */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      message: "Task deleted successfully."
    });

  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Unable to delete task."
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};