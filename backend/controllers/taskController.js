const Task=require("../models/Task");

const createTask= async (req,res)=>{
    try{
        const{
            title, 
            description,
            priority,
            dueDate
        }=req.body;
        const task= await Task.create({
            user:req.user._id,
            title,
            description,
            priority,
            dueDate
        });
        res.status(201).json(task);
    }catch(error){
        res.status(500).json({
            message:"Server error: "+error.message
        });
    }
};

const getTasks= async(req,res)=>{
    try{
        const tasks=await Task.find({
            user:req.user._id
        }).sort({
            createdAt:-1
        });

        res.json(tasks);
    }catch(error){
        res.status(500).json({
            message:"Server error: "+error.message
        });
    }
}

const getTaskById= async(req,res)=>{
    try{
        const task= await Task.findOne({
            _id:req.params.id,
            user:req.user._id
        });

        if(!task ){
            return res.status(404).json({
                message:"Task not found"
            });
        }
        res.json(task);
    }catch(error){
        res.status(500).json({
            message:"Server error: "+error.message
        });
    }
}

const updateTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const {
      title,
      description,
      priority,
      dueDate,
      status
    } = req.body;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    if (status !== undefined) {

      task.status = status;

      if (status === "completed") {
        task.completedAt = new Date();
      }

      if (status !== "completed") {
        task.completedAt = null;
      }
    }

    const updatedTask = await task.save();

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: "Server error: " + error.message
    });

  }
};

const deleteTask= async(req,res)=>{
    try{
        const task=await Task.findOne({
            _id:req.params.id,
            user:req.user._id
        });

        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        await task.deleteOne();

        res.json({
            message:"Task deleted"
        });
    }catch(error){
        res.status(500).json({
            message:"Server error: "+error.message
        });
    }
}

module.exports={
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
}