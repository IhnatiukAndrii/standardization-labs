import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import { GamePage } from './pages/GamePage';
import { SettingsPage } from './pages/SettingsPage';
import { ResultsTablePage } from './pages/ResultsTablePage';
import { useStore } from './store';

function App() {
  const userId = useStore((state) => state.userId);

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-200">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/results" element={<ResultsTablePage />} />
          <Route 
            path="/game" 
            element={userId ? <GamePage /> : <Navigate to="/settings" replace />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
