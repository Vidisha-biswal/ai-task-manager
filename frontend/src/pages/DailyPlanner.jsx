import { useEffect, useState } from "react";

import {
  Sparkles,
  RefreshCw,
  Clock3,
  Target,
  CheckCircle2
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import { generateDailyPlan } from "../api/aiApi";
import { getTasks } from "../api/taskApi";

function DailyPlanner() {
  // =========================
  // STATE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [goal, setGoal] = useState("");
  const [schedule, setSchedule] = useState([]);

  const [loadingTasks, setLoadingTasks] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD EXISTING TASKS
  // =========================

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      setError("");

      const response = await getTasks();

      console.log(
        "TASK API RESPONSE:",
        response.data
      );

      const receivedTasks = Array.isArray(response.data)
        ? response.data
        : response.data?.tasks || [];

      setTasks(receivedTasks);
    } catch (error) {
      console.error(
        "Failed to load tasks:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your existing tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  // =========================
  // LOAD TASKS ON PAGE LOAD
  // =========================

  useEffect(() => {
    loadTasks();
  }, []);

  // =========================
  // GENERATE TODAY'S PLAN
  // =========================

  const handleGeneratePlan = async () => {
    if (!goal.trim()) {
      setError(
        "Please enter what you want to accomplish today."
      );

      return;
    }

    if (!tasks || tasks.length === 0) {
      setError(
        "No existing tasks available."
      );

      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSchedule([]);

      /*
       * Send an ARRAY of task objects.
       *
       * This matches the backend planner API.
       */

      const plannerTasks = tasks.map(
        (task) => ({
          id: task._id,
          title: task.title,
          description:
            task.description || "",
          priority:
            task.priority || "low",
          status:
            task.status || "pending",
          dueDate:
            task.dueDate || null
        })
      );

      const requestData = {
        goal: goal.trim(),
        tasks: plannerTasks
      };

      console.log(
        "PLANNER REQUEST:",
        requestData
      );

      const response =
        await generateDailyPlan(
          requestData
        );

      console.log(
        "PLANNER RESPONSE:",
        response.data
      );

      const generatedSchedule =
        response.data?.schedule || [];

      setSchedule(
        Array.isArray(generatedSchedule)
          ? generatedSchedule
          : []
      );
    } catch (error) {
      console.error(
        "AI planner error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to generate today's plan.";

      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  // =========================
  // PRIORITY STYLE
  // =========================

  const getPriorityStyle = (
    priority
  ) => {
    switch (
      priority?.toLowerCase()
    ) {
      case "high":
        return {
          background:
            "bg-red-500/10",
          text:
            "text-red-400",
          border:
            "border-red-500/20"
        };

      case "medium":
        return {
          background:
            "bg-yellow-500/10",
          text:
            "text-yellow-400",
          border:
            "border-yellow-500/20"
        };

      default:
        return {
          background:
            "bg-emerald-500/10",
          text:
            "text-emerald-400",
          border:
            "border-emerald-500/20"
        };
    }
  };

  // =========================
  // FORMAT STATUS
  // =========================

  const formatStatus = (
    status
  ) => {
    if (!status) {
      return "pending";
    }

    return status
      .replace("-", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="min-h-screen lg:ml-60">

        {/* ================= HEADER ================= */}

        <header className="border-b border-slate-800 bg-slate-950 px-6 py-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">

                <Sparkles
                  size={20}
                  className="text-white"
                />

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Plan your day with AI ✨
                </p>

                <h1 className="text-2xl font-bold">
                  AI Planner
                </h1>

              </div>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Let AI organize your existing
              tasks into a productive schedule
              for today.
            </p>

          </div>

        </header>

        {/* ================= MAIN ================= */}

        <main className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* ================= INPUT ================= */}

          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">

              <h2 className="text-xl font-semibold">
                Plan Today's Work
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tell AI what you want to
                accomplish today. It will
                prioritize your existing tasks.
              </p>

            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              What do you want to accomplish today?
            </label>

            <textarea
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value);
                setError("");
              }}
              placeholder="Example: Prepare for my interview and solve DSA questions"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
            />

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* ================= BUTTONS ================= */}

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={loadTasks}
                disabled={loadingTasks}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <RefreshCw
                  size={17}
                  className={
                    loadingTasks
                      ? "animate-spin"
                      : ""
                  }
                />

                {loadingTasks
                  ? "Syncing..."
                  : "Sync Tasks"}

              </button>

              <button
                onClick={
                  handleGeneratePlan
                }
                disabled={
                  generating ||
                  loadingTasks
                }
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Sparkles size={17} />

                {generating
                  ? "AI Creating Plan..."
                  : "Generate Today's Plan"}

              </button>

            </div>

          </section>

          {/* ================= EXISTING TASKS ================= */}

          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Existing Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI uses these tasks when
                  creating today's schedule.
                </p>

              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {tasks.length} tasks
              </span>

            </div>

            {loadingTasks ? (

              <div className="py-8 text-center text-sm text-slate-500">
                Loading tasks...
              </div>

            ) : tasks.length === 0 ? (

              <div className="py-8 text-center text-sm text-slate-500">
                No existing tasks found.
              </div>

            ) : (

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                {tasks.map(
                  (task) => {

                    const priorityStyle =
                      getPriorityStyle(
                        task.priority
                      );

                    return (
                      <div
                        key={task._id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="font-semibold text-white">
                            {task.title}
                          </h3>

                          <span
                            className={`rounded-lg border px-2 py-1 text-xs font-semibold uppercase ${priorityStyle.background} ${priorityStyle.text} ${priorityStyle.border}`}
                          >
                            {task.priority ||
                              "low"}
                          </span>

                        </div>

                        {task.description && (
                          <p className="mt-2 text-sm text-slate-500">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                          <span>
                            {formatStatus(
                              task.status
                            )}
                          </span>

                          {task.dueDate && (
                            <>
                              <span>
                                •
                              </span>

                              <span>
                                {new Date(
                                  task.dueDate
                                ).toLocaleDateString()}
                              </span>
                            </>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

          {/* ================= TODAY'S SCHEDULE ================= */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">

              <div className="flex items-center gap-2">

                <Clock3
                  size={20}
                  className="text-violet-400"
                />

                <h2 className="text-xl font-semibold">
                  Today's AI Schedule
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your personalized schedule
                generated from your existing tasks.
              </p>

            </div>

            {/* ================= GENERATING ================= */}

            {generating ? (

              <div className="py-12 text-center">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />

                <p className="text-sm text-slate-400">
                  AI is organizing your day...
                </p>

              </div>

            ) : schedule.length === 0 ? (

              /* ================= EMPTY ================= */

              <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">

                <Sparkles
                  size={28}
                  className="mx-auto mb-3 text-slate-600"
                />

                <h3 className="font-semibold text-slate-300">
                  No plan generated yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your goal above and
                  generate your AI plan.
                </p>

              </div>

            ) : (

              /* ================= SCHEDULE ================= */

              <div className="space-y-4">

                {schedule.map(
                  (item, index) => {

                    const priorityStyle =
                      getPriorityStyle(
                        item.priority
                      );

                    return (
                      <div
                        key={
                          item.taskId ||
                          `${item.title}-${index}`
                        }
                        className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-violet-500/30"
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-center">

                          {/* TIME */}

                          <div className="flex min-w-[170px] items-center gap-2 text-sm font-semibold text-violet-400">

                            <Clock3 size={17} />

                            {item.time ||
                              "Today"}

                          </div>

                          {/* TASK */}

                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="font-semibold text-white">
                                {item.title}
                              </h3>

                              {item.priority && (
                                <span
                                  className={`rounded-lg border px-2 py-1 text-xs font-semibold uppercase ${priorityStyle.background} ${priorityStyle.text} ${priorityStyle.border}`}
                                >
                                  {
                                    item.priority
                                  }
                                </span>
                              )}

                            </div>

                            {item.reason && (
                              <p className="mt-2 text-sm leading-6 text-slate-500">
                                {
                                  item.reason
                                }
                              </p>
                            )}

                          </div>

                          {/* FOCUS */}

                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                            {item.completed ? (
                              <>
                                <CheckCircle2
                                  size={15}
                                  className="text-emerald-400"
                                />

                                Completed
                              </>
                            ) : (
                              <>
                                <Target size={15} />

                                Focus
                              </>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default DailyPlanner;