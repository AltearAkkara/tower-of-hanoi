import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { TitleBar } from "./components/TitleBar";
import { SplashPage } from "./pages/SplashPage";
import { HomePage } from "./pages/HomePage";
import { ModePage } from "./pages/ModePage";
import { DifficultyPage } from "./pages/DifficultyPage";
import { GamePage } from "./pages/GamePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import "./App.css";

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="app-layout">
        <TitleBar />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/mode" element={<ModePage />} />
          <Route path="/difficulty" element={<DifficultyPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
