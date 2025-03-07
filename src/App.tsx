import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
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
const InventoryDashboard = lazy(
  () => import("./components/inventory/InventoryDashboard"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/database" element={<DatabaseManagement />} />
          <Route
            path="/production-tracking"
            element={<ProductionOrderTracking />}
          />
          <Route path="/production" element={<ProductionBoard />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
