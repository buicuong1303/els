import { useEffect } from 'react';

const useComponentDidMount = (func: () => void) => useEffect(func, [func]);

export { useComponentDidMount };
