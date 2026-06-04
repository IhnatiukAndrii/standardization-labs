import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

export const ResultsTablePage = () => {
  const navigate = useNavigate();
  const allResults = useStore((state) => state.results);

  const flatResults = Object.entries(allResults).flatMap(([uid, games]) => 
    games.map(g => ({ ...g, uid }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col items-center min-h-[100svh] p-6 sm:p-12 bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <Header />
      <div className="w-full max-w-3xl mt-8 bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] shadow-2xl border border-white/60">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-6 border-b border-slate-200 pb-4 text-center">
          Таблиця Рекордів
        </h2>
        
        {flatResults.length === 0 ? (
          <p className="text-slate-500 italic text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            Жодних результатів ще немає. Будьте першим!
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left bg-white">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-600">Гравець</th>
                  <th className="p-4 font-bold text-slate-600">Дата</th>
                  <th className="p-4 font-bold text-slate-600">Кроків</th>
                  <th className="p-4 font-bold text-slate-600">Час</th>
                </tr>
              </thead>
              <tbody>
                {flatResults.map((res, i) => (
                  <tr key={res.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4 font-semibold text-slate-800">{res.uid}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(res.date).toLocaleString('uk-UA')}</td>
                    <td className="p-4 font-bold text-violet-600">{res.moves}</td>
                    <td className="p-4 font-bold text-violet-600">{res.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10">
          <Button onClick={() => navigate('/')} className="w-full py-4 text-lg">Повернутися до Меню</Button>
        </div>
      </div>
    </div>
  );
};
