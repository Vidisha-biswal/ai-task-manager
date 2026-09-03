const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high"
      ],
      default: "medium"
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in-progress",
        "completed"
      ],
      default: "pending"
    },

    dueDate: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


taskSchema.index({
  user: 1,
  createdAt: -1
});


module.exports =
  mongoose.model("Task", taskSchema);