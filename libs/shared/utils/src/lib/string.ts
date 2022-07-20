export class StringUtil {
  static getIdFromUri(uri: string) {
    const ids = uri.split(':');
    return ids[ids.length - 1];
  }

  static tokenize(word: string) {
    let token: string[] = [];

    if (word.length <= 4) {
      token = word.split('');
    } else if (word.length <= 8) {
      token = word.match(/.{1,2}/g) ?? [];
    } else {
      token = word.match(/.{1,3}/g) ?? [];
    }

    return token;
  }
  static normalize(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/gi, '').replace(/đ/gi, 'd').replace(/\s|,/g, '-');
  }
}
