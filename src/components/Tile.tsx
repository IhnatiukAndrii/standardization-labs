interface TileProps {
  value: number;
  isEmpty?: boolean;
  onClick: () => void;
}

export const Tile = ({ value, isEmpty, onClick }: TileProps) => {
  if (isEmpty) {
    return <div className="w-16 h-16 sm:w-20 sm:h-20 sm:max-w-24 sm:max-h-24 rounded-2xl bg-slate-100/50 shadow-inner"></div>;
  }

  return (
    <div 
      onClick={onClick}
      className="w-16 h-16 sm:w-20 sm:h-20 sm:max-w-24 sm:max-h-24 flex items-center justify-center rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 select-none overflow-hidden relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/0 via-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="text-2xl sm:text-3xl font-black text-slate-700 drop-shadow-sm">{value}</span>
    </div>
  );
};
