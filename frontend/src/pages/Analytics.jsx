import { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";
import Navbar from "../components/Navbar";  
import { 
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";

function Analytics() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data || []);
        } catch (error) {
            console.error("Failed to compile analytics workload metrics:", error);
        }
    };

     const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const pending = tasks.filter(t => t.status === "pending" || !t.status).length;

     const productivity = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

     const highPriority = tasks.filter(t => t.priority?.toLowerCase() === "high").length;
    const mediumPriority = tasks.filter(t => t.priority?.toLowerCase() === "medium").length;
    const lowPriority = tasks.filter(t => t.priority?.toLowerCase() === "low" || !t.priority).length;

     const statusPieData = [
        { name: "Pending ⏳", value: pending, color: "#ef4444" },
        { name: "In Progress 🚀", value: inProgress, color: "#facc15" },
        { name: "Completed ✅", value: completed, color: "#22c55e" }
    ].filter(segment => segment.value > 0);  

     const priorityBarData = [
        { name: "Low", Count: lowPriority, fill: "#4ade80" },
        { name: "Medium", Count: mediumPriority, fill: "#facc15" },
        { name: "High", Count: highPriority, fill: "#f87171" }
    ];

    return (
        <div style={styles.container}>
             <Navbar />

            <div style={styles.contentWrapper}>
                <h1 style={styles.mainHeading}>📊 Intelligent Workspace Analytics</h1>

                 <div style={styles.metricsRow}>
                    <div style={styles.metricCard}>
                        <p style={styles.cardLabel}>Total Task Stack</p>
                        <h2 style={{ ...styles.cardValue, color: "#60a5fa" }}>{totalTasks}</h2>
                    </div>
                    <div style={styles.metricCard}>
                        <p style={styles.cardLabel}>Completed Items</p>
                        <h2 style={{ ...styles.cardValue, color: "#4ade80" }}>{completed}</h2>
                    </div>
                    <div style={styles.metricCard}>
                        <p style={styles.cardLabel}>Productivity Rating</p>
                        <h2 style={{ ...styles.cardValue, color: "#a78bfa" }}>{productivity}%</h2>
                    </div>
                </div>

                {totalTasks === 0 ? (
                    <div style={styles.emptyPrompt}>
                        No task records found in MongoDB. Create tasks in your dashboard to view performance metrics! 📋
                    </div>
                ) : (
                     <div style={styles.chartGrid}>
                        
                         <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>Task Progression Lifecycle</h3>
                            <div style={styles.chartContainer}>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusPieData.map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={styles.tooltipStyle}
                                            itemStyle={{ color: "#ffffff" }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "13px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>AI-Prioritized Workloads</h3>
                            <div style={styles.chartContainer}>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={priorityBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip 
                                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                            contentStyle={styles.tooltipStyle}
                                        />
                                        <Bar dataKey="Count" radius={[6, 6, 0, 0]}>
                                            {priorityBarData.map((entry, idx) => (
                                                <Cell key={`cell-bar-${idx}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

 const styles = {
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
    },
    mainHeading: {
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "35px",
        color: "#f8fafc",
        textAlign: "left"
    },
    metricsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "35px"
    },
    metricCard: {
        backgroundColor: "#1e293b",  
        padding: "24px 30px",
        borderRadius: "12px",
        border: "1px solid #334155",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        textAlign: "left"
    },
    cardLabel: {
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: "500",
        margin: "0 0 8px 0",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    cardValue: {
        fontSize: "36px",
        fontWeight: "700",
        margin: 0
    },
    chartGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "24px",
        alignItems: "start"
    },
    chartCard: {
        backgroundColor: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        border: "1px solid #334155",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column"
    },
    chartTitle: {
        color: "#f1f5f9",
        fontSize: "17px",
        fontWeight: "600",
        margin: "0 0 20px 0",
        textAlign: "left",
        borderBottom: "1px solid #334155",
        paddingBottom: "12px"
    },
    chartContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    tooltipStyle: {
        backgroundColor: "#1e293b",
        border: "1px solid #475569",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#ffffff"
    },
    emptyPrompt: {
        backgroundColor: "#1e293b",
        color: "#94a3b8",
        padding: "40px",
        borderRadius: "12px",
        border: "1px dashed #475569",
        textAlign: "center",
        fontSize: "16px",
        marginTop: "20px"
    }
};

export default Analytics;
