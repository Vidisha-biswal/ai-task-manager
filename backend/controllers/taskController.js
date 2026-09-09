const Task =
  require("../models/Task");

const {
  createNotification
} =
  require("./notificationController");


/*
 * =========================================================
 * CREATE TASK
 * =========================================================
 */

const createTask = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      priority,
      dueDate
    } = req.body;


    /*
     * TITLE VALIDATION
     */

    if (
      !title ||
      !title.trim()
    ) {
      return res.status(400).json({
        message:
          "Task title is required"
      });
    }


    /*
     * PRIORITY VALIDATION
     */

    const allowedPriorities = [
      "low",
      "medium",
      "high"
    ];

    const finalPriority =
      priority &&
      allowedPriorities.includes(
        priority.toLowerCase()
      )
        ? priority.toLowerCase()
        : "medium";


    /*
     * CREATE TASK
     */

    const task =
      await Task.create({
        user: req.user._id,
        title: title.trim(),
        description:
          description
            ? description.trim()
            : "",
        priority:
          finalPriority,
        dueDate:
          dueDate || null
      });


    /*
     * CREATE NOTIFICATION
     */

    await createNotification({
      user: req.user._id,
      type: "task-created",
      title: "Task created",
      message:
        `"${task.title}" was added to your tasks.`,
      task: task._id
    });


    return res
      .status(201)
      .json(task);

  } catch (error) {

    console.error(
      "Create task error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
    });
  }
};


/*
 * =========================================================
 * GET TASKS
 * =========================================================
 */

const getTasks = async (
  req,
  res
) => {
  try {

    const tasks =
      await Task.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });


    return res.json(tasks);

  } catch (error) {

    console.error(
      "Get tasks error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
    });
  }
};


/*
 * =========================================================
 * GET TASK BY ID
 * =========================================================
 */

const getTaskById = async (
  req,
  res
) => {
  try {

    const task =
      await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });


    if (!task) {
      return res.status(404).json({
        message:
          "Task not found"
      });
    }


    return res.json(task);

  } catch (error) {

    console.error(
      "Get task error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
    });
  }
};


/*
 * =========================================================
 * UPDATE TASK
 * =========================================================
 */

const updateTask = async (
  req,
  res
) => {
  try {

    const task =
      await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });


    if (!task) {
      return res.status(404).json({
        message:
          "Task not found"
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
     * KEEP ORIGINAL STATUS
     *
     * Needed to determine whether
     * the task has just been completed.
     */

    const previousStatus =
      task.status;


    /*
     * TITLE
     */

    if (
      title !== undefined
    ) {

      if (!title.trim()) {
        return res.status(400).json({
          message:
            "Task title cannot be empty"
        });
      }

      task.title =
        title.trim();
    }


    /*
     * DESCRIPTION
     */

    if (
      description !== undefined
    ) {

      task.description =
        description
          ? description.trim()
          : "";
    }


    /*
     * PRIORITY
     */

    if (
      priority !== undefined
    ) {

      const allowedPriorities = [
        "low",
        "medium",
        "high"
      ];

      const normalizedPriority =
        priority.toLowerCase();


      if (
        !allowedPriorities.includes(
          normalizedPriority
        )
      ) {
        return res.status(400).json({
          message:
            "Priority must be low, medium, or high"
        });
      }


      task.priority =
        normalizedPriority;
    }


    /*
     * DUE DATE
     */

    if (
      dueDate !== undefined
    ) {

      task.dueDate =
        dueDate || null;
    }


    /*
     * STATUS
     */

    if (
      status !== undefined
    ) {

      const allowedStatuses = [
        "pending",
        "in-progress",
        "completed"
      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Status must be pending, in-progress, or completed"
        });
      }


      task.status =
        status;


      /*
       * COMPLETION TIMESTAMP
       */

      if (
        status === "completed"
      ) {

        if (!task.completedAt) {
          task.completedAt =
            new Date();
        }

      } else {

        task.completedAt =
          null;
      }
    }


    /*
     * SAVE UPDATED TASK
     */

    const updatedTask =
      await task.save();


    /*
     * COMPLETION NOTIFICATION
     *
     * Only notify when the task
     * changes from a non-completed
     * state to completed.
     */

    if (
      previousStatus !== "completed" &&
      updatedTask.status === "completed"
    ) {

      await createNotification({
        user: req.user._id,
        type: "task-completed",
        title: "Task completed",
        message:
          `Great job! "${updatedTask.title}" has been completed.`,
        task: updatedTask._id
      });
    }


    return res.json(
      updatedTask
    );

  } catch (error) {

    console.error(
      "Update task error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
    });
  }
};


/*
 * =========================================================
 * DELETE TASK
 * =========================================================
 */

const deleteTask = async (
  req,
  res
) => {
  try {

    const task =
      await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });


    if (!task) {
      return res.status(404).json({
        message:
          "Task not found"
      });
    }


    await task.deleteOne();


    return res.json({
      message:
        "Task deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete task error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error: " +
        error.message
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