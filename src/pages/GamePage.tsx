import { useNavigate } from 'react-router-dom';
import { Board } from '../components/Board';
import { ScoreBoard } from '../components/ScoreBoard';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { useGame } from '../hooks/useGame';
import { useStore } from '../store';

export const GamePage = () => {
  const navigate = useNavigate();
  const settings = useStore((state) => state.settings);
  const addResult = useStore((state) => state.addResult);
  
  const { tiles, moves, time, isWon, handleTileClick, shuffleTiles, abandonGame } = useGame(settings.boardSize);

  const handleGiveUp = () => {
    abandonGame();
    navigate('/');
  };

  const handleNextRound = () => {
    addResult({ moves, time });
    navigate('/');
  };

  const handlePlayAgain = () => {
    addResult({ moves, time });
    shuffleTiles();
  };

  return (
    <div className="flex flex-col items-center min-h-[100svh] py-8 sm:py-12 px-4 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50">
      <Header />
      
      <div className="w-full max-w-xl flex flex-col items-center mt-6 bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white">
        <ScoreBoard moves={moves} time={time} />
        
        <div className="my-6">
          <Board tiles={tiles} boardSize={settings.boardSize} onTileClick={handleTileClick} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <Button variant="secondary" onClick={shuffleTiles} className="flex-1 shadow-md hover:shadow-lg">
            Почати заново
          </Button>
          <Button variant="danger" onClick={handleGiveUp} className="flex-1 shadow-md hover:shadow-lg">
            Здатися
          </Button>
        </div>
      </div>

      <Modal isOpen={isWon}>
        <div className="text-center p-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Перемога!</h2>
          <p className="text-slate-500 mb-8">Чудовий результат.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Кроків</span>
              <span className="text-2xl font-bold text-violet-600">{moves}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Час</span>
              <span className="text-2xl font-bold text-violet-600">{time}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handlePlayAgain} className="w-full py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Грати Ще Раз (Такий же розмір)
            </Button>
            <Button variant="secondary" onClick={handleNextRound} className="w-full">
              Повернутися в Меню
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
