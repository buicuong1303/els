export function readAsArrayBuffer(file: File) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      if (
        file.type.split('/')[0] === 'image' &&
        file.type !== 'image/tif' &&
        file.type !== 'image/tiff'
      ) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = function () {
          URL.revokeObjectURL(image.src);
          return resolve({
            data: fileReader.result,
            name: file.name || '',
            size: file.size,
            type: file.type,
          });
        };
      } else {
        return resolve({
          data: fileReader.result,
          name: file.name || '',
          size: file.size,
          type: file.type,
        });
      }
    };
    // fileReader.readAsBinaryString(file);
    fileReader.readAsArrayBuffer(file);
  });
}
