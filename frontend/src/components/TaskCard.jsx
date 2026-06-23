 function TaskCard({ task, onDelete, onStatusChange }) {
     const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high": return { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", border: "#ef4444" };
            case "medium": return { bg: "rgba(234, 179, 8, 0.15)", text: "#facc15", border: "#eab308" };
            default: return { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "#22c55e" };
        }
    };

    const colors = getPriorityColor(task.priority);

    return (
        <div style={cardStyles.card}>
            <div style={cardStyles.header}>
                <h3 style={cardStyles.title}>{task.title}</h3>
                <span style={{
                    ...cardStyles.badge,
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border
                }}>
                    🤖 {task.priority || "low"}
                </span>
            </div>

            <p style={cardStyles.description}>{task.description || "No description provided."}</p>

            <div style={cardStyles.meta}>
                <span style={cardStyles.date}>
                    📅 Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                </span>
                
                <div style={cardStyles.actions}>
                    <select
                        value={task.status || "pending"}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        style={cardStyles.select}
                    >
                        <option value="pending" style={cardStyles.option}>Pending ⏳</option>
                        <option value="in-progress" style={cardStyles.option}>In Progress 🚀</option>
                        <option value="completed" style={cardStyles.option}>Completed ✅</option>
                    </select>

                    <button onClick={() => onDelete(task._id)} style={cardStyles.deleteBtn}>
                        Delete 🗑️
                    </button>
                </div>
            </div>
        </div>
    );
}

const cardStyles = {
    card: {
        backgroundColor: "#1e293b",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid #334155",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        marginBottom: "16px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        marginBottom: "12px"
    },
    title: {
        color: "#ffffff",
        margin: 0,
        fontSize: "18px",
        fontWeight: "600"
    },
    badge: {
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        border: "1px solid"
    },
    description: {
        color: "#94a3b8",
        fontSize: "14px",
        lineHeight: "1.5",
        marginBottom: "20px"
    },
    meta: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #334155",
        paddingTop: "14px",
        flexWrap: "wrap",
        gap: "10px"
    },
    date: {
        color: "#64748b",
        fontSize: "13px"
    },
    actions: {
        display: "flex",
        gap: "12px",
        alignItems: "center"
    },
    select: {
        backgroundColor: "#0f172a",
        color: "#ffffff",
        border: "1px solid #334155",
        padding: "6px 10px",
        borderRadius: "6px",
        outline: "none",
        cursor: "pointer"
    },
    option: {
        backgroundColor: "#1e293b",
        color: "#ffffff"
    },
    deleteBtn: {
        backgroundColor: "transparent",
        color: "#f87171",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        padding: "6px 10px",
        borderRadius: "6px"
    }
};

export default TaskCard;
