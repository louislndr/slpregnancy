const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const errorHandler = `<script>
window.onerror = function(msg, src, line, col, err) {
  document.body.style.cssText = 'background:white;margin:0;padding:20px';
  document.body.innerHTML = '<div style="color:red;font-family:monospace;white-space:pre-wrap"><b>App crashed:</b><br>' + msg + '<br><br>' + (err && err.stack ? err.stack : 'no stack') + '</div>';
  return true;
};
window.addEventListener('unhandledrejection', function(e) {
  var msg = e.reason && e.reason.stack ? e.reason.stack : String(e.reason);
  document.body.style.cssText = 'background:white;margin:0;padding:20px';
  document.body.innerHTML += '<div style="color:orange;font-family:monospace;white-space:pre-wrap"><b>Promise rejected:</b><br>' + msg + '</div>';
});
</script>`;

const iPhoneFrame = `<style>
*{box-sizing:border-box}
@media(min-width:520px){
  html,body{background:#1E1B33!important;display:flex!important;justify-content:center!important;align-items:center!important;min-height:100vh!important}
  #root{width:393px!important;height:852px!important;overflow:hidden!important;border-radius:50px!important;position:relative!important;flex:none!important;box-shadow:0 0 0 2px #3A3A3C,0 0 0 14px #1C1C1E,0 40px 100px rgba(0,0,0,.7)!important}
}
</style>`;

html = html.replace('</head>', errorHandler + '\n' + iPhoneFrame + '\n</head>');
fs.writeFileSync(htmlPath, html);
console.log('patch-web: injected error handler + iPhone frame into dist/index.html');
