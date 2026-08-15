import { useState } from "react";
import {
  Sparkles,
  X,
  CalendarDays,
  Check
} from "lucide-react";

function TaskForm({
  onAddTask,
  onClose
}) {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title.trim()) return;

    try {

      setIsLoading(true);

      await onAddTask({
        title,
        description,
        dueDate
      });

      setTitle("");
      setDescription("");
      setDueDate("");

    } catch (error) {

      console.error(
        "Failed to create task:",
        error
      );

    } finally {

      setIsLoading(false);

    }
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">

              <Sparkles
                size={19}
                className="text-white"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                Create Intelligent Task
              </h2>

              <p className="text-xs text-slate-500">
                AI will automatically analyze your task priority.
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >

            <X size={19} />

          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* TITLE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              placeholder="e.g. Prepare for Microsoft interview"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-medium text-slate-300">
                Description
              </label>

              <span className="text-xs text-slate-600">
                Optional
              </span>

            </div>

            <textarea
              placeholder="Add details, requirements or context..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

          </div>


          {/* DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Target Deadline
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />

            </div>

          </div>


          {/* AI INFORMATION */}

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">

            <div className="flex gap-3">

              <Sparkles
                size={18}
                className="mt-0.5 shrink-0 text-violet-400"
              />

              <div>

                <p className="text-sm font-medium text-violet-300">
                  AI-powered prioritization
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Gemini will analyze your task and automatically assign a priority level based on urgency and context.
                </p>

              </div>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Create Task
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default TaskForm;