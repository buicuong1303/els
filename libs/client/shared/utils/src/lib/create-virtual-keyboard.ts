export const createVirtualKeyboard = (currentTerms: string[], termsNumber = 3): string[] => {
  const currentTermsFilter: string[] = [];
  const currentTermsLength = currentTerms.length;
  for (let i = 0; i < currentTermsLength; i++) {
    if (currentTermsFilter.indexOf(currentTerms[i]) === -1) currentTermsFilter.push(currentTerms[i]);
  }

  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersTerms =
    characters.split('')
      .filter(item => currentTerms.indexOf(item) === -1)
      .sort(() => 0.5 - Math.random())
      .splice(0, termsNumber);

  currentTermsFilter.push(...charactersTerms);

  return currentTermsFilter;
};