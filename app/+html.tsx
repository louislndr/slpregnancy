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
        <style>{`
          * { box-sizing: border-box; }
          @media (min-width: 520px) {
            html, body {
              background: #1E1B33;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              min-height: 100vh;
              overflow-y: auto;
              padding: 30px 0;
            }
            #root {
              width: 393px;
              height: 852px;
              overflow: hidden;
              border-radius: 50px;
              position: relative;
              box-shadow: 0 0 0 2px #3A3A3C, 0 0 0 14px #1C1C1E, 0 40px 100px rgba(0,0,0,0.7);
            }
          }
        `}</style>
      </head>
      <body>
        <div id="root" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onerror = function(msg, src, line, col, err) {
              document.getElementById('root').innerHTML =
                '<div style="padding:20px;color:red;font-size:14px;font-family:monospace;background:#fff;position:absolute;inset:0;overflow:auto;z-index:9999">' +
                '<b>App Error:</b><br>' + msg + '<br><br>' + (err ? err.stack : '') + '</div>';
            };
            window.addEventListener('unhandledrejection', function(e) {
              var el = document.getElementById('root');
              el.innerHTML += '<div style="padding:20px;color:orange;font-size:14px;font-family:monospace;background:#fff">' +
                '<b>Promise Error:</b><br>' + e.reason + '</div>';
            });
          `,
        }} />
        {children}
      </body>
    </html>
  );
}
