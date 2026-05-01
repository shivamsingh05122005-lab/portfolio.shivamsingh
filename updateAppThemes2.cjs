const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

// Role pills
appContent = appContent.replace(/bg-slate-950\/60/g, 'bg-slate-100 dark:bg-slate-950/60');
appContent = appContent.replace(/border-cyan-400\/30/g, 'border-cyan-300 dark:border-cyan-400/30');
appContent = appContent.replace(/border-violet-400\/30/g, 'border-violet-300 dark:border-violet-400/30');
appContent = appContent.replace(/border-amber-400\/30/g, 'border-amber-300 dark:border-amber-400/30');

appContent = appContent.replace(/text-violet-300/g, 'text-violet-700 dark:text-violet-300');
appContent = appContent.replace(/text-amber-300/g, 'text-amber-700 dark:text-amber-300'); // Note: some might be dark:text-amber-300 already if ran twice

// Fix double darks just in case
appContent = appContent.replace(/dark:text-violet-700 dark:text-violet-300/g, 'dark:text-violet-300');
appContent = appContent.replace(/dark:text-amber-700 dark:text-amber-300/g, 'dark:text-amber-300');

// App.jsx wrapper bg
appContent = appContent.replace(/bg-\[#0b0d12\] text-white/g, 'bg-slate-50 text-slate-900 dark:bg-[#0b0d12] dark:text-white');

fs.writeFileSync('src/App.jsx', appContent);
