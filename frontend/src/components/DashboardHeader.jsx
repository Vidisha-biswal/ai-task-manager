import {
  Search,
  Bell
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


function DashboardHeader() {

  const {
    user
  } = useAuth();


  /*
   * GET USER NAME
   */

  const userName =
    user?.name || "there";


  /*
   * GET INITIALS
   */

  const initials =
    user?.name
      ? user.name
          .split(" ")
          .filter(Boolean)
          .map(
            (part) =>
              part[0]
          )
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";


  /*
   * DYNAMIC GREETING
   */

  const hour =
    new Date().getHours();

  let greeting;

  if (hour < 12) {

    greeting = "Good morning";

  } else if (hour < 17) {

    greeting = "Good afternoon";

  } else {

    greeting = "Good evening";

  }


  return (

    <header className="flex items-center justify-between border-b border-slate-800 px-8 py-5">

      {/* LEFT */}

      <div>

        <h1 className="text-2xl font-bold text-white">

          {greeting}, {userName}! 👋

        </h1>

        <p className="mt-1 text-sm text-slate-400">

          Here's what's happening with your tasks today.

        </p>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* SEARCH */}

        <div className="hidden items-center rounded-xl border border-slate-700 bg-slate-900 px-4 md:flex">

          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            placeholder="Search tasks..."
            className="w-56 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

        </div>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="relative rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 transition hover:text-white"
        >

          <Bell size={19} />

          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">

            3

          </span>

        </button>


        {/* USER AVATAR */}

        <div
          title={user?.name || "User"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white"
        >

          {initials}

        </div>

      </div>

    </header>

  );

}


export default DashboardHeader;