export const NumberToK = (num: number): string => {
  if(num === 1000 && num < 1000000) return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  
  if (num >= 1000000) return (num/1000000).toFixed(1) + 'M'; // convert to M for number from >= 1 million

  return num.toString();
};