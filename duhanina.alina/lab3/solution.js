export function findPairsWithSum(arr, sum) {
  const seen = new Set();
  const pairs = [];
  const used = new Set();

  for (const num of arr) {
    const need = sum - num;

    if (seen.has(need)) {
      const a = Math.min(num, need);
      const b = Math.max(num, need);
      const key = `${a},${b}`;

      if (!used.has(key)) {
        pairs.push([a, b]);
        used.add(key);
      }
    }

    seen.add(num);
  }

  return pairs;
}
