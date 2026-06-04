import { useState, useEffect, useCallback } from 'react';

export const useGame = (boardSize: number) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const totalTiles = boardSize * boardSize;

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const sec = (totalSeconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const checkWin = useCallback((currentTiles: number[]) => {
    for (let i = 0; i < totalTiles - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[totalTiles - 1] === 0;
  }, [totalTiles]);

  const isSolvable = useCallback((puzzle: number[]) => {
    let inversions = 0;
    let emptyRow = 0;
    
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i] === 0) {
        emptyRow = Math.floor(i / boardSize);
        continue;
      }
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[j] !== 0 && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    
    if (boardSize % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      const rowFromBottom = boardSize - emptyRow;
      if (rowFromBottom % 2 === 0) {
        return inversions % 2 !== 0;
      } else {
        return inversions % 2 === 0;
      }
    }
  }, [boardSize]);

  const shuffleTiles = useCallback(() => {
    let newTiles: number[] = [];
    do {
      newTiles = Array.from({ length: totalTiles }, (_, i) => i);
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles) || checkWin(newTiles));
    
    setTiles(newTiles);
    setMoves(0);
    setElapsedSeconds(0);
    setIsWon(false);
    setIsActive(true);
  }, [totalTiles, isSolvable, checkWin]);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      if (!ignore) {
        shuffleTiles();
      }
    }, 0);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [shuffleTiles]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  const handleTileClick = useCallback((index: number) => {
    if (isWon || !isActive) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const emptyRow = Math.floor(emptyIndex / boardSize);
    const emptyCol = emptyIndex % boardSize;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (checkWin(newTiles)) {
        setIsWon(true);
        setIsActive(false);
      }
    }
  }, [tiles, isWon, isActive, boardSize, checkWin]);

  const abandonGame = () => {
    setIsActive(false);
  };

  return {
    tiles,
    moves,
    time: formatTime(elapsedSeconds),
    isWon,
    handleTileClick,
    shuffleTiles,
    abandonGame,
  };
};
