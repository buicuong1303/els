export const stringComparison = (str1: string, str2: string, aEqualA: boolean) => {
  if (aEqualA) return str1.toLocaleLowerCase() === str2.toLocaleLowerCase();
  return str1 === str2;
}
