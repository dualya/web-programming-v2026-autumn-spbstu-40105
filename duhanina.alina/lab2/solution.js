export function isBalanced(str) {
  const pairBrackets = {
    '(': ')',
    '{': '}',
    '[': ']',
  };
  const closingBrackets = Object.values(pairBrackets);
  const stack = [];

  for (let index = 0; index < str.length; index++) {
    const ch = str[index];

    if (ch in pairBrackets) {
      stack.push(ch);
    } else if (closingBrackets.includes(ch)) {
      if (stack.length === 0 || pairBrackets[stack[stack.length - 1]] !== ch) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}
