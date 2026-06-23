import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskApi";
import { generatePriority } from "../api/aiApi";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    
    const [currentView, setCurrentView] = useState("form");

    const fetchTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to load tasks stack:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (taskData) => {
        try {
             const priorityRes = await generatePriority({ task: taskData.title });
            const calculatedPriority = priorityRes?.data?.priority || "medium";

            await createTask({
                ...taskData,
                priority: calculatedPriority
            });

            fetchTasks();
            setCurrentView("list");  
        } catch (error) {
            console.error("Task append failed:", error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error("Delete call aborted:", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTask(id, { status: newStatus });
            fetchTasks();  
        } catch (error) {
            console.error("Status update aborted:", error);
        }
    };

    return (
        <div style={dashStyles.container}>
            <Navbar currentView={currentView} setCurrentView={setCurrentView} />

            <div style={dashStyles.contentWrapper}>
                {currentView === "form" ? (
                    <TaskForm onAddTask={handleAddTask} />
                ) : (
                    <TaskList 
                        tasks={tasks} 
                        onDelete={handleDeleteTask} 
                        onStatusChange={handleStatusChange} 
                    />
                )}
            </div>
        </div>
    );
}

const dashStyles = {
    container: {
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        width: "100vw",
        color: "#ffffff",
        fontFamily: "'Segoe UI', Roboto, sans-serif"
    },
    contentWrapper: {
        padding: "40px max(4%, 20px)",
        maxWidth: "1200px",
        margin: "0 auto"
    }
};

export default Dashboard;
