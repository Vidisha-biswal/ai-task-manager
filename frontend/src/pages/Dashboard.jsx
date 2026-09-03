import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  AlertCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask
} from "../api/taskApi";

import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import DashboardHeader from "../components/DashboardHeader";
function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);


  /*
   * LOAD TASKS
   */

  const loadTasks = async () => {

    try {

      setLoading(true);

      const response = await getTasks();

      console.log(
        "TASK API RESPONSE:",
        response.data
      );

      const loadedTasks =
        Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.tasks)
          ? response.data.tasks
          : [];

      setTasks(loadedTasks);

    } catch (error) {

      console.error(
        "Failed to fetch tasks:",
        error
      );

      setTasks([]);

    } finally {

      setLoading(false);

    }

  };


  /*
   * INITIAL LOAD
   */

  useEffect(() => {

    let ignore = false;

    const fetchInitialTasks = async () => {

      try {

        setLoading(true);

        const response =
          await getTasks();

        if (ignore) {
          return;
        }

        console.log(
          "INITIAL TASK API RESPONSE:",
          response.data
        );

        const loadedTasks =
          Array.isArray(response.data)
            ? response.data
            : Array.isArray(
                response.data?.tasks
              )
            ? response.data.tasks
            : [];

        setTasks(loadedTasks);

      } catch (error) {

        if (!ignore) {

          console.error(
            "Failed to fetch tasks:",
            error
          );

          setTasks([]);

        }

      } finally {

        if (!ignore) {
          setLoading(false);
        }

      }

    };

    fetchInitialTasks();

    return () => {
      ignore = true;
    };

  }, []);


  /*
   * CREATE TASK
   *
   * TaskForm sends:
   * {
   *   title,
   *   description,
   *   priority,
   *   dueDate
   * }
   *
   * The API saves the task and
   * returns the created task.
   */

  const handleAddTask = async (
    taskData
  ) => {

    try {

      console.log(
        "CREATE TASK REQUEST:",
        taskData
      );

      const response =
        await createTask(taskData);

      console.log(
        "CREATE TASK RESPONSE:",
        response.data
      );

      const newTask = response.data;

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks
      ]);

      setShowTaskForm(false);

      return newTask;

    } catch (error) {

      console.error(
        "Failed to create task:",
        error
      );

      throw error;

    }

  };


  /*
   * DELETE TASK
   */

  const removeTask = async (id) => {

    try {

      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== id
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete task:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete task."
      );

    }

  };


  /*
   * CHANGE TASK STATUS
   */

  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      const response =
        await updateTask(
          id,
          { status }
        );

      console.log(
        "UPDATED TASK:",
        response.data
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === id
            ? response.data
            : task
        )
      );

    } catch (error) {

      console.error(
        "Failed to update task:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to update task status."
      );

    }

  };


  /*
   * TASK ANALYTICS
   */

  const analytics = useMemo(() => {

    const total = tasks.length;

    const completed =
      tasks.filter(
        (task) =>
          task.status === "completed"
      ).length;

    const inProgress =
      tasks.filter(
        (task) =>
          task.status === "in-progress"
      ).length;

    const pending =
      tasks.filter(
        (task) =>
          !task.status ||
          task.status === "pending"
      ).length;

    const highPriority =
      tasks.filter(
        (task) =>
          task.priority === "high"
      ).length;

    const mediumPriority =
      tasks.filter(
        (task) =>
          task.priority === "medium"
      ).length;

    const lowPriority =
      tasks.filter(
        (task) =>
          task.priority === "low"
      ).length;

    const completionRate =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate
    };

  }, [tasks]);


  /*
   * PRIORITY DATA
   */

  const priorityData = [
    {
      label: "High",
      value: analytics.highPriority,
      className: "bg-red-500"
    },
    {
      label: "Medium",
      value: analytics.mediumPriority,
      className: "bg-yellow-500"
    },
    {
      label: "Low",
      value: analytics.lowPriority,
      className: "bg-emerald-500"
    }
  ];


  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar
        onCreateTask={() =>
          setShowTaskForm(true)
        }
      />


      {/* MAIN CONTENT */}

      <main className="ml-60 min-h-screen p-8">

        {/* HEADER */}
        <DashboardHeader />

        {/* <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="mb-1 text-sm text-slate-400">
              Welcome back 👋
            </p>

            <h1 className="text-3xl font-bold">
              Good morning, Vidisha
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here's what's happening with
              your tasks today.
            </p>

          </div>


          <button
            onClick={() =>
              setShowTaskForm(true)
            }
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90"
          >

            <Sparkles size={17} />

            Create Smart Task

          </button>

        </div> */}


        {/* STATISTICS */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Tasks"
            value={analytics.total}
            icon={
              <ListTodo size={21} />
            }
            description="All your tasks"
          />


          <StatCard
            title="Completed"
            value={analytics.completed}
            icon={
              <CheckCircle2 size={21} />
            }
            description={`${analytics.completionRate}% completion rate`}
          />


          <StatCard
            title="In Progress"
            value={analytics.inProgress}
            icon={
              <Clock3 size={21} />
            }
            description="Currently working"
          />


          <StatCard
            title="High Priority"
            value={analytics.highPriority}
            icon={
              <AlertCircle size={21} />
            }
            description="Needs attention"
          />

        </section>


        {/* ANALYTICS */}

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* COMPLETION */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Productivity
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Task completion
                </p>

              </div>

              <TrendingUp
                size={20}
                className="text-violet-400"
              />

            </div>


            <div className="flex items-center gap-5">

              <div
                className="relative flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background:
                    `conic-gradient(#8b5cf6 ${analytics.completionRate * 3.6}deg, #1e293b 0deg)`
                }}
              >

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">

                  <span className="text-xl font-bold">
                    {analytics.completionRate}%
                  </span>

                </div>

              </div>


              <div className="text-sm">

                <p className="text-slate-300">
                  {analytics.completed} completed
                </p>

                <p className="mt-2 text-slate-500">
                  out of {analytics.total} tasks
                </p>

              </div>

            </div>

          </div>


          {/* PRIORITY */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

            <div className="mb-5">

              <h2 className="font-semibold">
                Task Priority
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Distribution of your current tasks
              </p>

            </div>


            <div className="space-y-5">

              {priorityData.map(
                (item) => {

                  const percentage =
                    analytics.total === 0
                      ? 0
                      : Math.round(
                          (item.value /
                            analytics.total) *
                            100
                        );

                  return (

                    <div
                      key={item.label}
                    >

                      <div className="mb-2 flex justify-between text-sm">

                        <span className="text-slate-300">
                          {item.label}
                        </span>

                        <span className="text-slate-500">
                          {item.value}
                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className={`h-full rounded-full ${item.className}`}
                          style={{
                            width:
                              `${percentage}%`
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </section>


        {/* TASK SECTION */}

        <section
          id="tasks"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                My Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your tasks and stay productive.
              </p>

            </div>


            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

              {analytics.total} tasks

            </span>

          </div>


          {loading ? (

            <div className="py-12 text-center">

              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />

              <p className="text-sm text-slate-500">
                Loading tasks...
              </p>

            </div>

          ) : (

            <TaskList
              tasks={tasks}
              onDelete={removeTask}
              onStatusChange={
                handleStatusChange
              }
            />

          )}

        </section>


        {/* AI INSIGHT */}

        <section className="mt-6 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-blue-950/30 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">

              <Sparkles
                size={20}
                className="text-violet-400"
              />

            </div>


            <div>

              <h3 className="font-semibold">
                AI Productivity Insight
              </h3>


              <p className="mt-2 text-sm leading-6 text-slate-400">

                {analytics.total === 0
                  ? "Create a few tasks and AI Task Manager will help you prioritize your work."
                  : analytics.completionRate >= 70
                  ? "Great work! You're maintaining a strong completion rate. Keep focusing on your high-priority tasks."
                  : analytics.highPriority > 0
                  ? `You have ${analytics.highPriority} high-priority task${analytics.highPriority > 1 ? "s" : ""}. Consider tackling ${analytics.highPriority > 1 ? "them" : "it"} first to improve your productivity.`
                  : "You have no high-priority tasks right now. Keep working consistently to maintain your productivity."}

              </p>

            </div>

          </div>

        </section>

      </main>


      {/* CREATE TASK MODAL */}

      {showTaskForm && (

        <TaskForm
          onClose={() =>
            setShowTaskForm(false)
          }
          onAddTask={
            handleAddTask
          }
        />

      )}

    </div>

  );

}


/*
 * STAT CARD COMPONENT
 */

function StatCard({
  title,
  value,
  icon,
  description
}) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">

      <div className="mb-4 flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-violet-400">

          {icon}

        </div>

      </div>


      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>

  );

}

export default Dashboard;