/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

class ChatwootWidget extends React.Component {
  componentDidMount () {
    if (typeof window !== undefined) {
      const windowCustom: any = window;

      // Add Chatwoot Settings
      windowCustom.chatwootSettings = {
        hideMessageBubble: false,
        position: 'right', // This can be left or right
        locale: 'en', // Language to be set
        type: 'standard', // [standard, expanded_bubble]
      };

      // Paste the script from inbox settings except the <script> tag
      (function(d, t) {
        const BASE_URL = 'https://chatwoot.sye.vn';
        const g: any = d.createElement(t);
        const s: any = d.getElementsByTagName(t)[0];

        g.src = BASE_URL+'/packs/js/sdk.js';
        s.parentNode.insertBefore(g, s);
        g.async = !0;
        g.onload = function(){
          windowCustom.chatwootSDK.run({
            websiteToken: 'USJX57GDuCCqsmnywbJmoYhE',
            baseUrl: BASE_URL
          });
        };
      })(document, 'script');
    }
  }

  render () {
    return null;
  }
}

export { ChatwootWidget };
