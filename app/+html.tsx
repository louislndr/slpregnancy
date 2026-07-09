import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <title>SL Pregnancy</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; height: 100%; }

            /* On desktop: show as iPhone frame */
            @media (min-width: 520px) {
              html, body {
                background: #1E1B33;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              #root {
                width: 393px;
                height: 852px;
                overflow: hidden;
                border-radius: 50px;
                position: relative;
                box-shadow:
                  0 0 0 2px #3A3A3C,
                  0 0 0 14px #1C1C1E,
                  0 40px 100px rgba(0,0,0,0.7);
              }
            }

            /* On mobile: full screen */
            @media (max-width: 519px) {
              html, body, #root { height: 100%; width: 100%; }
            }
          `,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
