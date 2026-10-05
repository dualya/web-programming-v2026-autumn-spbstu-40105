export const GRID_SIZE = 20;
export const INITIAL_SPEED = 250;
export const SPEED_STEP = 5;
export const MIN_SPEED = 60;

export const getInitialSnake = () => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const generateFood = (snake) => {
  const free = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!snake.some((s) => s.x === x && s.y === y)) {
        free.push({ x, y });
      }
    }
  }
  if (free.length === 0) {
    return null;
  }
  return free[Math.floor(Math.random() * free.length)];
};