import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Layout from "./components/layout/Layout";
import routes from "tempo-routes";

// Lazy load components for better performance
const DatabaseManagement = lazy(
  () => import("./components/database/DatabaseManagement"),
);
const ProductionOrderTracking = lazy(
  () => import("./components/production/ProductionOrderTracking"),
);
const ProductionBoard = lazy(
  () => import("./components/production/ProductionBoard"),
);
const ProductionLog = lazy(
  () => import("./components/production/ProductionLog"),
);
const InventoryDashboard = lazy(
  () => import("./components/inventory/InventoryDashboard"),
);
const PersonnelList = lazy(
  () => import("./components/personnel/PersonnelList"),
);
const AttendanceSheet = lazy(
  () => import("./components/personnel/AttendanceSheet"),
);
const MoldManagement = lazy(
  () => import("./components/inventory/MoldManagement"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="database" element={<DatabaseManagement />} />
            <Route
              path="production-tracking"
              element={<ProductionOrderTracking />}
            />
            <Route path="production" element={<ProductionBoard />} />
            <Route path="production-log" element={<ProductionLog />} />
            <Route path="inventory" element={<InventoryDashboard />} />
            <Route path="molds" element={<MoldManagement />} />
            <Route path="personnel/list" element={<PersonnelList />} />
            <Route path="personnel/attendance" element={<AttendanceSheet />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
