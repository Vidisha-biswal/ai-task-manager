const Notification = require("../models/Notification");


/*
 * =========================================================
 * CREATE NOTIFICATION
 * =========================================================
 */

const createNotification = async ({
  user,
  type,
  title,
  message,
  task = null
}) => {
  try {
    return await Notification.create({
      user,
      type,
      title,
      message,
      task
    });
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    return null;
  }
};


/*
 * =========================================================
 * GENERATE DATE-BASED NOTIFICATIONS
 * =========================================================
 *
 * Due soon:
 * Task is due within the next 24 hours.
 *
 * Overdue:
 * Task due date has already passed.
 *
 * We check existing notifications first
 * so refreshing the dashboard does not
 * create duplicate notifications.
 */

const generateTaskDateNotifications = async (
  userId,
  tasks
) => {
  const now = new Date();

  const twentyFourHoursFromNow =
    new Date(
      now.getTime() +
        24 * 60 * 60 * 1000
    );

  for (const task of tasks) {

    if (
      !task.dueDate ||
      task.status === "completed"
    ) {
      continue;
    }

    const dueDate =
      new Date(task.dueDate);

    /*
     * INVALID DATE
     */

    if (
      Number.isNaN(
        dueDate.getTime()
      )
    ) {
      continue;
    }


    /*
     * OVERDUE
     */

    if (dueDate < now) {

      const existing =
        await Notification.findOne({
          user: userId,
          task: task._id,
          type: "task-overdue"
        });

      if (!existing) {
        await createNotification({
          user: userId,
          type: "task-overdue",
          title: "Task overdue",
          message:
            `"${task.title}" is overdue.`,
          task: task._id
        });
      }

      continue;
    }


    /*
     * DUE SOON
     */

    if (
      dueDate >= now &&
      dueDate <= twentyFourHoursFromNow
    ) {

      const existing =
        await Notification.findOne({
          user: userId,
          task: task._id,
          type: "task-due-soon"
        });

      if (!existing) {
        await createNotification({
          user: userId,
          type: "task-due-soon",
          title: "Task due soon",
          message:
            `"${task.title}" is due within 24 hours.`,
          task: task._id
        });
      }
    }
  }
};


/*
 * =========================================================
 * GET NOTIFICATIONS
 * =========================================================
 */

const getNotifications = async (
  req,
  res
) => {
  try {

    const Task =
      require("../models/Task");

    const tasks =
      await Task.find({
        user: req.user._id,
        status: {
          $ne: "completed"
        },
        dueDate: {
          $ne: null
        }
      }).select(
        "_id title status dueDate"
      );

    /*
     * Generate due-soon / overdue
     * notifications before returning
     * the notification list.
     */

    await generateTaskDateNotifications(
      req.user._id,
      tasks
    );


    const notifications =
      await Notification.find({
        user: req.user._id
      })
        .sort({
          createdAt: -1
        })
        .limit(50)
        .populate(
          "task",
          "title status dueDate"
        );


    const unreadCount =
      await Notification.countDocuments({
        user: req.user._id,
        readAt: null
      });


    return res.json({
      notifications,
      unreadCount
    });

  } catch (error) {

    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load notifications."
    });
  }
};


/*
 * =========================================================
 * MARK ONE NOTIFICATION AS READ
 * =========================================================
 */

const markNotificationAsRead = async (
  req,
  res
) => {
  try {

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user._id
      });

    if (!notification) {
      return res.status(404).json({
        message:
          "Notification not found."
      });
    }


    if (!notification.readAt) {
      notification.readAt =
        new Date();

      await notification.save();
    }


    return res.json({
      message:
        "Notification marked as read.",
      notification
    });

  } catch (error) {

    console.error(
      "Mark notification as read error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update notification."
    });
  }
};


/*
 * =========================================================
 * MARK ALL NOTIFICATIONS AS READ
 * =========================================================
 */

const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {

    await Notification.updateMany(
      {
        user: req.user._id,
        readAt: null
      },
      {
        $set: {
          readAt: new Date()
        }
      }
    );


    return res.json({
      message:
        "All notifications marked as read."
    });

  } catch (error) {

    console.error(
      "Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update notifications."
    });
  }
};


module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};