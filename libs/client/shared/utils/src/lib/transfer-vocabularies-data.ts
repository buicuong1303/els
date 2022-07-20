/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { GraphqlTypes } from '@els/client/app/shared/data-access';

interface Example {
  sentence: string;
  translation: string;
}

interface DefinitionWordType {
  explanation: string;
  examples: Example[];
  antonyms: string[];
  synonyms: string[];
}

interface TranslationWordType {
  synonym: string;
  translation: string;
}

export type WordTypes = 'nouns' | 'verbs' | 'adverbs';

export interface WordReferType {
  definition?: {[key in WordTypes]?: DefinitionWordType[]};
  translation?: {[key in WordTypes]?: TranslationWordType[]};
}

export const transferVocabulariesData = (vocabularies: GraphqlTypes.LearningTypes.Vocabulary[]): GraphqlTypes.LearningTypes.Vocabulary[] => {
  const newVocabularies = vocabularies.map((item) => {
    // TODO for test
    // const wordReferFake: WordReferType | null = {
    //   definition: {
    //     nouns: [...new Array(Math.round(Math.random() * 5))].map(() => {
    //       const definitionNoun = {
    //         explanation: 'A person of male gender, with the same parents as you and smaller than you',
    //         examples: [
    //           {
    //             sentence: 'My brother is 10 years old this year',
    //             translation: 'Em trai tôi năm nay 10 tuổi',
    //           }
    //         ],
    //         antonyms: ['Younger brother', 'Brother', 'My brother'],
    //         synonyms: []
    //       };
    //       return definitionNoun;
    //     }),
    //     verbs: [],
    //     adverbs: []
    //   },
    //   translation: {
    //     nouns: [
    //       {
    //         translation: 'Em trai',
    //         synonym: 'Younger brother, My brother'
    //       },
    //       {
    //         translation: 'Em trai của tôi',
    //         synonym: 'My younger brother, My brother'
    //       }
    //     ],
    //     verbs: [],
    //     adverbs: []
    //   }
    // };

    // return {
    //   ...item,
    //   wordRefer: wordReferFake, 
    // }
    // TODO end for test

    const refer: GraphqlTypes.LearningTypes.Vocabulary['reference'] = item.reference;
    const referWord = refer as GraphqlTypes.DictionaryTypes.Word;
    const referPhrase = refer as GraphqlTypes.DictionaryTypes.Phrase;

    const definitionNoun : DefinitionWordType[] = [];
    const definitionVerbs : DefinitionWordType[] = [];
    const definitionAdverbs : DefinitionWordType[] = [];
    const translationNoun : TranslationWordType[] = [];
    const translationVerbs : TranslationWordType[] = [];
    const translationAdverbs : TranslationWordType[] = [];

    if (item.type === 'word') {
      referWord?.meanings?.forEach(meaning => {
        if(meaning.pos?.name === 'noun') {
          const listTranslate : any[] = [];
          meaning.definitions.forEach(definition => {
            let explanation  = '';
            const synonyms : any[] = [];
            const antonyms : any[] = [];
            const examples : Example[] = [];
            definition.synonyms.forEach(synonym => {
              // if(synonym.text !== item.word?.text){
              synonyms.push(synonym.text);
              // }
            });
            definition.detail?.antonyms?.forEach(antonym => {
              antonyms.push(antonym);
            });
            if(definition.explanation){
              explanation = definition.explanation;
            }
            definition.examples.forEach(example => {
              if(example.exampleTranslations.length > 0){
                examples.push({
                  sentence: example.sentence,
                  translation: example.exampleTranslations[0].text
                });
              } else {
                examples.push({
                  sentence: example.sentence,
                  translation: ''
                });
              }
            });
            definitionNoun.push({
              explanation: explanation,
              examples: examples,
              antonyms: antonyms,
              synonyms: synonyms
            });
            definition.translates.forEach(translate => {
              const translateSynonyms : any[] = [];
              translate.meanings?.forEach(translateMeaning => {
                if(translateMeaning.pos?.name === 'noun'){
                  translateMeaning.definitions.forEach(translateDefinition => {
                    translateDefinition.translates.forEach(translateChild => {
                      translateSynonyms.push(translateChild.text);
                    });
                  });
                }
              });
              if(listTranslate.length > 0) {
                let textExisted = false;
                listTranslate.forEach(translateForm => {
                  if(translateForm.translateText === translate.text){
                    textExisted = true;
                    return {
                      translateText: translate.text,
                      translateSynonym: translateForm.translateSynonym.concat(translateSynonyms)
                    };
                  } else {
                    return translateForm;
                  };
                });
                if(!textExisted){
                  listTranslate.push({
                    translateText: translate.text,
                    translateSynonym: translateSynonyms
                  });
                };
              } else {
                listTranslate.push({
                  translateText: translate.text,
                  translateSynonym: translateSynonyms
                });
              };
            });
          });
          listTranslate.forEach(translate => {
            const translateSynonymData: any[] = [];
            if(translate.translateSynonym){
              translate.translateSynonym.forEach((item: any) => {
                if(!translateSynonymData.includes(item)){
                  translateSynonymData.push(item);
                };
              });
            };
            translationNoun.push({
              translation: translate.translateText,
              synonym: translateSynonymData.join(', ')
            });
          });
        };
  
        if(meaning.pos?.name === 'verb') {
          const listTranslate : any[] = [];
          meaning.definitions.forEach(definition => {
            let explanation  = '';
            const synonyms : any[] = [];
            const antonyms : any[] = [];
            const examples : Example[] = [];
            definition.synonyms.forEach(synonym => {
              if(synonym.text !== item.reference?.text){
                synonyms.push(synonym.text);
              }
            });
            definition.detail?.antonyms?.forEach(antonym => {
              antonyms.push(antonym);
            });
            if(definition.explanation){
              explanation = definition.explanation;
            }
            definition.examples.forEach(example => {
              if(example.exampleTranslations.length > 0){
                examples.push({
                  sentence: example.sentence,
                  translation: example.exampleTranslations[0].text
                });
              };
            });
            definitionVerbs.push({
              explanation: explanation,
              examples: examples,
              antonyms: antonyms,
              synonyms: synonyms
            });
            definition.translates.forEach(translate => {
              const translateSynonyms : any[] = [];
              translate.meanings?.forEach(translateMeaning => {
                if(translateMeaning.pos?.name === 'verb'){
                  translateMeaning.definitions.forEach(translateDefinition => {
                    translateDefinition.translates.forEach(translateChild => {
                      translateSynonyms.push(translateChild.text);
                    });
                  });
                }
              });
              if(listTranslate.length > 0) {
                let textExisted = false;
                listTranslate.forEach(translateForm => {
                  if(translateForm.translateText === translate.text){
                    textExisted = true;
                    return {
                      translateText: translate.text,
                      translateSynonym: translateForm.translateSynonym.concat(translateSynonyms)
                    };
                  } else {
                    return translateForm;
                  };
                });
                if(!textExisted){
                  listTranslate.push({
                    translateText: translate.text,
                    translateSynonym: translateSynonyms
                  });
                };
              } else {
                listTranslate.push({
                  translateText: translate.text,
                  translateSynonym: translateSynonyms
                });
              };
            });
          });
          listTranslate.forEach(translate => {
            const translateSynonymData: any[] = [];
            if(translate.translateSynonym){
              translate.translateSynonym.forEach((item: any) => {
                if(!translateSynonymData.includes(item)){
                  translateSynonymData.push(item);
                };
              });
            };
            translationVerbs.push({
              translation: translate.translateText,
              synonym: translateSynonymData.join(', ')
            });
          });
        };
  
        if(meaning.pos?.name === 'adverb') {
          const listTranslate : any[] = [];
          meaning.definitions.forEach(definition => {
            let explanation  = '';
            const synonyms : any[] = [];
            const antonyms : any[] = [];
            const examples : Example[] = [];
            definition.synonyms.forEach(synonym => {
              // if(synonym.text !== item.word?.text){
              synonyms.push(synonym.text);
              // }
            });
            definition.detail?.antonyms?.forEach(antonym => {
              antonyms.push(antonym);
            });
            if(definition.explanation){
              explanation = definition.explanation;
            }
            definition.examples.forEach(example => {
              if(example.exampleTranslations.length > 0){
                examples.push({
                  sentence: example.sentence,
                  translation: example.exampleTranslations[0].text
                });
              };
              examples.push({
                sentence: example.sentence,
                translation: ''
              });
            });
            definitionAdverbs.push({
              explanation: explanation,
              examples: examples,
              antonyms: antonyms,
              synonyms: synonyms
            });
            definition.translates.forEach(translate => {
              const translateSynonyms : any[] = [];
              translate.meanings?.forEach(translateMeaning => {
                if(translateMeaning.pos?.name === 'adverb'){
                  translateMeaning.definitions.forEach(translateDefinition => {
                    translateDefinition.translates.forEach(translateChild => {
                      translateSynonyms.push(translateChild.text);
                    });
                  });
                }
              });
              if(listTranslate.length > 0) {
                let textExisted = false;
                listTranslate.forEach(translateForm => {
                  if(translateForm.translateText === translate.text){
                    textExisted = true;
                    return {
                      translateText: translate.text,
                      translateSynonym: translateForm.translateSynonym.concat(translateSynonyms)
                    };
                  } else {
                    return translateForm;
                  };
                });
                if(!textExisted){
                  listTranslate.push({
                    translateText: translate.text,
                    translateSynonym: translateSynonyms
                  });
                };
              } else {
                listTranslate.push({
                  translateText: translate.text,
                  translateSynonym: translateSynonyms
                });
              };
            });
          });
          listTranslate.forEach(translate => {
            const translateSynonymData: any[] = [];
            if(translate.translateSynonym){
              translate.translateSynonym.forEach((item: any) => {
                if(!translateSynonymData.includes(item)){
                  translateSynonymData.push(item);
                };
              });
            };
            translationAdverbs.push({
              translation: translate.translateText,
              synonym: translateSynonymData.join(', ')
            });
          });
        };
      });
    }

    if (item.type === 'phrase') {
      // TODO need handle data for phrase data
    }

    const referData: WordReferType | null =
      !item.reference
        ? null
        : {
          ...(definitionNoun.length > 0 || definitionVerbs.length > 0 || definitionAdverbs.length > 0) && 
          {
            definition: {
              ...(definitionNoun.length > 0) && { nouns: definitionNoun },
              ...(definitionVerbs.length > 0) && { verbs: definitionVerbs },
              ...(definitionAdverbs.length > 0) && { adverbs: definitionAdverbs },
            }
          },
          ...(translationNoun.length > 0 || translationVerbs.length > 0 || translationAdverbs.length > 0) &&
          {
            translation: {
              ...(translationNoun.length > 0) && { nouns: translationNoun },
              ...(translationVerbs.length > 0) && { verbs: translationVerbs },
              ...(translationAdverbs.length > 0) && { adverbs: translationAdverbs },
            }
          },
        };

    return {
      ...item,
      referData,
    };
  });

  return newVocabularies;
};