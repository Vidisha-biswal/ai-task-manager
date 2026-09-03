import {
  CalendarDays,
  Trash2,
  CheckCircle2,
  Clock3,
  Circle
} from "lucide-react";


function TaskCard({
  task,
  onDelete,
  onStatusChange
}) {

  const priority =
    task.priority?.toLowerCase() ||
    "medium";


  const priorityConfig = {

    high: {
      label: "High",
      className:
        "border-red-500/20 bg-red-500/10 text-red-400",
      dot: "bg-red-400"
    },

    medium: {
      label: "Medium",
      className:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
      dot: "bg-yellow-400"
    },

    low: {
      label: "Low",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      dot: "bg-emerald-400"
    }

  };


  const priorityStyle =
    priorityConfig[priority] ||
    priorityConfig.medium;


  const status =
    task.status || "pending";


  const statusIcon = {

    pending:
      <Circle size={15} />,

    "in-progress":
      <Clock3 size={15} />,

    completed:
      <CheckCircle2 size={15} />

  };


  const formatDate = () => {

    if (!task.dueDate) {
      return "No deadline";
    }

    const date =
      new Date(task.dueDate);

    if (Number.isNaN(date.getTime())) {
      return "Invalid deadline";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );
  };


  const isCompleted =
    status === "completed";


  return (

    <div
      className={`group flex min-h-[230px] flex-col rounded-2xl border bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isCompleted
          ? "border-emerald-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >

      {/* TOP */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <h3
            className={`line-clamp-2 text-base font-semibold ${
              isCompleted
                ? "text-slate-500 line-through"
                : "text-white"
            }`}
          >
            {task.title}
          </h3>

        </div>


        {/* PRIORITY */}

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${priorityStyle.className}`}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`}
          />

          {priorityStyle.label}

        </span>

      </div>


      {/* DESCRIPTION */}

      <p
        className={`mt-3 line-clamp-3 flex-1 text-sm leading-6 ${
          isCompleted
            ? "text-slate-600"
            : "text-slate-500"
        }`}
      >
        {task.description ||
          "No description provided."}
      </p>


      {/* DATE */}

      <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500">

        <CalendarDays size={14} />

        <span>
          {formatDate()}
        </span>

      </div>


      {/* ACTIONS */}

      <div className="mt-4 flex items-center justify-between gap-3">

        {/* STATUS */}

        <div className="relative flex flex-1 items-center">

          <span className="pointer-events-none absolute left-3 text-slate-500">

            {statusIcon[status] ||
              <Circle size={15} />}

          </span>


          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                task._id,
                e.target.value
              )
            }
            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs font-medium text-slate-300 outline-none transition hover:border-slate-600 focus:border-violet-500"
          >

            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

          </select>

        </div>


        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete(task._id)
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 text-slate-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          title="Delete task"
          aria-label={`Delete ${task.title}`}
        >

          <Trash2 size={15} />

        </button>

      </div>

    </div>
  );
}


export default TaskCard;