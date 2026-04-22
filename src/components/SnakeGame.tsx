import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const CONSTANT_SPEED = 120; // ms per tick

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const gameLoop = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prev) => {
      const newHead = {
        x: (prev[0].x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
        y: (prev[0].y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPlaying, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    const intervalId = setInterval(gameLoop, CONSTANT_SPEED);
    return () => clearInterval(intervalId);
  }, [gameLoop]);

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end border-b-4 border-cyan-500 pb-2">
        <div className="uppercase tracking-widest text-magenta-400 text-3xl md:text-4xl font-black glitch-text hidden md:block" data-text="DATA_ACQUISITION">DATA_ACQUISITION</div>
        <div className="text-right flex-1">
           <div className="text-lg text-cyan-500 uppercase tracking-widest border-b border-cyan-900/50 mb-1 inline-block pb-1">Packets Extracted</div>
           <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(0,255,255,1)]">
             {score.toString().padStart(5, '0')}
           </div>
        </div>
      </div>
      
      <div className="relative aspect-square w-full bg-[#050505] border-4 border-magenta-500 shadow-[0_0_30px_rgba(255,0,255,0.4)] glitch-border p-1">
        <div 
          className="absolute inset-0 grid bg-black"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Background grid lines */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(cyan 1px, transparent 1px)', backgroundSize: '5% 5%' }}></div>

          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border border-cyan-900/40 relative ${
                  isSnakeHead ? 'bg-magenta-500 z-10' :
                  isSnakeBody ? 'bg-cyan-500/80 z-10' :
                  isFood ? 'bg-white z-10' : ''
                }`}
              >
                  {isSnakeHead && <div className="absolute inset-[2px] bg-white animate-pulse"></div>}
                  {isSnakeBody && <div className="absolute inset-[2px] bg-cyan-400"></div>}
                  {isFood && <div className="absolute inset-[-4px] bg-white animate-ping opacity-50 rounded-full"></div>}
              </div>
            );
          })}
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center backdrop-blur-sm z-30">
             <div className="text-6xl md:text-8xl font-black text-red-500 mb-8 uppercase text-center glitch-text drop-shadow-[0_0_15px_red]" data-text={gameOver ? "FATAL ERROR" : "STANDBY"}>
                {gameOver ? 'FATAL ERROR' : 'STANDBY'}
             </div>
             {gameOver && (
                <div className="text-cyan-400 text-3xl uppercase mb-12 font-bold tracking-widest text-center px-4">
                  CONNECTION TERMINATED <br/>
                  <span className="text-magenta-400 text-4xl mt-4 block">SCORE: {score}</span>
                </div>
             )}
             <button
               onClick={resetGame}
               className="bg-black border-4 border-cyan-400 px-10 py-5 text-4xl font-black text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors uppercase tracking-widest cursor-pointer shadow-[0_0_30px_cyan]"
             >
               {gameOver ? 'EXECUTE REBOOT' : 'INITIALIZE UPLINK'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
