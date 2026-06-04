export const Header = () => {
  return (
    <header className="mb-2 text-center group cursor-default">
      <div className="inline-block relative">
        <div className="absolute inset-0 bg-violet-400 blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
        <h1 className="relative text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 tracking-tight pb-2 drop-shadow-sm">
          15 Puzzle
        </h1>
      </div>
      <p className="text-slate-500 font-medium tracking-wide uppercase text-sm mt-1">
        Грайте та перемагайте!
      </p>
    </header>
  );
};
