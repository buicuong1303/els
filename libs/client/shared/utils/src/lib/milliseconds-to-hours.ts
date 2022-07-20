/* eslint-disable @typescript-eslint/no-explicit-any */

const millisecondsToHours = (duration: number, isAccurateToMilliseconds = false): string => {
  let  seconds:any = Math.floor((duration / 1000) % 60);
  let minutes:any = Math.floor((duration / (1000 * 60)) % 60);
  let hours:any = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  if (isAccurateToMilliseconds) {
    const milliseconds = (duration % 1000) / 100;
    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  }


  return hours + ':' + minutes + ':' + seconds;
};

export { millisecondsToHours };