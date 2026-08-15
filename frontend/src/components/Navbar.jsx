import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Navbar({ currentView, setCurrentView }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 shadow-lg">

      {/* LOGO */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
          <Sparkles
            size={19}
            className="text-white"
          />
        </div>

        <span className="text-lg font-bold tracking-tight text-white">
          AI Task Manager
        </span>
      </Link>


      {/* CENTER / TASK TOGGLE */}
      <div className="flex items-center gap-4">

        {setCurrentView && (
          <button
            onClick={() =>
              setCurrentView(
                currentView === "form"
                  ? "list"
                  : "form"
              )
            }
            className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {currentView === "form"
              ? "📋 View Task List"
              : "➕ Add New Task"}
          </button>
        )}

      </div>


      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
      >
        Logout 🚪
      </button>

    </nav>
  );
}

export default Navbar;