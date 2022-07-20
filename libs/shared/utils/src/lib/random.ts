export class RandomUtil {
  static getRandomIndexes(n: number, length: number, result: number[]): any{
    if (n > length) return;
    if (result.length === n) return result;
    const index = Math.floor(Math.random() * length);
    if (!result.includes(index)) {
      result.push(index);
    } 
    return this.getRandomIndexes(n, length, result);
  }
}
