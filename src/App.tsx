import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { TitleBar } from "./components/TitleBar";
import { SplashPage } from "./pages/SplashPage";
import { HomePage } from "./pages/HomePage";
import { ModePage } from "./pages/ModePage";
import { StagePage } from "./pages/StagePage";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { SettingsProvider } from "./context/SettingsContext";
import "./App.css";

function App() {
  return (
    <SettingsProvider>
    <MemoryRouter initialEntries={["/"]}>
      <div className="app-layout">
        <TitleBar />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/mode" element={<ModePage />} />
          <Route path="/difficulty" element={<StagePage />} />
          <Route path="/game" element={<GamePage />} />
<Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MemoryRouter>
    </SettingsProvider>
  );
}

export default App;
