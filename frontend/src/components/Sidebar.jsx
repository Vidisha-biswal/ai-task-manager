import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Sparkles,
  Plus
} from "lucide-react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function getInitials(name) {
  if (!name) {
    return "U";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}


function Sidebar({ onCreateTask }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();


  const userName =
    user?.name || "User";

  const initials =
    getInitials(user?.name);


  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      label: "Tasks",
      icon: ListTodo,
      path: "/dashboard#tasks"
    },
    {
      label: "Planner",
      icon: CalendarDays,
      path: "/planner"
    }
  ];


  const handleNavigation = (item) => {
    if (item.path.includes("#")) {
      navigate("/dashboard");

      setTimeout(() => {
        document
          .getElementById("tasks")
          ?.scrollIntoView({
            behavior: "smooth"
          });
      }, 100);

      return;
    }

    navigate(item.path);
  };


  const handleCreateTask = () => {
    if (onCreateTask) {
      onCreateTask();
      return;
    }

    navigate("/dashboard");
  };


  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-slate-800 bg-slate-950 lg:block">

      {/* ================= LOGO ================= */}

      <div className="flex h-[74px] items-center border-b border-slate-800 px-6">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="flex items-center gap-2"
        >

          <Sparkles
            size={25}
            className="text-violet-400"
          />

          <span className="text-lg font-bold text-white">
            AI Task Manager
          </span>

        </button>

      </div>


      {/* ================= NAVIGATION ================= */}

      <nav className="space-y-2 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            (item.label === "Dashboard" &&
              location.pathname ===
                "/dashboard") ||
            (item.label === "Planner" &&
              location.pathname ===
                "/planner");

          return (
            <button
              key={item.label}
              onClick={() =>
                handleNavigation(item)
              }
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >

              <Icon
                size={19}
                className={
                  active
                    ? "text-white"
                    : "text-slate-500 group-hover:text-violet-400"
                }
              />

              {item.label}

            </button>
          );
        })}

      </nav>


      {/* ================= AI ASSISTANT ================= */}

      <div className="absolute bottom-20 left-4 right-4 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-blue-950/40 p-4">

        <div className="flex items-center gap-2 text-violet-400">

          <Sparkles size={18} />

          <span className="font-semibold">
            AI Assistant
          </span>

        </div>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Let AI prioritize and plan your tasks smarter.
        </p>

        <button
          onClick={handleCreateTask}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:opacity-90"
        >

          <Plus size={16} />

          Create Smart Task

        </button>

      </div>


      {/* ================= USER ================= */}

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">

            {initials}

          </div>


          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-white">
              {userName}
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}


export default Sidebar;