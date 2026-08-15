import {
  Search,
  Bell
} from "lucide-react";

function DashboardHeader() {

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-8 py-5">

      <div>

        <h1 className="text-2xl font-bold text-white">
          Good evening, Vidisha! 👋
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Here's what's happening with your tasks today.
        </p>

      </div>


      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center rounded-xl border border-slate-700 bg-slate-900 px-4">

          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            placeholder="Search tasks..."
            className="w-56 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

        </div>


        <button className="relative rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 hover:text-white">

          <Bell size={19} />

          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
            3
          </span>

        </button>


        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white">

          VB

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;