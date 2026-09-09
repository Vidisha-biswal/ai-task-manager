import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  X,
  Check,
  CheckCheck,
  Clock3,
  AlertCircle,
  CheckCircle2,
  ListTodo
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../api/notificationApi";


function DashboardHeader({
  searchTerm,
  onSearchChange
}) {

  const {
    user,
    logout
  } = useAuth();

  const navigate =
    useNavigate();


  /*
   * =========================================================
   * ACCOUNT STATE
   * =========================================================
   */

  const [
    showAccountMenu,
    setShowAccountMenu
  ] = useState(false);

  const [
    showLogoutModal,
    setShowLogoutModal
  ] = useState(false);


  /*
   * =========================================================
   * NOTIFICATION STATE
   * =========================================================
   */

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    unreadCount,
    setUnreadCount
  ] = useState(0);

  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);

  const [
    notificationLoading,
    setNotificationLoading
  ] = useState(false);


  /*
   * =========================================================
   * REFS
   * =========================================================
   */

  const accountMenuRef =
    useRef(null);

  const notificationMenuRef =
    useRef(null);


  /*
   * =========================================================
   * USER NAME
   * =========================================================
   */

  const userName =
    user?.name || "there";


  /*
   * =========================================================
   * INITIALS
   * =========================================================
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
   * =========================================================
   * GREETING
   * =========================================================
   */

  const hour =
    new Date().getHours();

  let greeting;

  if (hour < 12) {
    greeting =
      "Good morning";
  } else if (hour < 17) {
    greeting =
      "Good afternoon";
  } else {
    greeting =
      "Good evening";
  }


  /*
   * =========================================================
   * LOAD NOTIFICATIONS
   * =========================================================
   */

  const loadNotifications =
    async () => {

      try {

        setNotificationLoading(
          true
        );

        const response =
          await getNotifications();

        const data =
          response.data || {};

        setNotifications(
          Array.isArray(
            data.notifications
          )
            ? data.notifications
            : []
        );

        setUnreadCount(
          Number(
            data.unreadCount || 0
          )
        );

      } catch (error) {

        console.error(
          "Failed to load notifications:",
          error
        );

      } finally {

        setNotificationLoading(
          false
        );
      }
    };


  /*
   * =========================================================
   * INITIAL NOTIFICATION LOAD + POLLING
   * =========================================================
   *
   * Initial load gets the current notification state.
   *
   * Polling every 60 seconds allows:
   *
   * - Due-soon notifications
   * - Overdue notifications
   * - New notifications from server
   *
   * to appear automatically.
   */

  useEffect(() => {

    loadNotifications();

    const interval =
      setInterval(
        loadNotifications,
        60 * 1000
      );


    return () => {
      clearInterval(interval);
    };

  }, []);


  /*
   * =========================================================
   * CLOSE MENUS ON OUTSIDE CLICK
   * =========================================================
   */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          accountMenuRef.current &&
          !accountMenuRef.current.contains(
            event.target
          )
        ) {
          setShowAccountMenu(
            false
          );
        }


        if (
          notificationMenuRef.current &&
          !notificationMenuRef.current.contains(
            event.target
          )
        ) {
          setShowNotifications(
            false
          );
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
   * =========================================================
   * TOGGLE NOTIFICATIONS
   * =========================================================
   *
   * IMPORTANT:
   *
   * Whenever the bell is clicked,
   * fetch the latest notifications first.
   *
   * This prevents the user from waiting
   * for the 60-second polling interval.
   */

  const handleNotificationClick =
    async () => {

      const willOpen =
        !showNotifications;


      setShowAccountMenu(
        false
      );


      if (willOpen) {

        await loadNotifications();

      }


      setShowNotifications(
        willOpen
      );
    };


  /*
   * =========================================================
   * MARK ONE NOTIFICATION AS READ
   * =========================================================
   */

  const handleMarkAsRead =
    async (notification) => {

      if (
        notification.readAt
      ) {
        return;
      }


      try {

        await markNotificationAsRead(
          notification._id
        );


        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                notification._id
                  ? {
                      ...item,
                      readAt:
                        new Date().toISOString()
                    }
                  : item
            )
        );


        setUnreadCount(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        );

      } catch (error) {

        console.error(
          "Failed to mark notification as read:",
          error
        );
      }
    };


  /*
   * =========================================================
   * MARK ALL AS READ
   * =========================================================
   */

  const handleMarkAllAsRead =
    async () => {

      if (
        unreadCount === 0
      ) {
        return;
      }


      try {

        await markAllNotificationsAsRead();


        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                readAt:
                  notification.readAt ||
                  new Date().toISOString()
              })
            )
        );


        setUnreadCount(0);

      } catch (error) {

        console.error(
          "Failed to mark all notifications as read:",
          error
        );
      }
    };


  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogoutClick =
    () => {

      setShowAccountMenu(
        false
      );

      setShowLogoutModal(
        true
      );
    };


  const handleConfirmLogout =
    () => {

      logout();

      setShowLogoutModal(
        false
      );

      navigate(
        "/login",
        {
          replace: true
        }
      );
    };


  const handleCancelLogout =
    () => {

      setShowLogoutModal(
        false
      );
    };


  /*
   * =========================================================
   * CLEAR SEARCH
   * =========================================================
   */

  const handleClearSearch =
    () => {

      if (onSearchChange) {
        onSearchChange("");
      }
    };


  /*
   * =========================================================
   * NOTIFICATION ICON
   * =========================================================
   */

  const getNotificationIcon =
    (type) => {

      switch (type) {

        case "task-completed":
          return (
            <CheckCircle2
              size={17}
              className="text-emerald-400"
            />
          );

        case "task-overdue":
          return (
            <AlertCircle
              size={17}
              className="text-red-400"
            />
          );

        case "task-due-soon":
          return (
            <Clock3
              size={17}
              className="text-yellow-400"
            />
          );

        case "task-created":
        default:
          return (
            <ListTodo
              size={17}
              className="text-violet-400"
            />
          );
      }
    };


  /*
   * =========================================================
   * NOTIFICATION TIME
   * =========================================================
   */

  const formatNotificationTime =
    (date) => {

      if (!date) {
        return "";
      }

      const createdAt =
        new Date(date);

      const now =
        new Date();

      const difference =
        Math.floor(
          (
            now.getTime() -
            createdAt.getTime()
          ) / 1000
        );


      if (
        difference < 60
      ) {
        return "Just now";
      }


      if (
        difference < 3600
      ) {
        return `${Math.floor(
          difference / 60
        )}m ago`;
      }


      if (
        difference < 86400
      ) {
        return `${Math.floor(
          difference / 3600
        )}h ago`;
      }


      return createdAt.toLocaleDateString();
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
              className="shrink-0 text-slate-500"
            />

            <input
              type="text"
              value={
                searchTerm || ""
              }
              onChange={(e) =>
                onSearchChange?.(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
              className="w-56 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              aria-label="Search tasks"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

          </div>


          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <div
            ref={notificationMenuRef}
            className="relative"
          >

            <button
              type="button"
              onClick={
                handleNotificationClick
              }
              className="relative rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 transition hover:text-white"
              aria-label="Notifications"
              aria-expanded={
                showNotifications
              }
            >

              <Bell size={19} />


              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </button>


            {/* NOTIFICATION DROPDOWN */}

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">

                  <div>

                    <h2 className="text-sm font-semibold text-white">
                      Notifications
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                        : "You're all caught up"}
                    </p>

                  </div>


                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        handleMarkAllAsRead
                      }
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      <CheckCheck
                        size={14}
                      />

                      Mark all read
                    </button>
                  )}

                </div>


                {/* CONTENT */}

                <div className="max-h-[420px] overflow-y-auto">

                  {notificationLoading ? (

                    <div className="px-6 py-12 text-center">

                      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />

                      <p className="text-xs text-slate-500">
                        Loading notifications...
                      </p>

                    </div>

                  ) : notifications.length === 0 ? (

                    <div className="px-6 py-12 text-center">

                      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800">

                        <Bell
                          size={19}
                          className="text-slate-500"
                        />

                      </div>

                      <p className="text-sm font-medium text-slate-300">
                        You're all caught up
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        No notifications to show.
                      </p>

                    </div>

                  ) : (

                    notifications.map(
                      (notification) => {

                        const isRead =
                          Boolean(
                            notification.readAt
                          );


                        return (
                          <button
                            key={
                              notification._id
                            }
                            type="button"
                            onClick={() =>
                              handleMarkAsRead(
                                notification
                              )
                            }
                            className={`flex w-full gap-3 border-b border-slate-800 px-4 py-4 text-left transition hover:bg-slate-800/60 ${
                              isRead
                                ? "bg-slate-900"
                                : "bg-slate-800/30"
                            }`}
                          >

                            {/* ICON */}

                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800">

                              {getNotificationIcon(
                                notification.type
                              )}

                            </div>


                            {/* CONTENT */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <p
                                  className={`text-sm ${
                                    isRead
                                      ? "font-medium text-slate-400"
                                      : "font-semibold text-white"
                                  }`}
                                >
                                  {
                                    notification.title
                                  }
                                </p>


                                {!isRead && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                                )}

                              </div>


                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                  notification.message
                                }
                              </p>


                              <div className="mt-2 flex items-center gap-2">

                                <span className="text-[10px] text-slate-600">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </span>


                                {!isRead && (
                                  <span className="flex items-center gap-1 text-[10px] text-violet-400">

                                    <Check
                                      size={11}
                                    />

                                    Click to mark read

                                  </span>
                                )}

                              </div>

                            </div>

                          </button>
                        );
                      }
                    )

                  )}

                </div>

              </div>
            )}

          </div>


          {/* =================================================
              ACCOUNT
              ================================================= */}

          <div
            ref={accountMenuRef}
            className="relative"
          >

            <button
              type="button"
              title={
                user?.name ||
                "User"
              }
              onClick={() =>
                setShowAccountMenu(
                  (current) =>
                    !current
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
                        {user?.name ||
                          "User"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user?.email ||
                          ""}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ACCOUNT OPTIONS */}

                <div className="p-2">

                  {/* PROFILE */}

                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
                  >

                    <User
                      size={17}
                    />

                    Profile

                    <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-700">
                      Soon
                    </span>

                  </button>


                  {/* SETTINGS */}

                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
                  >

                    <Settings
                      size={17}
                    />

                    Settings

                    <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-700">
                      Soon
                    </span>

                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={
                      handleLogoutClick
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >

                    <LogOut
                      size={17}
                    />

                    Log out

                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
          ===================================================== */}

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
                onClick={
                  handleCancelLogout
                }
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmLogout
                }
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