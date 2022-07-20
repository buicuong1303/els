import createCache from '@emotion/cache';
// import stylisRTLPlugin from 'stylis-plugin-rtl';

const createEmotionCache = () => {
  return createCache({
    key: 'css',
    // // @ts-ignore
    // stylisPlugins: [stylisRTLPlugin]
  });
}

export { createEmotionCache }
