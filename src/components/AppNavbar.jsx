import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "Hour" },
  { path: "/salary", label: "Salary" },
  { path: "/calculator", label: "Calculator" },
];

const AppNavbar = () => {
  const location = useLocation();

  return (
    <div className="w-full md:max-w-md mx-auto md:px-4 pt-6 animate-fade-in sticky top-0 z-50 mb-4 md:mb-0">
      <div className="glass-card p-2 flex gap-2 backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AppNavbar;