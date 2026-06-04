import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useStore } from '../store';

interface SettingsForm {
  username: string;
  boardSize: number;
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const setUserId = useStore((state) => state.setUserId);
  const setSettings = useStore((state) => state.setSettings);
  const currentUserName = useStore((state) => state.userName);
  const currentBoardSize = useStore((state) => state.settings.boardSize);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: { 
      username: currentUserName, 
      boardSize: currentBoardSize 
    },
  });

  const onSubmit = (data: SettingsForm) => {
    const generatedId = data.username.toLowerCase().replace(/\s+/g, '-');
    setUserId(generatedId, data.username);
    setSettings({ boardSize: Number(data.boardSize) });
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] p-4 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50">
      <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-white w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 border-b border-slate-200 pb-4 text-center">
          Налаштування
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col text-left gap-2">
            <label htmlFor="username" className="font-bold text-sm text-slate-700 tracking-wide uppercase">Ваше ім'я:</label>
            <input 
              id="username"
              type="text"
              {...register('username', { required: true, minLength: 3 })}
              className="p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner font-medium text-slate-800"
              placeholder="Введіть ім'я..."
            />
            {errors.username && <span className="text-red-500 text-xs font-semibold">Ім'я обов'язкове (мінімум 3 символи)</span>}
          </div>

          <div className="flex flex-col text-left gap-2">
            <label htmlFor="boardSize" className="font-bold text-sm text-slate-700 tracking-wide uppercase">Складність:</label>
            <select 
              id="boardSize" 
              {...register('boardSize')}
              className="p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all cursor-pointer font-medium text-slate-800 shadow-inner"
            >
              <option value={3}>3 x 3 (Легко)</option>
              <option value={4}>4 x 4 (Нормально)</option>
              <option value={5}>5 x 5 (Складно)</option>
            </select>
          </div>

          <div className="flex gap-4 mt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/')} className="flex-1">Скасувати</Button>
            <Button type="submit" className="flex-1 shadow-lg">Зберегти</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
