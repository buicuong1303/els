export const nextLevel = (level: number): number => {
  const exponent = 1.5;
  const baseXP = 1000;
  return Math.floor(baseXP * ( Math.pow(level, exponent)));
};