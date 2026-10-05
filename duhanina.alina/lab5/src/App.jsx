import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GRID_SIZE,
  INITIAL_SPEED,
  SPEED_STEP,
  MIN_SPEED,
  getInitialSnake,
  generateFood,
} from './game.js';

function App() {
  const [snake, setSnake] = useState(getInitialSnake());
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isStarted) return;
      const key = e.key.toLowerCase();

      if (key === ' ' || key === 'escape') {
        e.preventDefault();
        if (!gameOver) setIsPaused((p) => !p);
        return;
      }

      if (gameOver) return;

      const current = directionRef.current;
      const trySetDirection = (newDir) => {
        if (current.x + newDir.x === 0 && current.y + newDir.y === 0) return;
        setDirection(newDir);
      };

      switch (key) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          trySetDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          trySetDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          trySetDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          trySetDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isStarted]);

  useEffect(() => {
    if (!isStarted || gameOver || isPaused) return;

    const tick = () => {
      setSnake((prevSnake) => {
        const dir = directionRef.current;
        const head = prevSnake[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const willEat = food && newHead.x === food.x && newHead.y === food.y;
        const bodyToCheck = willEat ? prevSnake : prevSnake.slice(0, -1);

        if (bodyToCheck.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (willEat) {
          setScore((sc) => sc + 10);
          setSpeed((sp) => Math.max(MIN_SPEED, sp - SPEED_STEP));
          const newFood = generateFood(newSnake);
          if (!newFood) setGameOver(true);
          else setFood(newFood);
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [isStarted, gameOver, isPaused, speed, food]);

  useEffect(() => {
    const f = generateFood(getInitialSnake());
    if (f) setFood(f);
  }, []);

  const startGame = useCallback(() => setIsStarted(true), []);

  const restartGame = useCallback(() => {
    const newSnake = getInitialSnake();
    setSnake(newSnake);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
    setIsStarted(true);
    setFood(generateFood(newSnake));
  }, []);

  const boardKey = snake.map((s) => `${s.x},${s.y}`).join('|');

  const renderCells = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
        const isSnake = snake.some((s) => s.x === x && s.y === y);
        const isFood = food && food.x === x && food.y === y;

        let cls = 'cell';
        if (isHead) cls += ' snake-head';
        else if (isSnake) cls += ' snake-body';
        if (isFood) cls += ' food';

        cells.push(<div key={`${x}-${y}`} className={cls} />);
      }
    }
    return cells;
  };

  return (
    <div className="game-container">
      <h1>Змейка</h1>

      <div className="stats">
        <div className="score" data-testid="game-score">
          Счёт: {score}
        </div>
        <div className="length">Длина: {snake.length}</div>
      </div>

      <div className="board-wrapper">
        <div
          className="board"
          data-testid="game-board"
          data-state={boardKey}
          data-game-over={gameOver}
          data-paused={isPaused}
          data-started={isStarted}
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {renderCells()}
        </div>

        {(!isStarted || gameOver || isPaused) && (
          <div className="overlay">
            <div className="overlay-content">
              {!isStarted && !gameOver && !isPaused && (
                <>
                  <h2>Змейка</h2>
                  <p>Управление: WASD или стрелки</p>
                  <p>Пауза: Пробел</p>
                  <button
                    onClick={startGame}
                    className="btn"
                    data-testid="game-restart"
                  >
                    ▶ Начать игру
                  </button>
                </>
              )}

              {gameOver && (
                <>
                  <h2>Игра окончена!</h2>
                  <p>Ваш счёт: {score}</p>
                  <button
                    onClick={restartGame}
                    className="btn"
                    data-testid="game-restart"
                  >
                    Новая игра
                  </button>
                </>
              )}

              {isPaused && !gameOver && (
                <>
                  <h2>⏸ Пауза</h2>
                  <p className="hint">Нажмите пробел, чтобы продолжить</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="btn"
                  >
                    ▶ Продолжить
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hint">
        Управление: <b>WASD</b> или <b>стрелки</b> | Пауза: <b>Пробел</b>
      </div>
    </div>
  );
}

export default App;