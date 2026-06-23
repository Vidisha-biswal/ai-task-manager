import TaskCard from "./TaskCard";

function TaskList({ tasks, onDelete, onStatusChange }) {
    if (!tasks || tasks.length === 0) {
        return (
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "40px", fontSize: "16px" }}>
                No tasks found. Use the menu to add one! 📋
            </p>
        );
    }

    return (
        <div style={listStyles.grid}>
            {tasks.map((task) => (
                <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}

const listStyles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px",
        marginTop: "10px"
    }
};

export default TaskList;
