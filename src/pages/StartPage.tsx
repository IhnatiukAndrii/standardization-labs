import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { useStore } from '../store';

export const StartPage = () => {
  const navigate = useNavigate();
  const userName = useStore((state) => state.userName);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] p-4 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50">
      <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white w-full max-w-md text-center transform transition-all">
        <Header />
        
        {userName && (
          <p className="mt-4 text-violet-700 font-medium">Вітаємо, {userName}!</p>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <Button onClick={() => navigate('/game')} className="w-full py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Почати Гру
          </Button>
          <Button variant="secondary" onClick={() => navigate('/settings')} className="w-full py-4">
            Налаштування
          </Button>
          <Button variant="secondary" onClick={() => navigate('/results')} className="w-full py-4">
            Таблиця результатів
          </Button>
        </div>
      </div>
    </div>
  );
};
