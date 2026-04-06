import React, { useState, useMemo } from "react";

// SVG Icons with refined styling
const Icons = {
  Clock: ({ className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Plus: ({ size = 18, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: ({ size = 18, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  X: ({ size = 16, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  RotateCcw: ({ size = 18, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 2v6h6" />
      <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
  ),
  History: ({ size = 16, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  AlertCircle: ({ size = 20, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Edit: ({ size = 16, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
};

const HourCalculator = () => {
  const [entries, setEntries] = useState([]);
  const [currentHours, setCurrentHours] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState("");
  const [operation, setOperation] = useState("add");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const addEntry = (e) => {
    e.preventDefault();
    const h = parseInt(currentHours) || 0;
    const m = parseInt(currentMinutes) || 0;

    if (h === 0 && m === 0) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? { ...entry, hours: h, minutes: m, operation }
            : entry,
        ),
      );
      setEditingId(null);
    } else {
      setEntries([
        ...entries,
        { id: Date.now(), hours: h, minutes: m, operation },
      ]);
    }

    setCurrentHours("");
    setCurrentMinutes("");
  };
  const editEntry = (entry) => {
    setCurrentHours(entry.hours);
    setCurrentMinutes(entry.minutes);
    setOperation(entry.operation);
    setEditingId(entry.id);
  };

  const removeEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const confirmClear = () => {
    setEntries([]);
    setCurrentHours("");
    setCurrentMinutes("");
    setOperation("add");
    setShowConfirm(false);
    setEditingId(null)
  };

  const total = useMemo(() => {
    let totalMinutes = 0;

    entries.forEach((e) => {
      const mins = e.hours * 60 + e.minutes;
      totalMinutes += e.operation === "add" ? mins : -mins;
    });

    const isNegative = totalMinutes < 0;
    const abs = Math.abs(totalMinutes);

    return {
      hours: Math.floor(abs / 60),
      minutes: abs % 60,
      isNegative,
      totalEntries: entries.length,
    };
  }, [entries]);

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <div className="w-full md:max-w-md mx-auto md:px-4 md:py-8  animate-fade-in">
      {/* Main Card */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2.5 rounded-xl text-accent shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Icons.Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold tracking-tight">
                Hour Calculator
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={entries.length === 0}
            className="group p-2.5 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500/10 hover:text-red-400 text-zinc-500"
            title="Clear all entries"
          >
            <Icons.RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-500" />
          </button>
        </header>

        {/* Result Display */}
        <section className="relative p-8 bg-linear-to-b from-white/2 to-transparent">
          <div
            className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity duration-500"
            style={{ opacity: isAnimating ? 0.5 : 0 }}
          />

          <div className="relative text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Total Duration
            </p>

            <div
              className={`flex items-baseline justify-center gap-1 font-heading font-bold transition-all duration-300 ${
                total.isNegative ? "text-red-500" : "text-white"
              }`}
            >
              {total.isNegative && (
                <span className="text-2xl sm:text-3xl mr-1">−</span>
              )}
              <span className="text-5xl sm:text-6xl tracking-tighter tabular-nums">
                {formatNumber(total.hours)}
              </span>
              <span className="text-lg sm:text-xl text-zinc-400 font-medium ml-1">
                h
              </span>

              <span className="text-5xl sm:text-6xl tracking-tighter tabular-nums ml-2">
                {formatNumber(total.minutes)}
              </span>
              <span className="text-lg sm:text-xl text-zinc-400 font-medium ml-1">
                m
              </span>
            </div>

            {total.totalEntries > 0 && (
              <p className="mt-3 text-xs text-zinc-600">
                {total.totalEntries}{" "}
                {total.totalEntries === 1 ? "entry" : "entries"}
              </p>
            )}
          </div>
        </section>

        {/* Input Form */}
        <form onSubmit={addEntry} className="p-6 pt-2 space-y-5">
          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <input
                type="number"
                placeholder="00"
                min="0"
                value={currentHours}
                onChange={(e) => setCurrentHours(e.target.value)}
                className="w-full bg-white/3 border border-white/8 rounded-2xl py-4 px-4 text-2xl font-bold text-center text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/50 focus:bg-white/5 transition-all duration-200 tabular-nums"
              />
              <label className="absolute -bottom-5 left-0 right-0 text-center text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Hours
              </label>
            </div>

            <div className="relative group">
              <input
                type="number"
                placeholder="00"
                min="0"
                max="59"
                value={currentMinutes}
                onChange={(e) => setCurrentMinutes(e.target.value)}
                className="w-full bg-white/3 border border-white/8 rounded-2xl py-4 px-4 text-2xl font-bold text-center text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/50 focus:bg-white/5 transition-all duration-200 tabular-nums"
              />
              <label className="absolute -bottom-5 left-0 right-0 text-center text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Minutes
              </label>
            </div>
          </div>

          {/* Operation Toggle & Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {/* Operation Toggle */}
            <div className="flex-1 flex bg-white/3 border border-white/8 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setOperation("add")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  operation === "add"
                    ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icons.Plus size={16} />
                Add
              </button>
              <button
                type="button"
                onClick={() => setOperation("subtract")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  operation === "subtract"
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icons.Minus size={16} />
                Sub
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!currentHours && !currentMinutes}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span>{editingId ? "Update" : "Append"}</span>
              <Icons.Plus size={16} className="opacity-60" />
            </button>
          </div>
        </form>

        {/* History Section */}
        <section className="border-t border-white/8">
          <div className="px-6 py-4 flex items-center gap-2 text-zinc-500">
            <Icons.History size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              History
            </span>
            {entries.length > 0 && (
              <span className="ml-auto text-xs text-zinc-600">
                {entries.length} items
              </span>
            )}
          </div>

          <div className="px-6 pb-6 max-h-48 overflow-y-auto scrollbar-hidden">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
                <div className="w-12 h-12 rounded-full bg-white/3 flex items-center justify-center mb-3">
                  <Icons.History size={20} className="opacity-50" />
                </div>
                <p className="text-sm">No entries yet</p>
                <p className="text-xs mt-1 opacity-60">
                  Add your first time entry
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="group flex items-center justify-between bg-white/3 hover:bg-white/6 border border-white/4 rounded-xl px-4 py-3 transition-all duration-200 animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          entry.operation === "add"
                            ? "bg-accent/20 text-accent"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {entry.operation === "add" ? "+" : "−"}
                      </div>
                      <span className="font-semibold tabular-nums">
                        {entry.hours}h {entry.minutes}m
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => editEntry(entry)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                        title="Edit entry"
                      >
                        <Icons.Edit size={14} />
                      </button>

                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="Remove entry"
                      >
                        <Icons.X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          <div className="relative glass-card w-full max-w-sm p-6 text-center transform scale-100 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <Icons.AlertCircle className="w-6 h-6 text-red-500" />
            </div>

            <h2 className="text-lg font-heading font-bold mb-2">
              Clear All Entries?
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              This will permanently delete all {entries.length} time entries.
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-zinc-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HourCalculator;
