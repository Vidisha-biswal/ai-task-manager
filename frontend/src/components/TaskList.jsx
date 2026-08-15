import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  onDelete,
  onStatusChange
}) {

  if (!tasks || tasks.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-center">

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

          <span className="text-2xl">
            📋
          </span>

        </div>

        <h3 className="text-lg font-semibold text-white">
          No tasks yet
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Create your first intelligent task and let AI help you prioritize your work.
        </p>

      </div>

    );
  }

  return (

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

      {tasks.map((task) => (

        <TaskCard
          key={task._id}
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />

      ))}

    </div>

  );
}

export default TaskList;