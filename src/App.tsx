import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./styles/theme";
import { lazy, Suspense } from "react";

const MainLayout = lazy(() => import("./layouts/MainLayout"));

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TradePage = lazy(() => import("./pages/TradePage"));
const MarketsPage = lazy(() => import("./pages/MarketsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}