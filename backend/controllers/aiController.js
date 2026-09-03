const {
  model,
  plannerModel
} = require("../services/aiServices");


/*
 * ================================
 * GENERATE AI PRIORITY
 * ================================
 */

const generatePriority = async (
  req,
  res,
  next
) => {

  try {

    const { task } = req.body;

    if (!task) {

      return res.status(400).json({
        message:
          "Task data is required."
      });

    }

    const prompt = `
You are an AI task prioritization assistant.

Analyze the following task.

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

Do not return an explanation.
Do not return JSON.
Do not return Markdown.
`;

    const result =
      await model.generateContent(
        prompt
      );

    const text =
      result.response
        .text()
        .trim()
        .toLowerCase();

    let priority = "medium";

    if (text.includes("high")) {

      priority = "high";

    } else if (
      text.includes("low")
    ) {

      priority = "low";

    }

    return res.status(200).json({
      priority
    });

  } catch (error) {

    console.error(
      "AI PRIORITY ERROR:",
      error
    );

    next(error);
  }
};


/*
 * ================================
 * GENERATE DAILY PLAN
 * ================================
 */

const generateDailyPlan = async (
  req,
  res,
  next
) => {

  try {

    const {
      tasks,
      goal
    } = req.body;


    /*
     * ============================
     * VALIDATE REQUEST
     * ============================
     */

    if (!Array.isArray(tasks)) {

      return res.status(400).json({
        message:
          "Tasks must be an array."
      });

    }

    if (tasks.length === 0) {

      return res.status(400).json({
        message:
          "No tasks available for planning."
      });

    }


    /*
     * ============================
     * REMOVE COMPLETED TASKS
     * ============================
     */

    const availableTasks =
      tasks.filter(
        (task) =>
          task.status !==
          "completed"
      );


    if (
      availableTasks.length === 0
    ) {

      return res.status(200).json({
        schedule: []
      });

    }


    /*
     * ============================
     * NORMALIZE TASK DATA
     * ============================
     *
     * Frontend sends:
     *
     * id
     *
     * Backend previously expected:
     *
     * _id
     *
     * We support both.
     */

    const normalizedTasks =
      availableTasks.map(
        (task) => ({

          id:
            task.id ||
            task._id,

          title:
            task.title,

          description:
            task.description ||
            "",

          priority:
            task.priority ||
            "low",

          status:
            task.status ||
            "pending",

          dueDate:
            task.dueDate ||
            null

        })
      );


    /*
     * ============================
     * CREATE AI TASK INPUT
     * ============================
     */

    const taskText =
      normalizedTasks
        .map((task) => {

          return `
TASK ID: ${task.id}
TITLE: ${task.title}
DESCRIPTION: ${
            task.description ||
            "No description"
          }
PRIORITY: ${
            task.priority
          }
STATUS: ${
            task.status
          }
DUE DATE: ${
            task.dueDate ||
            "No deadline"
          }
`;

        })
        .join(
          "\n----------------------\n"
        );


    /*
     * ============================
     * TODAY'S DATE
     * ============================
     */

    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    /*
     * ============================
     * AI PLANNER PROMPT
     * ============================
     */

    const prompt = `
You are an AI daily task planner.

Today is ${today}.

The user's goal is:

${
      goal ||
      "Complete the most important tasks today."
    }

The user has the following EXISTING tasks:

${taskText}

STRICT RULES:

1. ONLY use the tasks provided above.
2. NEVER create a new task.
3. NEVER invent a task.
4. NEVER add exercise.
5. NEVER add meals.
6. NEVER add sleep.
7. NEVER add breaks.
8. NEVER add generic productivity activities.
9. NEVER create a productivity template.
10. NEVER write an essay.
11. Do not schedule completed tasks.
12. High priority tasks should generally be scheduled first.
13. In-progress tasks should generally be considered before pending tasks of the same priority.
14. Consider the user's goal.
15. Consider task deadlines.
16. Each task can appear only once.
17. Use the exact TASK ID supplied above.
18. Use the exact TASK TITLE supplied above.
19. Create a practical schedule only for today.
20. Return only tasks that actually exist in the supplied list.

For each selected task, provide:

- taskId
- title
- priority
- time
- reason

The "time" must be a realistic time range.

The "reason" must be a short explanation.

Return ONLY valid JSON in exactly this structure:

{
  "schedule": [
    {
      "taskId": "TASK ID",
      "title": "EXACT TASK TITLE",
      "priority": "high",
      "time": "9:00 AM - 10:30 AM",
      "reason": "Short reason why this task is scheduled."
    }
  ]
}
`;


    /*
     * ============================
     * DEBUG LOG
     * ============================
     */

    console.log(
      "========== AI PLANNER REQUEST =========="
    );

    console.log(
      "Goal:",
      goal
    );

    console.log(
      "Tasks:",
      JSON.stringify(
        normalizedTasks,
        null,
        2
      )
    );


    /*
     * ============================
     * CALL GEMINI
     * ============================
     */

    const result =
      await plannerModel.generateContent(
        prompt
      );


    const text =
      result.response
        .text()
        .trim();


    /*
     * ============================
     * DEBUG AI RESPONSE
     * ============================
     */

    console.log(
      "========== AI RAW RESPONSE =========="
    );

    console.log(text);


    /*
     * ============================
     * PARSE JSON
     * ============================
     */

    let parsed;

    try {

      const cleaned =
        text
          .replace(
            /```json/gi,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      parsed =
        JSON.parse(cleaned);

    } catch (error) {

      console.error(
        "JSON PARSE ERROR:",
        error
      );

      console.error(
        "RAW GEMINI RESPONSE:",
        text
      );

      return res.status(500).json({
        message:
          "AI returned an invalid schedule."
      });

    }


    /*
     * ============================
     * VALIDATE SCHEDULE
     * ============================
     */

    if (
      !parsed ||
      !Array.isArray(
        parsed.schedule
      )
    ) {

      return res.status(500).json({
        message:
          "AI returned an invalid schedule."
      });

    }


    /*
     * ============================
     * VALIDATE TASKS
     * ============================
     */

    const validTasks =
      parsed.schedule
        .map((item) => {

          const originalTask =
            normalizedTasks.find(
              (task) =>
                String(task.id) ===
                String(item.taskId)
            );


          /*
           * Ignore AI-created/
           * invalid tasks.
           */

          if (!originalTask) {

            console.warn(
              "Ignoring invalid AI task:",
              item
            );

            return null;
          }


          return {

            taskId:
              String(
                originalTask.id
              ),

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
              "Today",

            reason:
              item.reason ||
              "Prioritized for today's work."

          };

        })
        .filter(Boolean);


    /*
     * ============================
     * RETURN FINAL SCHEDULE
     * ============================
     */

    return res.status(200).json({
      schedule: validTasks
    });

  } catch (error) {

    console.error(
      "DAILY PLANNER ERROR:",
      error
    );

    next(error);
  }
};


/*
 * ================================
 * GENERATE AI INSIGHTS
 * ================================
 */

const generateInsights = async (
  req,
  res,
  next
) => {

  try {

    const { tasks } =
      req.body;


    if (!Array.isArray(tasks)) {

      return res.status(400).json({
        message:
          "Tasks must be an array."
      });

    }


    const prompt = `
Analyze these tasks and provide concise productivity advice.

Tasks:

${JSON.stringify(
      tasks,
      null,
      2
    )}

Focus on:

- workload
- priorities
- completion progress
- overdue or urgent work
- practical next steps

Keep the advice concise and useful.
`;


    const result =
      await model.generateContent(
        prompt
      );


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