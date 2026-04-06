import React, { useState, useMemo } from "react";

// Icons (reuse your existing Icons if already defined)
const Icons = {
  History: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  X: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const SimpleCalculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (val) => {
    setExpression((prev) => prev + val);
  };

  const clear = () => {
    setExpression("");
    setResult("");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const evaluateExpression = () => {
    try {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      // smarter % handling
      let exp = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      const evalResult = eval(exp);

      setResult(evalResult);

      // save to history
      setHistory((prev) => [
        { exp: expression, res: evalResult, id: Date.now() },
        ...prev,
      ]);
    } catch {
      setResult("Error");
    }
  };

  const buttons = [
    "7","8","9","/",
    "4","5","6","*",
    "1","2","3","-",
    "0",".","%","+",
  ];

  return (
    <div className="w-full md:max-w-md mx-auto md:px-4 md:py-8 animate-fade-in">
      <div className="glass-card overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-white/8">
          <h1 className="text-xl font-heading font-bold">Calculator</h1>
        </header>

        {/* Display */}
        <section className="relative p-6 bg-linear-to-b from-white/2 to-transparent">
          <div
            className="absolute inset-0 bg-accent/5 transition-opacity duration-500"
            style={{ opacity: isAnimating ? 0.4 : 0 }}
          />

          <div className="relative text-right">
            <div className="text-zinc-500 text-sm break-all min-h-[20px]">
              {expression || "0"}
            </div>
            <div className="text-4xl font-bold text-white mt-2 tabular-nums">
              {result}
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="p-6 grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="py-4 rounded-xl bg-white/5 hover:bg-white/10 text-lg font-semibold transition-all active:scale-95"
            >
              {btn}
            </button>
          ))}

          {/* Controls */}
          <button
            onClick={clear}
            className="col-span-2 py-4 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition-all"
          >
            Clear
          </button>

          <button
            onClick={backspace}
            className="py-4 rounded-xl bg-yellow-500/80 hover:bg-yellow-600 text-white"
          >
            ⌫
          </button>

          <button
            onClick={evaluateExpression}
            className="py-4 rounded-xl bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            =
          </button>
        </section>

        {/* History */}
        <section className="border-t border-white/8">
          <div className="px-6 py-4 flex items-center gap-2 text-zinc-500">
            <Icons.History size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              History
            </span>
            {history.length > 0 && (
              <span className="ml-auto text-xs text-zinc-600">
                {history.length} items
              </span>
            )}
          </div>

          <div className="px-6 pb-6 max-h-48 overflow-y-auto scrollbar-hidden">
            {history.length === 0 ? (
              <div className="text-center text-zinc-600 py-6 text-sm">
                No calculations yet
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between bg-white/3 hover:bg-white/6 border border-white/4 rounded-xl px-4 py-3 transition-all animate-slide-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500">
                        {item.exp}
                      </span>
                      <span className="font-semibold">
                        = {item.res}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setHistory((prev) =>
                          prev.filter((h) => h.id !== item.id)
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                    >
                      <Icons.X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default SimpleCalculator;