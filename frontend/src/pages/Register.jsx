import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";  

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        try {
            const res = await registerUser(form);

            if (res && res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/dashboard"); 
            }
        } catch (error) {
            const backendError = error.response?.data?.message || "Registration Failed!";
            setErrorMessage(backendError);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create Account</h2>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={styles.input}
                        required
                    />

                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={styles.input}
                        required
                    />

                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        style={styles.input}
                        required
                    />

                    
                    {errorMessage && (
                        <div style={styles.errorBox}>
                            ⚠️ {errorMessage}
                        </div>
                    )}
                    
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                {/* 🧠 FUNCTIONAL LINK ROUTING CONTAINER */}
                <p style={styles.footerText}>
                    Already a user? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#0f172a",
        fontFamily: "'Segoe UI', Roboto, sans-serif"
    },
    card: {
        backgroundColor: "#1e293b", 
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
    },
    heading: {
        color: "#ffffff",
        marginBottom: "25px",
        fontSize: "28px",
        fontWeight: "600"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    input: {
        padding: "14px",
        borderRadius: "6px",
        border: "1px solid #334155",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontSize: "15px",
        outline: "none",
        transition: "border 0.2s"
    },
    errorBox: {
        backgroundColor: "#fecaca",
        color: "#dc2626",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "left"
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
        transition: "background-color 0.2s",
        marginTop: "10px"
    },
    footerText: {
        color: "#94a3b8",
        marginTop: "20px",
        fontSize: "14px"
    },
    link: {
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: "500"
    }
};

export default Register;
