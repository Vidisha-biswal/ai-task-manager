 import { useState } from "react";

function TaskForm({ onAddTask }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);  

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        await onAddTask({ title, description, dueDate });
        setIsLoading(false);

        setTitle("");
        setDescription("");
        setDueDate("");
    };

    return (
        <div style={formStyles.card}>
            <h2 style={formStyles.heading}>✨ Create Intelligent Task</h2>
            <form onSubmit={handleSubmit} style={formStyles.form}>
                <label style={formStyles.label}>Task Title</label>
                <input
                    type="text"
                    placeholder="What needs to be done? (e.g. Prep for Microsoft interview)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={formStyles.input}
                    required
                />

                <label style={formStyles.label}>Detailed Description</label>
                <textarea
                    placeholder="Add extra task requirements context..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...formStyles.input, minHeight: "100px", resize: "vertical" }}
                />

                <label style={formStyles.label}>Target Deadline</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={formStyles.input}
                />

                <button type="submit" disabled={isLoading} style={formStyles.button}>
                    {isLoading ? "🤖 AI Analyzing Priority..." : "Save Workspace Task"}
                </button>
            </form>
        </div>
    );
}

const formStyles = {
    card: {
        backgroundColor: "#1e293b",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #334155",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxWidth: "600px",
        margin: "0 auto"
    },
    heading: {
        color: "#ffffff",
        fontSize: "22px",
        marginBottom: "20px",
        fontWeight: "600"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },
    label: {
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "-4px",
        textAlign: "left"
    },
    input: {
        padding: "12px 14px",
        borderRadius: "6px",
        border: "1px solid #334155",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontSize: "15px",
        outline: "none"
    },
    button: {
        padding: "14px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
        transition: "background 0.2s"
    }
};

export default TaskForm;
