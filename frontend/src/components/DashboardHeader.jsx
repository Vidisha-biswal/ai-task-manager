import {
  Search,
  Bell,
  LogOut,
  User,
  Settings
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function DashboardHeader() {

  const {
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const accountMenuRef =
    useRef(null);


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


  /*
   * CLOSE ACCOUNT MENU
   *
   * Clicking outside the menu
   * closes it.
   */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target
        )
      ) {

        setShowAccountMenu(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /*
   * OPEN LOGOUT CONFIRMATION
   */

  const handleLogoutClick = () => {

    setShowAccountMenu(false);

    setShowLogoutModal(true);

  };


  /*
   * CONFIRM LOGOUT
   */

  const handleConfirmLogout = () => {

    logout();

    setShowLogoutModal(false);

    navigate("/login", {
      replace: true
    });

  };


  /*
   * CANCEL LOGOUT
   */

  const handleCancelLogout = () => {

    setShowLogoutModal(false);

  };


  return (

    <>

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


          {/* ACCOUNT */}

          <div
            ref={accountMenuRef}
            className="relative"
          >

            <button
              type="button"
              title={user?.name || "User"}
              onClick={() =>
                setShowAccountMenu(
                  (current) => !current
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white transition hover:scale-105 hover:shadow-lg hover:shadow-violet-900/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >

              {initials}

            </button>


            {/* ACCOUNT MENU */}

            {showAccountMenu && (

              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">

                {/* USER INFORMATION */}

                <div className="border-b border-slate-800 px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">

                      {initials}

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-white">

                        {user?.name || "User"}

                      </p>

                      <p className="truncate text-xs text-slate-500">

                        {user?.email || ""}

                      </p>

                    </div>

                  </div>

                </div>


                {/* FUTURE PROFILE */}

                <div className="p-2">

                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
                  >

                    <User size={17} />

                    Profile

                    <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-700">

                      Soon

                    </span>

                  </button>


                  {/* FUTURE SETTINGS */}

                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
                  >

                    <Settings size={17} />

                    Settings

                    <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-700">

                      Soon

                    </span>

                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >

                    <LogOut size={17} />

                    Log out

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* LOGOUT CONFIRMATION MODAL */}

      {showLogoutModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

                <LogOut
                  size={20}
                  className="text-red-400"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-white">

                  Log out of account?

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  You'll need to log in again to access your tasks.

                </p>

              </div>

            </div>


            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={handleCancelLogout}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >

                Cancel

              </button>


              <button
                type="button"
                onClick={handleConfirmLogout}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
              >

                Log out

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}


export default DashboardHeader;