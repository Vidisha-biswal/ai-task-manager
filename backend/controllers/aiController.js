 
const model = require("../services/aiServices");

const generateInsights = async (req, res) => {
  try {
    const { tasks } = req.body;
    
     if (!tasks || tasks.length === 0) {
        return res.json({ insights: "No tasks available to analyze yet. Add tasks to see insights!" });
    }

    const prompt = `Analyze these tasks and provide productivity advice.\n\n${JSON.stringify(tasks)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ insights: response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generatePriority = async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ message: "Task title is required" });
    }

    const prompt = `You are a task prioritization assistant. Task:\n${task}\n\nReturn ONLY one word: high, medium, or low.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const priority = response.text().trim().toLowerCase();

    res.json({ priority });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const generateDailyPlan = async (req, res) => {
  try {
    const { tasks } = req.body;

     if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ message: "An array of task strings is required." });
    }

    const prompt = `Create an optimized daily schedule.\n\nTasks:\n\n${tasks.join("\n")}\n\nReturn a detailed plan with hourly time blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plan = response.text();

    res.json({ plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generatePriority,
  generateDailyPlan,
  generateInsights
};
