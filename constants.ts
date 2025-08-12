
export const DEFAULT_ORIGINAL_CODE = `
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  // This is the recursive step
  return n * factorial(n - 1);
}

console.log(factorial(5));
`;

export const DEFAULT_CHANGED_CODE = `
// Using an iterative approach
function factorial(n) {
  let result = 1;
  if (n === 0 || n === 1) {
    return result;
  }
  for (var i = 2; i <= n; i++) {
    result = result * i;
  }
  return result;
}

console.log(factorial(5));
// Expected output: 120
`;
