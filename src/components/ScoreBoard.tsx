interface ScoreBoardProps {
  moves: number;
  time: string;
}

export const ScoreBoard = ({ moves, time }: ScoreBoardProps) => {
  return (
    <div className="flex gap-4 sm:gap-8 w-full">
      <div className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-100 p-4 rounded-3xl shadow-sm text-center">
        <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Кроків</div>
        <div className="text-3xl sm:text-4xl font-black text-violet-600">{moves}</div>
      </div>
      <div className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-100 p-4 rounded-3xl shadow-sm text-center">
        <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Час</div>
        <div className="text-3xl sm:text-4xl font-black text-violet-600">{time}</div>
      </div>
    </div>
  );
};
