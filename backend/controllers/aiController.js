const model = require("../services/aiServices");

const generatePriority = async (req, res, next) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({
        message: "Task data is required."
      });
    }

    const prompt = `
You are an AI task prioritization assistant.

Analyze the following task:

Title:
${task.title}

Description:
${task.description || "No description"}

Due Date:
${task.dueDate || "No due date"}

Return ONLY ONE WORD:

high
medium
low

Do not return any explanation.
Do not return JSON.
Do not return Markdown.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text().trim().toLowerCase();

    let priority = "medium";

    if (text.includes("high")) {
      priority = "high";
    } else if (text.includes("low")) {
      priority = "low";
    }

    return res.status(200).json({
      priority
    });
  } catch (error) {
    console.error("AI PRIORITY ERROR:", error);
    next(error);
  }
};


const generateDailyPlan = async (req, res, next) => {
  try {
    const { tasks, goal } = req.body;

    /*
     * ---------------------------------------------------------
     * VALIDATE INPUT
     * ---------------------------------------------------------
     */

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        message: "Tasks must be an array."
      });
    }

    if (tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks available for planning."
      });
    }

    if (!goal || !goal.trim()) {
      return res.status(400).json({
        message: "Today's goal is required."
      });
    }


    /*
     * ---------------------------------------------------------
     * ELIGIBLE EXISTING TASKS
     *
     * Only:
     * - pending / in-progress
     * - medium / high priority
     *
     * Never:
     * - completed
     * - low priority
     * ---------------------------------------------------------
     */

    const eligibleTasks = tasks.filter((task) => {
      const status =
        String(task.status || "pending").toLowerCase();

      const priority =
        String(task.priority || "low").toLowerCase();

      return (
        status !== "completed" &&
        (priority === "high" || priority === "medium")
      );
    });


    /*
     * ---------------------------------------------------------
     * NORMALIZE TASK DATA
     * ---------------------------------------------------------
     */

    const normalizedTasks = eligibleTasks.map((task) => ({
      taskId: String(task.id || task._id),
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      dueDate: task.dueDate || null
    }));


    /*
     * ---------------------------------------------------------
     * BUILD TASK INFORMATION FOR GEMINI
     * ---------------------------------------------------------
     */

    const taskText = normalizedTasks
      .map((task) => {
        return `
TASK ID: ${task.taskId}
TITLE: ${task.title}
DESCRIPTION: ${task.description || "No description"}
PRIORITY: ${task.priority}
STATUS: ${task.status}
DUE DATE: ${task.dueDate || "No deadline"}
`;
      })
      .join("\n----------------------\n");


    /*
     * ---------------------------------------------------------
     * AI PLANNER PROMPT
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     *
     * The user's goal is itself a schedule item.
     *
     * Example:
     *
     * Goal = "interview"
     *
     * This does NOT mean:
     * "Prepare for Microsoft interview tomorrow"
     *
     * unless that task is separately eligible.
     * ---------------------------------------------------------
     */

    const prompt = `
You are an AI daily task planner.

Today is ${new Date().toISOString().split("T")[0]}.

The user's main goal for today is:

"${goal.trim()}"

IMPORTANT MEANING OF THE GOAL:

The user's goal is itself a work activity that must appear
in today's schedule.

For example:

User goal:
"interview"

You MUST include:

"interview"

as a schedule item.

Do NOT assume that "interview" refers to any existing task.

For example, if an existing task is:

"Prepare for Microsoft interview tomorrow"

you must NOT treat the generic goal "interview" as referring
to that task.

The goal and existing tasks are separate schedule items.

------------------------------------------------------------

ELIGIBLE EXISTING TASKS:

Only the following existing tasks may be scheduled:

${taskText || "No additional eligible tasks."}

------------------------------------------------------------

STRICT RULES:

1. The user's goal MUST appear in the schedule.

2. Use the goal EXACTLY as provided:
"${goal.trim()}"

3. The goal is NOT an existing database task.

4. NEVER replace the user's goal with an existing task.

5. NEVER assume what the user's goal means beyond the exact
   text they entered.

6. ONLY schedule the existing tasks provided above.

7. NEVER create additional tasks.

8. NEVER invent activities.

9. NEVER schedule completed tasks.

10. NEVER schedule low-priority tasks.

11. Medium-priority tasks may be scheduled.

12. High-priority tasks may be scheduled.

13. In-progress tasks should generally be considered before
    pending tasks when their priority is the same.

14. High-priority tasks should generally come before
    medium-priority tasks.

15. Consider due dates when deciding the order.

16. Each existing task can appear at most once.

17. The user's goal should normally appear first because it is
    the primary objective for today.

18. Do not add meals.

19. Do not add exercise.

20. Do not add sleep.

21. Do not add breaks.

22. Do not add generic productivity activities.

23. Do not create a productivity template.

24. Do not write an essay.

25. Return ONLY JSON.

------------------------------------------------------------

RETURN EXACTLY THIS STRUCTURE:

{
  "schedule": [
    {
      "taskId": null,
      "title": "${goal.trim()}",
      "priority": "goal",
      "time": "9:00 AM - 11:00 AM",
      "reason": "Primary goal for today."
    },
    {
      "taskId": "EXISTING TASK ID",
      "title": "EXACT EXISTING TASK TITLE",
      "priority": "high",
      "time": "11:00 AM - 1:00 PM",
      "reason": "Short practical reason."
    }
  ]
}
`;


    console.log(
      "========== AI PLANNER REQUEST =========="
    );

    console.log("Goal:", goal);

    console.log(
      "Eligible Tasks:",
      JSON.stringify(
        normalizedTasks,
        null,
        2
      )
    );


    /*
     * ---------------------------------------------------------
     * GENERATE PLAN
     * ---------------------------------------------------------
     */

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text().trim();


    console.log(
      "========== AI RAW RESPONSE =========="
    );

    console.log(text);


    /*
     * ---------------------------------------------------------
     * PARSE AI RESPONSE
     * ---------------------------------------------------------
     */

    let parsed;

    try {
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);

    } catch (error) {

      console.error(
        "JSON PARSE ERROR:",
        error
      );

      console.error(
        "RAW RESPONSE:",
        text
      );

      return res.status(500).json({
        message:
          "AI returned an invalid schedule."
      });
    }


    if (
      !parsed.schedule ||
      !Array.isArray(parsed.schedule)
    ) {
      return res.status(500).json({
        message:
          "AI returned an invalid schedule."
      });
    }


    /*
     * ---------------------------------------------------------
     * VALIDATE AI SCHEDULE
     * ---------------------------------------------------------
     *
     * We do NOT blindly trust Gemini.
     *
     * The backend enforces our rules again.
     * ---------------------------------------------------------
     */

    const validSchedule = [];

    /*
     * First add the user's goal.
     *
     * This guarantees that the goal is always included,
     * even if Gemini accidentally forgets it.
     */

    const goalItem =
      parsed.schedule.find(
        (item) =>
          item.taskId === null ||
          item.taskId === undefined
      );

    validSchedule.push({
      taskId: null,
      title: goal.trim(),
      description: "",
      priority: "goal",
      status: "goal",
      dueDate: null,
      time:
        goalItem?.time ||
        "9:00 AM - 11:00 AM",
      reason:
        goalItem?.reason ||
        "Primary goal for today."
    });


    /*
     * Track tasks already scheduled.
     */

    const scheduledTaskIds =
      new Set();


    /*
     * Validate every AI-selected existing task.
     */

    parsed.schedule.forEach((item) => {

      if (
        item.taskId === null ||
        item.taskId === undefined
      ) {
        return;
      }

      const originalTask =
        normalizedTasks.find(
          (task) =>
            String(task.taskId) ===
            String(item.taskId)
        );

      /*
       * Ignore anything that isn't one of the
       * eligible existing tasks.
       */

      if (!originalTask) {
        return;
      }

      /*
       * Prevent duplicate tasks.
       */

      if (
        scheduledTaskIds.has(
          String(originalTask.taskId)
        )
      ) {
        return;
      }

      scheduledTaskIds.add(
        String(originalTask.taskId)
      );


      validSchedule.push({
        taskId:
          String(originalTask.taskId),

        title:
          originalTask.title,

        description:
          originalTask.description,

        priority:
          originalTask.priority,

        status:
          originalTask.status,

        dueDate:
          originalTask.dueDate,

        time:
          item.time ||
          "Time not specified",

        reason:
          item.reason ||
          "Prioritized for today's work."
      });

    });


    /*
     * ---------------------------------------------------------
     * RETURN FINAL SCHEDULE
     * ---------------------------------------------------------
     */

    return res.status(200).json({
      schedule: validSchedule
    });

  } catch (error) {

    console.error(
      "DAILY PLANNER ERROR:",
      error
    );

    next(error);
  }
};


const generateInsights = async (
  req,
  res,
  next
) => {
  try {

    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        message: "Tasks must be an array."
      });
    }

    const prompt = `
Analyze these tasks and provide concise productivity advice.

Tasks:

${JSON.stringify(tasks, null, 2)}

Focus on:

- workload
- priorities
- completion progress
- overdue or urgent work
- practical next steps

Keep the advice concise and useful.
`;

    const result =
      await model.generateContent(prompt);

    const insights =
      result.response.text();

    return res.status(200).json({
      insights
    });

  } catch (error) {

    console.error(
      "AI INSIGHTS ERROR:",
      error
    );

    next(error);
  }
};


module.exports = {
  generatePriority,
  generateDailyPlan,
  generateInsights
};