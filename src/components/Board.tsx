import { Tile } from './Tile';

/**
 * Properties for the puzzle Board component.
 */
interface BoardProps {
  /**
   * The list of tiles represented as an array of numbers.
   * `0` represents the empty/blank space.
   */
  tiles: number[];
  /**
   * The width/height size of the square board (e.g., 3, 4, 5).
   */
  boardSize: number;
  /**
   * Callback event triggered when a tile is clicked.
   * @param index The index of the clicked tile in the tiles array.
   */
  onTileClick: (index: number) => void;
}

/**
 * The Board component manages the puzzle layout.
 * Arranges tiles into a grid corresponding to the selected board size.
 */
export const Board = ({ tiles, boardSize, onTileClick }: BoardProps) => {
  const gridStyle = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[boardSize] || 'grid-cols-4';

  return (
    <div className="relative p-3 sm:p-5 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mx-auto w-fit">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 to-white/10 pointer-events-none"></div>
      
      <div className={`relative z-10 grid ${gridStyle} gap-2 sm:gap-3`}>
        {tiles.map((val, index) => (
          <Tile key={index} value={val} isEmpty={val === 0} onClick={() => onTileClick(index)} />
        ))}
      </div>
    </div>
  );
};
