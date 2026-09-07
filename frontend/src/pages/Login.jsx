import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: form.email.trim(),
        password: form.password
      });

      const token = res.data?.token;

      if (!token) {
        throw new Error(
          "Login succeeded, but no authentication token was received."
        );
      }

      /*
       * IMPORTANT:
       * Use AuthContext.login() instead of directly
       * modifying localStorage.
       *
       * AuthContext.login() does both:
       * 1. Saves the token to localStorage
       * 2. Updates React authentication state
       */
      login(token);

      navigate("/dashboard", {
        replace: true
      });
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      if (
        error.response?.data?.message
      ) {
        setErrorMessage(
          error.response.data.message
        );
      } else if (
        typeof error.response?.data ===
        "string"
      ) {
        setErrorMessage(
          error.response.data
        );
      } else if (error.message) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "Invalid credentials. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          Welcome Back
        </h2>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          {errorMessage && (
            <div style={styles.errorBox}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading
                ? "not-allowed"
                : "pointer"
            }}
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Not registered?{" "}
          <Link
            to="/register"
            style={styles.link}
          >
            Register here
          </Link>
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
    fontFamily:
      "'Segoe UI', Roboto, sans-serif"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow:
      "0 10px 25px rgba(0, 0, 0, 0.3)",
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
    border:
      "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition:
      "border 0.2s"
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
    transition:
      "background-color 0.2s",
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

export default Login;