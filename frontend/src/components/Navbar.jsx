 import { Link, useNavigate } from "react-router-dom";

function Navbar({ currentView, setCurrentView }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={navStyles.navbar}>
            <div style={navStyles.logo}>⚡ AI Task Manager</div>
            
            <div style={navStyles.linksContainer}>
                <Link to="/dashboard" style={navStyles.link}>Dashboard</Link>
                <Link to="/planner" style={navStyles.link}>Planner</Link>
                <Link to="/analytics" style={navStyles.link}>Analytics</Link>
                
                 {setCurrentView && (
                    <button 
                        onClick={() => setCurrentView(currentView === "form" ? "list" : "form")}
                        style={navStyles.toggleBtn}
                    >
                        {currentView === "form" ? "📋 View Task List" : "➕ Add New Task"}
                    </button>
                )}
            </div>

            <button onClick={handleLogout} style={navStyles.logoutBtn}>
                Logout 🚪
            </button>
        </nav>
    );
}

const navStyles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1e293b",
        padding: "15px 30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Segoe UI', Roboto, sans-serif"
    },
    logo: { color: "#ffffff", fontSize: "18px", fontWeight: "700" },
    linksContainer: { display: "flex", alignItems: "center", gap: "24px" },
    link: { color: "#94a3b8", textDecoration: "none", fontSize: "15px", fontWeight: "500" },
    toggleBtn: {
        backgroundColor: "#0ea5e9",
        color: "#ffffff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    },
    logoutBtn: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    }
};

export default Navbar;
