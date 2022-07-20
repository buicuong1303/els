import { HttpService } from '@nestjs/common';
import * as translate from 'extended-google-translate-api';

export async function extendedGoogleTranslate(sentence: string, from?: string, to?: string) {
  let data: any = {};
  // translate.defaultDataOptions.detailedTranslationsSynonyms = true;
  // translate.defaultDataOptions.definitionExamples = true
  // translate.defaultDataOptions.definitionSynonyms = true;
  let formatSentence = sentence.split('.').join(',,');
  formatSentence = formatSentence.split(';').join(',,');
  formatSentence = formatSentence.split('?').join('::');
  if(from && to){
    await translate(formatSentence, from, to).then((res: any) => {
      data = res;
    }).catch(console.log);
  } else {
    await translate(formatSentence, 'en', 'vi').then((res: any) => {
      data = res;
    }).catch(console.log);
  }
  let stringTranslation = data.translation.split(',,').join('.');
  stringTranslation = stringTranslation.split('::').join('?');
  return stringTranslation;
};

export async function nlpTranslation(httpService: HttpService, sentence: string, from: string, to: string) {
  try{
    const headersRequest = {
      'x-rapidapi-host': process.env.TRANSLATION_API_HOST,
      'x-rapidapi-key' : process.env.TRANSLATION_API_KEY
    };
    const url = process.env.TRANSLATION_API_URL;
    const resultApi: any = await httpService.get(`${url}?text=${sentence}&to=${to}&from=${from}`, {headers: headersRequest}).toPromise();
    const result = resultApi.data;
    return result.translated_text[to];
  } catch (err) {
    console.log(err);
  };
};