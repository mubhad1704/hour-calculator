import React, { useState, useMemo } from "react";

// Reuse your Icons if already defined
const Icons = {
  Plus: ({ size = 16 }) => <span>＋</span>,
  X: ({ size = 14 }) => <span>✕</span>,
  Edit: ({ size = 14 }) => <span>✎</span>,
  History: ({ size = 14 }) => <span>🕘</span>,
};

const SalaryCalculator = () => {
  const [totalSalary, setTotalSalary] = useState("");
  const [workingDays, setWorkingDays] = useState("");

  const [value, setValue] = useState("");
  const [mode, setMode] = useState("worked"); // worked | absent

  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const addEntry = (e) => {
    e.preventDefault();

    const val = parseInt(value) || 0;
    if (!val) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId ? { ...entry, value: val, mode } : entry
        )
      );
      setEditingId(null);
    } else {
      setEntries([
        { id: Date.now(), value: val, mode },
        ...entries,
      ]);
    }

    setValue("");
  };

  const editEntry = (entry) => {
    setValue(entry.value);
    setMode(entry.mode);
    setEditingId(entry.id);
  };

  const removeEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const result = useMemo(() => {
  const salary = parseFloat(totalSalary) || 0;
  const totalDays = parseInt(workingDays) || 0;

  if (!salary || !totalDays) {
    return { finalSalary: 0, perDay: 0, worked: 0, absent: 0 };
  }

  const perDay = salary / totalDays;

  let worked = 0;
  let absent = 0;

  entries.forEach((e) => {
    if (e.mode === "worked") worked += e.value;
    else absent += e.value;
  });

  let finalSalary = 0;

  if (worked > 0 && absent === 0) {
    // Only worked entries
    finalSalary = perDay * worked;
  } else if (absent > 0 && worked === 0) {
    // Only absent entries
    finalSalary = salary - perDay * absent;
  } else {
    // Mixed entries (advanced case)
    finalSalary = perDay * worked - perDay * absent;
  }

  return {
    perDay,
    finalSalary: Math.max(0, finalSalary),
    worked,
    absent,
  };
}, [totalSalary, workingDays, entries]);
  return (
    <div className="w-full md:max-w-md mx-auto md:px-4 md:py-8 animate-fade-in">
      <div className="glass-card overflow-hidden">

        {/* Header */}
        <header className="p-6 border-b border-white/8">
          <h1 className="text-xl font-heading font-bold text-center">
            Salary Calculator
          </h1>
        </header>

        {/* Salary Inputs */}
        <section className="p-6 space-y-3">
          <input
            type="number"
            placeholder="Total Salary"
            value={totalSalary}
            onChange={(e) => setTotalSalary(e.target.value)}
            className="input"
          />

          <input
            type="number"
            placeholder="Working Days"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            className="input"
          />
        </section>

        {/* Result */}
        <section className="relative p-6 bg-linear-to-b from-white/2 to-transparent">
          <div
            className="absolute inset-0 bg-accent/5 transition-opacity"
            style={{ opacity: isAnimating ? 0.4 : 0 }}
          />

          <div className="relative text-center">
            <p className="text-xs text-zinc-500 uppercase">
              Per Day Salary
            </p>
            <h2 className="text-xl font-bold">
              ₹ {result.perDay.toFixed(2)}
            </h2>

            <p className="text-xs text-zinc-500 mt-3 uppercase">
              Final Salary
            </p>
            <h1 className="text-4xl font-bold text-green-400">
              ₹ {result.finalSalary.toFixed(2)}
            </h1>

            <p className="text-xs text-zinc-600 mt-2">
              Worked: {result.worked} | Absent: {result.absent}
            </p>
          </div>
        </section>

        {/* Entry Input */}
        <form onSubmit={addEntry} className="p-6 space-y-4">
          <input
            type="number"
            placeholder={mode === "worked" ? "Days Worked" : "Days Absent"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input"
          />

          {/* Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("worked")}
              className={`flex-1 py-2 rounded-lg ${
                mode === "worked"
                  ? "bg-accent text-white"
                  : "text-zinc-400"
              }`}
            >
              Worked
            </button>
            <button
              type="button"
              onClick={() => setMode("absent")}
              className={`flex-1 py-2 rounded-lg ${
                mode === "absent"
                  ? "bg-red-500 text-white"
                  : "text-zinc-400"
              }`}
            >
              Absent
            </button>
          </div>

          <button className="btn-primary w-full">
            {editingId ? "Update Entry" : "Add Entry"}
          </button>
        </form>

        {/* History */}
        <section className="border-t border-white/8">
          <div className="px-6 py-4 flex items-center gap-2 text-zinc-500">
            <Icons.History />
            <span className="text-xs uppercase">History</span>
          </div>

          <div className="px-6 pb-6 max-h-48 overflow-y-auto space-y-2">
            {entries.length === 0 ? (
              <p className="text-center text-zinc-600 text-sm">
                No entries yet
              </p>
            ) : (
              entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center bg-white/3 px-4 py-2 rounded-xl"
                >
                  <div>
                    <span className="text-sm">
                      {entry.mode === "worked" ? "+" : "-"}{" "}
                      {entry.value} days
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => editEntry(entry)}>
                      <Icons.Edit />
                    </button>
                    <button onClick={() => removeEntry(entry.id)}>
                      <Icons.X />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default SalaryCalculator;