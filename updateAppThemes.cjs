const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

// Add light/dark modes
const replacements = [
  // Globals
  [/bg-\[#0b0d12\] text-white/g, 'bg-slate-50 text-slate-900 dark:bg-[#0b0d12] dark:text-white'],
  
  // Hero
  [/bg-gradient-to-br from-\[#0b1220\]\/70 via-\[#0d1117\]\/75 to-\[#0a1628\]\/70/g, 'bg-white/80 dark:bg-gradient-to-br dark:from-[#0b1220]/70 dark:via-[#0d1117]/75 dark:to-[#0a1628]/70'],
  [/border-cyan-400\/20/g, 'border-cyan-200 dark:border-cyan-400/20'],
  [/text-slate-200/g, 'text-slate-700 dark:text-slate-200'],
  
  // Stats
  [/bg-slate-950\/70/g, 'bg-white dark:bg-slate-950/70'],
  [/border-cyan-300\/20/g, 'border-cyan-200 dark:border-cyan-300/20'],
  [/text-slate-400/g, 'text-slate-500 dark:text-slate-400'],
  [/text-amber-100/g, 'text-amber-700 dark:text-amber-100'],
  [/hover:border-cyan-300\/40/g, 'hover:border-cyan-400 dark:hover:border-cyan-300/40'],
  
  // Buttons
  [/bg-cyan-300\/10/g, 'bg-cyan-100 dark:bg-cyan-300/10'],
  [/border-cyan-300\/40/g, 'border-cyan-300 dark:border-cyan-300/40'],
  [/text-cyan-200/g, 'text-cyan-800 dark:text-cyan-200'],
  [/hover:bg-cyan-300\/20/g, 'hover:bg-cyan-200 dark:hover:bg-cyan-300/20'],
  
  [/bg-amber-300\/10/g, 'bg-amber-100 dark:bg-amber-300/10'],
  [/border-amber-300\/30/g, 'border-amber-300 dark:border-amber-300/30'],
  [/hover:bg-amber-300\/20/g, 'hover:bg-amber-200 dark:hover:bg-amber-300/20'],
  [/hover:border-amber-200/g, 'hover:border-amber-400 dark:hover:border-amber-200'],
  
  [/bg-emerald-400\/10/g, 'bg-emerald-100 dark:bg-emerald-400/10'],
  [/border-emerald-400\/25/g, 'border-emerald-300 dark:border-emerald-400/25'],
  [/text-emerald-300/g, 'text-emerald-700 dark:text-emerald-300'],
  
  // Text headings
  [/text-cyan-300/g, 'text-cyan-600 dark:text-cyan-300'],
  [/text-slate-300/g, 'text-slate-600 dark:text-slate-300'],
  [/text-slate-500/g, 'text-slate-400 dark:text-slate-500'],
  
  // About / Cards
  [/from-\[#10161f\]\/70 to-\[#1a1012\]\/70/g, 'from-white to-slate-50 dark:from-[#10161f]/70 dark:to-[#1a1012]/70'],
  [/border-cyan-300\/15/g, 'border-cyan-200 dark:border-cyan-300/15'],
  
  [/from-\[#1a1012\]\/70 to-\[#10161f\]\/70/g, 'from-white to-slate-50 dark:from-[#1a1012]/70 dark:to-[#10161f]/70'],
  [/border-amber-300\/15/g, 'border-amber-200 dark:border-amber-300/15'],
  
  [/from-\[#0f1a14\]\/70 to-\[#10161f\]\/70/g, 'from-white to-slate-50 dark:from-[#0f1a14]/70 dark:to-[#10161f]/70'],
  [/border-emerald-300\/15/g, 'border-emerald-200 dark:border-emerald-300/15'],
  
  [/from-\[#161020\]\/70 to-\[#10161f\]\/70/g, 'from-white to-slate-50 dark:from-[#161020]/70 dark:to-[#10161f]/70'],
  [/border-purple-300\/15/g, 'border-purple-200 dark:border-purple-300/15'],
  [/border-purple-300\/20/g, 'border-purple-300 dark:border-purple-300/20'],
  [/bg-purple-300\/10/g, 'bg-purple-100 dark:bg-purple-300/10'],
  [/text-purple-300/g, 'text-purple-600 dark:text-purple-300'],
  
  // Projects
  [/from-\[#1a1012\]\/80 to-\[#10161f\]\/80/g, 'from-white to-slate-50 dark:from-[#1a1012]/80 dark:to-[#10161f]/80'],
  [/border-cyan-300\/20/g, 'border-cyan-200 dark:border-cyan-300/20'],
  [/border-cyan-300\/30/g, 'border-cyan-300 dark:border-cyan-300/30'],
  [/bg-cyan-400\/15/g, 'bg-cyan-100 dark:bg-cyan-400/15'],
  [/bg-cyan-300\/20/g, 'bg-cyan-200 dark:bg-cyan-300/20'],
  
  [/border-amber-300\/20/g, 'border-amber-200 dark:border-amber-300/20'],
  [/bg-amber-400\/15/g, 'bg-amber-100 dark:bg-amber-400/15'],
  [/bg-amber-300\/20/g, 'bg-amber-200 dark:bg-amber-300/20'],
  
  [/border-red-300\/20/g, 'border-red-200 dark:border-red-300/20'],
  [/border-red-300\/30/g, 'border-red-300 dark:border-red-300/30'],
  [/text-red-300/g, 'text-red-600 dark:text-red-300'],
  [/bg-red-400\/15/g, 'bg-red-100 dark:bg-red-400/15'],
  [/bg-red-300\/20/g, 'bg-red-200 dark:bg-red-300/20'],
  
  [/border-amber-300\/25/g, 'border-amber-300 dark:border-amber-300/25'],
  [/text-amber-100\/90/g, 'text-amber-800 dark:text-amber-100/90'],
  
  // Tech skills
  [/from-\[#10161f\]\/60 to-\[#121822\]\/60/g, 'from-white to-slate-50 dark:from-[#10161f]/60 dark:to-[#121822]/60'],
  [/border-slate-800\/60/g, 'border-slate-200 dark:border-slate-800/60'],
  [/bg-slate-900\/50/g, 'bg-slate-100 dark:bg-slate-900/50'],
  [/border-slate-700\/50/g, 'border-slate-300 dark:border-slate-700/50'],
  
  // Profile coding stats
  [/from-\[#10161f\]\/90 to-\[#1a1012\]\/90/g, 'from-white to-slate-50 dark:from-[#10161f]/90 dark:to-[#1a1012]/90'],
  [/bg-amber-500\/15/g, 'bg-amber-100 dark:bg-amber-500/15'],
  [/bg-blue-500\/15/g, 'bg-blue-100 dark:bg-blue-500/15'],
  [/bg-orange-500\/15/g, 'bg-orange-100 dark:bg-orange-500/15'],
  [/bg-emerald-500\/15/g, 'bg-emerald-100 dark:bg-emerald-500/15'],
  [/border-amber-400\/25/g, 'border-amber-300 dark:border-amber-400/25'],
  [/border-blue-400\/25/g, 'border-blue-300 dark:border-blue-400/25'],
  [/border-orange-400\/25/g, 'border-orange-300 dark:border-orange-400/25'],
  [/border-emerald-400\/25/g, 'border-emerald-300 dark:border-emerald-400/25'],
  
  // Footer
  [/from-\[#0b0f16\] to-\[#0f141e\]/g, 'from-slate-100 to-slate-50 dark:from-[#0b0f16] dark:to-[#0f141e]'],
  [/border-slate-800\/80/g, 'border-slate-200 dark:border-slate-800/80'],
  [/bg-[#121822]/g, 'bg-white dark:bg-[#121822]'],
  [/text-slate-400/g, 'text-slate-500 dark:text-slate-400'],
];

for (const [pattern, replacement] of replacements) {
  appContent = appContent.replace(pattern, replacement);
}

fs.writeFileSync('src/App.jsx', appContent);
console.log('App.jsx updated with dark classes');
