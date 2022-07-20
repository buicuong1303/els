export const greenToRed = (total: number, current: number): string => {
    const red = Math.floor(255 - (255 * current / total));
    const green = Math.floor(255 * current / total);
    return 'rgb('+red+','+green+',0)';
}