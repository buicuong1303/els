/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LanguageService } from '@els/server/learning/language/data-access/services';
import { BaseLang } from '@els/server/shared';
import * as DataLoader from 'dataloader';
export const createLanguagesLoader = (languageService: LanguageService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct languages
    const languages: BaseLang[] = await languageService.getLanguagesByIds([...ids]);
    const languagesMap = new Map(languages.map(language => [language.id, language]));
    return ids.map((id) => languagesMap.get(id));
  });
};
