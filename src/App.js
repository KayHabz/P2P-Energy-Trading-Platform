import Header from "./components/Header.js";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Buy from "./pages/Buy.js";
import Sell from "./pages/Sell.js";
import Dashboard from "./pages/Dashboard.js";
import AdminDashboard from "./pages/AdminDashboard.js";

import { useAccount } from "./context/AccountContext";
import { useAdminCheck } from "./hooks/useAdminCheck.js";

function App() {
  const account = useAccount();
  const isAdmin = useAdminCheck(account);

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route
          path="/dashboard"
          element={isAdmin ? <AdminDashboard /> : <Dashboard />}
        />
      </Routes>
    </main>
  );
}

export default App;
