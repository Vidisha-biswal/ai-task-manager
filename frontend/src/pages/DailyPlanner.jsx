import { useState } from "react";
import { generatePlan } from "../api/aiApi";
import { getTasks } from "../api/taskApi"; 
import Navbar from "../components/Navbar";

function DailyPlanner() {
    const [tasks, setTasks] = useState("");
    const [plan, setPlan] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");

    const handleSyncFromDatabase = async () => {
        try {
            setSyncMessage("Fetching database tasks...");
            const res = await getTasks();
            const activeTaskTitles = res.data
                .filter(t => t.status !== "completed")
                .map(t => t.title);

            if (activeTaskTitles.length === 0) {
                setSyncMessage("No pending tasks found! 📋");
            } else {
                setTasks(activeTaskTitles.join(", "));
                setSyncMessage(`Synced ${activeTaskTitles.length} tasks! 🎉`);
            }
            setTimeout(() => setSyncMessage(""), 4000); 
        } catch (error) {
            setSyncMessage("Failed to connect to task database.");
        }
    };

    const createPlan = async () => {
        if (!tasks.trim()) return alert("Please input or sync tasks first!");
        
        setIsLoading(true);
        setPlan(""); 
        try {
            const taskArray = tasks.split(",").map(item => item.trim()).filter(Boolean);
            const res = await generatePlan({ tasks: taskArray });
            
            if (res && res.data && res.data.plan) {
                setPlan(res.data.plan);
            } else {
                setPlan("❌ Backend returned a blank plan.");
            }
        } catch (error) {
            setPlan("❌ AI Timetable Generation failed.");
        } finally {
            setIsLoading(false);
        }
    };

     const renderCompactPlan = (rawText) => {
        if (!rawText) return null;

         const lines = rawText.split("\n");
        const scheduleItems = [];

         const timeRegex = /([0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)\s*-\s*[0-9]{1,2}:[0-9]{2}\s*(?:AM|PM)):?(.*)/i;

        lines.forEach(line => {
            const match = line.match(timeRegex);
            if (match) {
                scheduleItems.push({
                    time: match[1].trim(),
                    activity: match[2].replace(/^\s*:\s*/, "").replace(/\*\*/g, "").trim()
                });
            }
        });

         if (scheduleItems.length === 0) {
            return <div style={styles.cleanTextBlock}>{rawText.replace(/\*\*/g, "")}</div>;
        }

         return (
            <div style={styles.timetableGrid}>
                {scheduleItems.map((item, idx) => (
                    <div key={idx} style={styles.timetableRow}>
                        <div style={styles.timeColumn}>⏰ {item.time}</div>
                        <div style={styles.activityColumn}>{item.activity}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <Navbar />

            <div style={styles.contentWrapper}>
                <h1 style={styles.mainHeading}>🗓️ AI Day Planner</h1>
                
                <div style={styles.layoutGrid}>
                    {/* LEFT PANEL: INPUT CONTROLS */}
                    <div style={styles.controlCard}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.cardTitle}>Configure Tasks</h3>
                            <button onClick={handleSyncFromDatabase} style={styles.syncBtn}>
                                🔄 Sync Tasks
                            </button>
                        </div>

                        {syncMessage && <p style={styles.syncStatusText}>{syncMessage}</p>}

                        <textarea 
                            placeholder="Enter tasks separated by commas..." 
                            value={tasks}
                            onChange={(e) => setTasks(e.target.value)} 
                            style={styles.textarea}
                        />

                        <button onClick={createPlan} disabled={isLoading} style={styles.actionBtn}>
                            {isLoading ? "🤖 Thinking..." : "Generate Plan ✨"}
                        </button>
                    </div>

                    {/* RIGHT PANEL: CLEAN COMPACT OUTPUT */}
                    <div style={styles.outputCard}>
                        <h3 style={styles.cardTitle}>Your Schedule</h3>
                        
                        {!plan && !isLoading && (
                            <div style={styles.placeholderBox}>Your smart timetable timeline will print out here.</div>
                        )}

                        {isLoading && (
                            <div style={styles.loaderBox}>
                                <div style={styles.spinner}></div>
                            </div>
                        )}

                        {/* 🧠 FIX: Uses our compact layout generator instead of the raw <pre> tag */}
                        {plan && (
                            <div style={styles.timelineContent}>
                                {renderCompactPlan(plan)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

 const styles = {
    container: { backgroundColor: "#0f172a", minHeight: "100vh", width: "100vw", color: "#ffffff", fontFamily: "'Segoe UI', Roboto, sans-serif" },
    contentWrapper: { padding: "30px max(4%, 20px)", maxWidth: "1200px", margin: "0 auto" },
    mainHeading: { fontSize: "22px", fontWeight: "600", marginBottom: "25px", color: "#f8fafc" },
    layoutGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", alignItems: "start" },
    controlCard: { backgroundColor: "#1e293b", padding: "20px", borderRadius: "10px", border: "1px solid #334155", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    cardTitle: { color: "#f1f5f9", fontSize: "15px", fontWeight: "600", margin: 0 },
    syncBtn: { backgroundColor: "#0ea5e9", color: "#ffffff", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    syncStatusText: { color: "#38bdf8", fontSize: "12px", margin: "0 0 10px 0", fontWeight: "500" },
    textarea: { width: "100%", minHeight: "110px", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
    actionBtn: { width: "100%", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    outputCard: { backgroundColor: "#1e293b", padding: "20px", borderRadius: "10px", border: "1px solid #334155", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minHeight: "200px" },
    placeholderBox: { color: "#64748b", fontSize: "14px", textAlign: "center", border: "1px dashed #334155", borderRadius: "6px", padding: "40px 20px", marginTop: "12px" },
    loaderBox: { display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 0" },
    spinner: { width: "30px", height: "30px", border: "3px solid #334155", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" },
    timelineContent: { marginTop: "12px" },
    
     timetableGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    timetableRow: {
        display: "flex",
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "6px",
        padding: "8px 12px",
        alignItems: "center",
        fontSize: "13px"
    },
    timeColumn: {
        fontWeight: "700",
        color: "#38bdf8",
        minWidth: "140px",
        borderRight: "1px solid #334155",
        marginRight: "12px"
    },
    activityColumn: {
        color: "#cbd5e1",
        textAlign: "left",
        lineHeight: "1.4"
    },
    cleanTextBlock: {
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#cbd5e1",
        whiteSpace: "pre-wrap",
        textAlign: "left"
    }
};

export default DailyPlanner;
