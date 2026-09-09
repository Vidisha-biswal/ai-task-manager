const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: [
        "task-created",
        "task-completed",
        "task-due-soon",
        "task-overdue"
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null
    },

    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


/*
 * USER NOTIFICATION INDEX
 *
 * Notifications are primarily
 * queried by user and newest first.
 */

notificationSchema.index({
  user: 1,
  createdAt: -1
});


/*
 * UNREAD NOTIFICATION INDEX
 */

notificationSchema.index({
  user: 1,
  readAt: 1
});


module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );