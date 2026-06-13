const model = require("../services/aiServices");

const generatePriority = async (req,res) => {
  try {

    const { task } = req.body;

    const prompt = `
You are a task prioritization assistant.

Task:
${task}

Return ONLY one word:

high
medium
low
`;

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const priority =
      response.text().trim();

    res.json({
      priority
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

const generateDailyPlan = async (req,res) => {

  try {

    const { tasks } = req.body;

    const prompt = `
Create an optimized daily schedule.

Tasks:

${tasks.join("\n")}

Return a detailed plan with time blocks.
`;

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const plan =
      response.text();

    res.json({
      plan
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  generatePriority,
  generateDailyPlan
};