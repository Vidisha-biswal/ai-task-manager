function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  valueClass = "text-white"
}) {

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 text-sm text-slate-400">
        {title}
      </p>

      <p
        className={`mt-1 text-3xl font-bold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}

export default StatCard;