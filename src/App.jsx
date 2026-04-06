import HourCalculator from "./components/HourCalculator";
import { Routes, Route } from "react-router-dom";
import SalaryCalculator from "./components/SalaryCalculator";
import SimpleCalculator from "./components/SimpleCalculator";
import AppNavbar from "./components/AppNavbar";

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-[#030303]">
       <AppNavbar />
      <Routes>
        <Route path="/" element={<HourCalculator />} />
        <Route path="/salary" element={<SalaryCalculator />} />
        <Route path="/calculator" element={<SimpleCalculator />} />
      </Routes>
    </main>
  );
}

export default App;
