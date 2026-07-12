import { ToolTemplate } from '../types';

export const TOOL_TEMPLATES: ToolTemplate[] = [
  // --- SHAPES (10) ---
  {
    id: 'shape-rect',
    name: 'Rectangle',
    category: 'Shapes',
    icon: 'Square',
    html: `<div class="pen-rect w-48 h-32 bg-indigo-500 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"></div>`,
    css: `.pen-rect {\n  /* Custom styles for your rectangle */\n}`,
    description: 'A basic customizable rectangle shape.'
  },
  {
    id: 'shape-circle',
    name: 'Circle',
    category: 'Shapes',
    icon: 'Circle',
    html: `<div class="pen-circle w-32 h-32 bg-emerald-500 rounded-full shadow-md hover:scale-105 transition-transform duration-200"></div>`,
    css: `.pen-circle {\n  /* Custom styles for your circle */\n}`,
    description: 'A perfect geometric circle.'
  },
  {
    id: 'shape-ellipse',
    name: 'Ellipse',
    category: 'Shapes',
    icon: 'CircleDot',
    html: `<div class="pen-ellipse w-48 h-24 bg-amber-500 rounded-[50%] shadow-md hover:scale-105 transition-transform"></div>`,
    css: `.pen-ellipse {\n  /* Ellipse shape styles */\n}`,
    description: 'A smooth responsive ellipse.'
  },
  {
    id: 'shape-triangle',
    name: 'Triangle',
    category: 'Shapes',
    icon: 'Triangle',
    html: `<div class="pen-triangle w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-rose-500 filter drop-shadow-md hover:scale-105 transition-transform"></div>`,
    css: `.pen-triangle {\n  /* Classic border-hack triangle */\n}`,
    description: 'A sharp vector-style triangle.'
  },
  {
    id: 'shape-polygon',
    name: 'Polygon (Hexagon)',
    category: 'Shapes',
    icon: 'Hexagon',
    html: `<div class="pen-polygon w-32 h-32 bg-violet-600 clip-hexagon shadow-md hover:rotate-6 transition-transform"></div>`,
    css: `.clip-hexagon {\n  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n}`,
    description: 'A precise custom-clipped hexagon.'
  },
  {
    id: 'shape-star',
    name: 'Star Shape',
    category: 'Shapes',
    icon: 'Star',
    html: `<div class="pen-star w-32 h-32 bg-yellow-400 clip-star hover:scale-110 transition-transform"></div>`,
    css: `.clip-star {\n  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);\n}`,
    description: 'A beautiful vector-clipped star.'
  },
  {
    id: 'shape-heart',
    name: 'Heart Shape',
    category: 'Shapes',
    icon: 'Heart',
    html: `<div class="pen-heart w-32 h-32 bg-red-500 clip-heart hover:scale-110 transition-transform"></div>`,
    css: `.clip-heart {\n  clip-path: polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%);\n}`,
    description: 'A beautifully proportioned vector heart.'
  },
  {
    id: 'shape-arrow',
    name: 'Arrow Direction',
    category: 'Shapes',
    icon: 'ArrowRight',
    html: `<div class="pen-arrow w-32 h-20 bg-teal-500 clip-arrow hover:translate-x-2 transition-transform"></div>`,
    css: `.clip-arrow {\n  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);\n}`,
    description: 'A clear forward-pointing arrow.'
  },
  {
    id: 'shape-line',
    name: 'Horizontal Line',
    category: 'Shapes',
    icon: 'Minus',
    html: `<hr class="pen-line border-t-4 border-dashed border-sky-400 w-full my-4" />`,
    css: `.pen-line {\n  /* Solid or dashed horizontal accent line */\n}`,
    description: 'A clean dashed structural divider.'
  },
  {
    id: 'shape-bezier',
    name: 'Bezier Curve Segment',
    category: 'Shapes',
    icon: 'Spline',
    html: `<svg class="w-full h-24 text-purple-500 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">\n  <path d="M0,50 Q25,0 50,50 T100,50" stroke="currentColor" stroke-width="4" class="pen-bezier-path" />\n</svg>`,
    css: `.pen-bezier-path {\n  stroke-dasharray: 4;\n  animation: flow 10s linear infinite;\n}\n@keyframes flow {\n  to { stroke-dashoffset: -40; }\n}`,
    description: 'An SVG custom Bezier path curve.'
  },

  // --- TYPOGRAPHY (6) ---
  {
    id: 'typo-h1',
    name: 'Elegant Heading 1',
    category: 'Typography',
    icon: 'Heading1',
    html: `<h1 class="pen-h1 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">\n  Unleash Creative Vision\n</h1>`,
    css: `.pen-h1 {\n  font-family: 'Space Grotesk', sans-serif;\n  background: linear-gradient(to right, #4f46e5, #06b6d4);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
    description: 'A bold, futuristic heading styled with gradient text.'
  },
  {
    id: 'typo-body',
    name: 'Polished Body Text',
    category: 'Typography',
    icon: 'Type',
    html: `<p class="pen-body text-base text-slate-600 leading-relaxed font-sans max-w-md">\n  Explore beautiful designs generated from clean declarative markup. Edit, preview, and build in real-time.\n</p>`,
    css: `.pen-body {\n  letter-spacing: -0.011em;\n}`,
    description: 'An exceptionally readable, well-spaced block of body copy.'
  },
  {
    id: 'typo-mono',
    name: 'Technical Mono Tag',
    category: 'Typography',
    icon: 'Binary',
    html: `<span class="pen-mono font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">\n  const app = "PenPicture";\n</span>`,
    css: `.pen-mono {\n  font-feature-settings: "calt" 1;\n}`,
    description: 'A clean code badge or monospace element.'
  },
  {
    id: 'typo-serif',
    name: 'Editorial Serif Title',
    category: 'Typography',
    icon: 'Sparkles',
    html: `<h2 class="pen-serif text-3xl font-serif italic text-amber-900">\n  "Crafted with absolute surgical precision."\n</h2>`,
    css: `.pen-serif {\n  font-family: 'Playfair Display', Georgia, serif;\n}`,
    description: 'An elegant editorial serif quote.'
  },
  {
    id: 'typo-glass-title',
    name: 'Glass Card Title',
    category: 'Typography',
    icon: 'Coins',
    html: `<div class="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-center">\n  <h3 class="text-xl font-bold text-slate-800 uppercase tracking-widest">Workspace Core</h3>\n</div>`,
    css: ``,
    description: 'A modern glassmorphic title card.'
  },
  {
    id: 'typo-curved',
    name: 'Uppercase Display Banner',
    category: 'Typography',
    icon: 'Baseline',
    html: `<div class="tracking-[0.4em] text-xs font-semibold uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full inline-block">\n  PRO SYSTEM ONLINE\n</div>`,
    css: ``,
    description: 'Spaced uppercase display subheader.'
  },

  // --- COMPONENTS (12) ---
  {
    id: 'comp-btn',
    name: 'Custom Action Button',
    category: 'Components',
    icon: 'SquarePlay',
    html: `<button class="pen-btn px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">\n  Get Started Free\n</button>`,
    css: `.pen-btn {\n  box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.4);\n}`,
    description: 'An extremely clickable modern CTA button.'
  },
  {
    id: 'comp-card',
    name: 'Feature Bento Card',
    category: 'Components',
    icon: 'CreditCard',
    html: `<div class="pen-feature-card max-w-sm p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">\n  <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">\n    ⚡\n  </div>\n  <h4 class="text-lg font-bold text-slate-900 mb-2">Instant Rendering</h4>\n  <p class="text-sm text-slate-500 leading-normal">Watch your design update dynamically with every single keystroke. Pure local acceleration.</p>\n</div>`,
    css: ``,
    description: 'A sleek card perfect for grid-based dashboards.'
  },
  {
    id: 'comp-navbar',
    name: 'Responsive Navbar Link',
    category: 'Components',
    icon: 'Compass',
    html: `<nav class="flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-md w-full">\n  <div class="font-bold tracking-tight">STUDIO</div>\n  <div class="hidden md:flex space-x-6 text-sm text-slate-300">\n    <a href="#" class="hover:text-white transition">Projects</a>\n    <a href="#" class="hover:text-white transition">Templates</a>\n    <a href="#" class="hover:text-white transition">Pricing</a>\n  </div>\n  <button class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg text-sm transition">Sign In</button>\n</nav>`,
    css: ``,
    description: 'A complete dark desktop navbar template.'
  },
  {
    id: 'comp-profile',
    name: 'Profile Header Card',
    category: 'Components',
    icon: 'User',
    html: `<div class="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl max-w-sm">\n  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80" alt="Avatar" class="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500" />\n  <div>\n    <h4 class="text-sm font-semibold text-slate-800">Sarah Jenkins</h4>\n    <p class="text-xs text-slate-500">Lead Design Architect</p>\n  </div>\n</div>`,
    css: ``,
    description: 'A clean profile/avatar presentation.'
  },
  {
    id: 'comp-pricing',
    name: 'Premium Pricing Card',
    category: 'Components',
    icon: 'Tag',
    html: `<div class="p-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl text-white max-w-xs shadow-xl">\n  <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Enterprise</span>\n  <div class="flex items-baseline mt-2 mb-4">\n    <span class="text-4xl font-extrabold font-sans">$49</span>\n    <span class="text-slate-400 text-sm ml-1">/mo</span>\n  </div>\n  <p class="text-xs text-slate-400 mb-6">Unlimited persistent cloud rendering, smart components, and team integrations.</p>\n  <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition cursor-pointer">Upgrade Plan</button>\n</div>`,
    css: ``,
    description: 'A high-contrast SaaS-style pricing panel.'
  },
  {
    id: 'comp-hero',
    name: 'Hero Section Split',
    category: 'Components',
    icon: 'Tv',
    html: `<div class="grid md:grid-cols-2 gap-8 items-center py-8 px-4 max-w-4xl">\n  <div>\n    <span class="text-xs font-bold uppercase text-indigo-600 tracking-wider">Design by Code</span>\n    <h2 class="text-3xl font-extrabold text-slate-900 mt-2 mb-4">The ultimate vector IDE.</h2>\n    <p class="text-slate-500 text-sm leading-relaxed mb-6">Code your layouts inside an automated system that structures layouts into pristine responsive output.</p>\n    <button class="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition">Get Started</button>\n  </div>\n  <div class="relative">\n    <div class="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden">\n      <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>\n    </div>\n  </div>\n</div>`,
    css: ``,
    description: 'A balanced split hero section.'
  },
  {
    id: 'comp-accordion',
    name: 'Toggle Accordion',
    category: 'Components',
    icon: 'ChevronsUpDown',
    html: `<div class="border border-slate-200 rounded-2xl overflow-hidden max-w-sm bg-white">\n  <details class="group" open>\n    <summary class="flex justify-between items-center p-4 font-medium text-slate-800 cursor-pointer list-none hover:bg-slate-50">\n      <span>Does this require coding experience?</span>\n      <span class="transition group-open:rotate-180">▼</span>\n    </summary>\n    <div class="p-4 border-t border-slate-100 text-sm text-slate-500 leading-normal bg-slate-50/50">\n      No! While you code the layout, our visual builder and visual CSS editors generate the corresponding CSS styles automatically.\n    </div>\n  </details>\n</div>`,
    css: ``,
    description: 'A native, interactive HTML accordion.'
  },
  {
    id: 'comp-tabs',
    name: 'Tab Switch Group',
    category: 'Components',
    icon: 'Layers',
    html: `<div class="flex p-1 bg-slate-100 rounded-xl space-x-1 max-w-xs">\n  <button class="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white shadow-sm text-slate-800 cursor-pointer">HTML Editor</button>\n  <button class="flex-1 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">CSS Preview</button>\n  <button class="flex-1 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Console</button>\n</div>`,
    css: ``,
    description: 'A sleek dashboard-style tab container.'
  },
  {
    id: 'comp-modal',
    name: 'Modal Dialog Overlay',
    category: 'Components',
    icon: 'AppWindow',
    html: `<div class="max-w-md w-full p-6 bg-white border border-slate-100 rounded-3xl shadow-2xl relative">\n  <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">×</button>\n  <h3 class="text-lg font-bold text-slate-950 mb-2">Publish Project</h3>\n  <p class="text-sm text-slate-500 mb-6">Are you sure you want to lock this version of your codebase and publish it to production?</p>\n  <div class="flex justify-end space-x-3">\n    <button class="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold">Cancel</button>\n    <button class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl">Confirm & Publish</button>\n  </div>\n</div>`,
    css: ``,
    description: 'A styled modal confirmation box.'
  },
  {
    id: 'comp-tooltip',
    name: 'Tooltip Element',
    category: 'Components',
    icon: 'Info',
    html: `<div class="relative inline-block group cursor-help">\n  <span class="underline decoration-dotted decoration-indigo-500 text-slate-700 font-medium">Hover over me</span>\n  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity text-center shadow-lg">\n    Our CSS properties updates auto-sync here!\n  </div>\n</div>`,
    css: ``,
    description: 'A purely hover-activated CSS tooltip.'
  },
  {
    id: 'comp-avatar-badge',
    name: 'Avatar Notification Badge',
    category: 'Components',
    icon: 'CircleDotDashed',
    html: `<div class="relative inline-block">\n  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />\n  <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>\n</div>`,
    css: ``,
    description: 'A modern avatar badge with active status.'
  },
  {
    id: 'comp-progress',
    name: 'Determinate Progress Bar',
    category: 'Components',
    icon: 'SlidersHorizontal',
    html: `<div class="w-full max-w-xs">\n  <div class="flex justify-between items-center text-xs text-slate-500 mb-1.5">\n    <span>Render Speed</span>\n    <span>98%</span>\n  </div>\n  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">\n    <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: 98%;"></div>\n  </div>\n</div>`,
    css: ``,
    description: 'A smooth progress visualization.'
  },

  // --- LAYOUT (6) ---
  {
    id: 'layout-stack',
    name: 'Vertical Flex Stack',
    category: 'Layout',
    icon: 'Columns3',
    html: `<div class="flex flex-col space-y-4 p-4 bg-slate-50 border border-slate-200/50 rounded-2xl w-full max-w-sm">\n  <div class="p-3 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-700 shadow-sm">Item 1</div>\n  <div class="p-3 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-700 shadow-sm">Item 2</div>\n  <div class="p-3 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-700 shadow-sm">Item 3</div>\n</div>`,
    css: ``,
    description: 'A perfectly aligned structural vertical stack.'
  },
  {
    id: 'layout-grid',
    name: 'Bento Showcase Grid',
    category: 'Layout',
    icon: 'Grid',
    html: `<div class="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-100 rounded-3xl w-full max-w-md">\n  <div class="col-span-2 p-4 bg-indigo-600 text-white rounded-2xl h-24 flex items-end font-bold">Feature 1</div>\n  <div class="p-4 bg-amber-500 text-white rounded-2xl h-24 flex items-end font-bold">Pic</div>\n  <div class="p-4 bg-slate-900 text-white rounded-2xl h-24 flex items-end font-bold">Dark</div>\n  <div class="col-span-2 p-4 bg-emerald-500 text-white rounded-2xl h-24 flex items-end font-bold">Feature 3</div>\n</div>`,
    css: ``,
    description: 'An asymmetrical bento box layout.'
  },
  {
    id: 'layout-divider',
    name: 'Sleek Layout Divider',
    category: 'Layout',
    icon: 'Menu',
    html: `<div class="relative my-6 w-full max-w-sm">\n  <div class="absolute inset-0 flex items-center" aria-hidden="true">\n    <div class="w-full border-t border-slate-200"></div>\n  </div>\n  <div class="relative flex justify-center text-xs font-semibold uppercase">\n    <span class="bg-white px-2 text-slate-400">Section Boundary</span>\n  </div>\n</div>`,
    css: ``,
    description: 'A labeled section divider for clean structures.'
  },
  {
    id: 'layout-sidebar',
    name: 'Dashboard Sidebar Shell',
    category: 'Layout',
    icon: 'LayoutGrid',
    html: `<div class="flex flex-col h-64 w-48 bg-slate-950 text-slate-400 rounded-2xl p-4 space-y-4 shadow-lg text-xs font-medium">\n  <div class="text-white font-bold text-sm border-b border-slate-800 pb-2">Main Menu</div>\n  <div class="space-y-2">\n    <div class="text-indigo-400 hover:text-white cursor-pointer bg-slate-900 p-2 rounded-lg">✦ Workspace</div>\n    <div class="hover:text-white cursor-pointer p-2">📁 Files</div>\n    <div class="hover:text-white cursor-pointer p-2">⚡ Integrations</div>\n    <div class="hover:text-white cursor-pointer p-2">⚙ Settings</div>\n  </div>\n</div>`,
    css: ``,
    description: 'A dark collapsible dashboard sidebar.'
  },
  {
    id: 'layout-centered',
    name: 'Centered Content Box',
    category: 'Layout',
    icon: 'Maximize',
    html: `<div class="flex items-center justify-center min-h-48 w-full border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-6">\n  <div class="text-center">\n    <span class="text-2xl">⚡</span>\n    <h5 class="text-sm font-semibold text-slate-800 mt-2">Active Area</h5>\n    <p class="text-xs text-slate-400">Ready for layout nesting.</p>\n  </div>\n</div>`,
    css: ``,
    description: 'A centered container for inner nesting.'
  },
  {
    id: 'layout-split',
    name: 'Modern Split Panels',
    category: 'Layout',
    icon: 'Columns2',
    html: `<div class="flex w-full max-w-md border border-slate-100 rounded-2xl overflow-hidden shadow-sm h-32 text-xs font-semibold">\n  <div class="w-1/3 bg-slate-100 p-3 flex flex-col justify-between">Left Index</div>\n  <div class="w-2/3 bg-white p-3 flex flex-col justify-between">Main Action Area</div>\n</div>`,
    css: ``,
    description: 'A dual panel workspace layout.'
  },

  // --- INTERACTIVE (4) ---
  {
    id: 'inter-input',
    name: 'Floating Label Input',
    category: 'Interactive',
    icon: 'TextCursorInput',
    html: `<div class="relative max-w-xs w-full">\n  <input type="text" id="floating-email" class="peer w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-transparent focus:border-indigo-500 focus:outline-none" placeholder="Email Address" />\n  <label for="floating-email" class="absolute left-4 top-2.5 text-xs text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 bg-white px-1">Email Address</label>\n</div>`,
    css: ``,
    description: 'A native CSS-only floating input label.'
  },
  {
    id: 'inter-checkbox',
    name: 'Custom Checkbox Group',
    category: 'Interactive',
    icon: 'CheckSquare',
    html: `<div class="space-y-2 max-w-xs font-sans text-sm text-slate-700">\n  <label class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">\n    <input type="checkbox" checked class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />\n    <span>Compile templates instantly</span>\n  </label>\n  <label class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">\n    <input type="checkbox" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />\n    <span>Enable telemetry monitoring</span>\n  </label>\n</div>`,
    css: ``,
    description: 'Custom checkbox selector lists.'
  },
  {
    id: 'inter-switch',
    name: 'Sleek Toggle Switch',
    category: 'Interactive',
    icon: 'ToggleRight',
    html: `<div class="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl max-w-xs">\n  <span class="text-xs font-semibold text-slate-700 flex-1">Realtime Autosave</span>\n  <button class="relative w-10 h-6 bg-indigo-600 rounded-full transition-colors flex items-center px-0.5 cursor-pointer" onclick="this.classList.toggle('bg-indigo-600'); this.classList.toggle('bg-slate-200'); this.firstElementChild.classList.toggle('translate-x-4')">\n    <span class="w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-4"></span>\n  </button>\n</div>`,
    css: ``,
    description: 'Interactive CSS/JS toggler.'
  },
  {
    id: 'inter-dropdown',
    name: 'Interactive Search Dropdown',
    category: 'Interactive',
    icon: 'ChevronDown',
    html: `<div class="relative max-w-xs w-full">\n  <div class="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 shadow-sm justify-between">\n    <span>Active Preset</span>\n    <span>▼</span>\n  </div>\n  <div class="absolute top-full mt-1.5 w-full bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden text-xs text-slate-600 z-50">\n    <div class="p-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">Custom Dashboard</div>\n    <div class="p-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">Retro Terminal</div>\n    <div class="p-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">Minimal Card</div>\n  </div>\n</div>`,
    css: ``,
    description: 'Sleek search filter selector.'
  },

  // --- MEDIA / WIDGETS (8) ---
  {
    id: 'media-timeline',
    name: 'Visual Activity Timeline',
    category: 'Media',
    icon: 'CalendarDays',
    html: `<div class="flow-root max-w-sm p-4 bg-slate-50 rounded-2xl text-xs font-sans text-slate-600">\n  <ul role="list" class="-mb-8">\n    <li class="relative pb-8">\n      <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"></span>\n      <div class="relative flex space-x-3">\n        <div class="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>\n        <div class="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">\n          <div><p class="font-semibold text-slate-800">Layout Initiated</p></div>\n          <div class="text-right text-slate-400">10:45 AM</div>\n        </div>\n      </div>\n    </li>\n    <li class="relative pb-8">\n      <div class="relative flex space-x-3">\n        <div class="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>\n        <div class="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">\n          <div><p class="font-semibold text-slate-800">CSS Rules Compiled</p></div>\n          <div class="text-right text-slate-400">11:02 AM</div>\n        </div>\n      </div>\n    </li>\n  </ul>\n</div>`,
    css: ``,
    description: 'Vertical project history tracker.'
  },
  {
    id: 'media-calendar',
    name: 'Mini Calendar Widget',
    category: 'Media',
    icon: 'Calendar',
    html: `<div class="p-4 bg-white border border-slate-100 rounded-3xl max-w-xs shadow-sm text-center font-sans">\n  <h4 class="text-sm font-bold text-slate-800 mb-3">July 2026</h4>\n  <div class="grid grid-cols-7 gap-1.5 text-[10px] font-semibold text-slate-400 mb-2">\n    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>\n  </div>\n  <div class="grid grid-cols-7 gap-1.5 text-xs text-slate-700">\n    <span class="text-slate-300">29</span><span class="text-slate-300">30</span><span class="text-slate-300">1</span><span>2</span><span>3</span><span class="font-bold bg-indigo-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center mx-auto">4</span><span>5</span>\n  </div>\n</div>`,
    css: ``,
    description: 'A dynamic mini calendar mockup.'
  },
  {
    id: 'media-qr',
    name: 'QR Code Canvas',
    category: 'Media',
    icon: 'QrCode',
    html: `<div class="p-4 bg-white border border-slate-200 rounded-2xl max-w-xs flex flex-col items-center justify-center shadow-sm">\n  <div class="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center p-2">\n    <svg class="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">\n      <path d="M2,2 H8 V8 H2 Z M4,4 V6 H6 V4 Z M10,2 H14 V6 H10 Z M16,2 H22 V8 H16 Z M18,4 V6 H20 V4 Z M2,10 H6 V14 H2 Z M10,10 H14 V14 H10 Z M16,10 H22 V14 H16 Z M2,16 H8 V22 H2 Z M4,18 V20 H6 V18 Z M10,16 H14 V22 H10 Z M16,16 H22 V22 H16 Z" />\n    </svg>\n  </div>\n  <span class="text-[10px] font-mono text-slate-400 mt-2">https://penpicture.ai</span>\n</div>`,
    css: ``,
    description: 'Stylized SVG QR Code pattern.'
  },
  {
    id: 'media-barcode',
    name: 'Retail Barcode Graphic',
    category: 'Media',
    icon: 'Barcode',
    html: `<div class="bg-white border border-slate-100 p-4 rounded-xl max-w-xs flex flex-col items-center">\n  <div class="w-40 h-10 flex space-x-0.5 items-stretch">\n    <div class="bg-slate-950 w-1"></div><div class="bg-slate-950 w-0.5"></div><div class="w-1"></div><div class="bg-slate-950 w-1.5"></div><div class="bg-slate-950 w-0.5"></div><div class="w-0.5"></div><div class="bg-slate-950 w-2"></div><div class="w-1"></div><div class="bg-slate-950 w-1"></div>\n  </div>\n  <span class="text-[9px] font-mono tracking-widest text-slate-500 mt-1">PEN-PICTURE-2026</span>\n</div>`,
    css: ``,
    description: 'Realistic barcode segment display.'
  },
  {
    id: 'media-codeblock',
    name: 'Styled Code Block',
    category: 'Media',
    icon: 'Code2',
    html: `<div class="bg-slate-950 text-slate-300 p-4 rounded-2xl max-w-sm font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-md">\n  <div class="flex justify-between items-center pb-2 border-b border-slate-900 mb-2">\n    <span class="text-slate-500">component.tsx</span>\n    <button class="text-indigo-400 hover:text-white">Copy</button>\n  </div>\n  <pre><span class="text-purple-400">import</span> { <span class="text-blue-400">motion</span> } <span class="text-purple-400">from</span> <span class="text-emerald-400">"motion/react"</span>;\n\n<span class="text-orange-400">export const</span> <span class="text-yellow-400">Render</span> = () => {\n  <span class="text-purple-400">return</span> &lt;<span class="text-rose-400">h1</span>&gt;Hello World&lt;/<span class="text-rose-400">h1</span>&gt;;\n};</pre>\n</div>`,
    css: ``,
    description: 'Perfect formatted code viewer.'
  },
  {
    id: 'media-markdown',
    name: 'Markdown Panel Content',
    category: 'Media',
    icon: 'FileText',
    html: `<div class="prose prose-slate max-w-sm p-5 border border-slate-200 rounded-3xl bg-white font-sans text-xs">\n  <h1 class="text-base font-bold text-slate-900"># Guide Markdown</h1>\n  <p class="text-slate-500 my-2">Declarative components are fast and fully production-ready. Read more.</p>\n  <ul class="list-disc pl-4 space-y-1 text-slate-500">\n    <li>Lightweight and performant</li>\n    <li>Pure CSS architecture</li>\n  </ul>\n</div>`,
    css: ``,
    description: 'Standard rendered text documentation block.'
  },
  {
    id: 'media-video',
    name: 'Video Aspect Placeholder',
    category: 'Media',
    icon: 'Video',
    html: `<div class="aspect-video w-full max-w-sm bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-md">\n  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer group-hover:scale-110 hover:bg-white/30 transition-transform z-10">▶</div>\n  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&fit=crop&q=80" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video cover" />\n</div>`,
    css: ``,
    description: 'Full-aspect customizable movie wrapper.'
  },
  {
    id: 'media-audio',
    name: 'Audio Wave Player',
    category: 'Media',
    icon: 'AudioLines',
    html: `<div class="p-3.5 bg-slate-900 rounded-2xl text-white max-w-xs flex items-center space-x-3.5 shadow-md border border-slate-800">\n  <button class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs">❚❚</button>\n  <div class="flex-1">\n    <div class="text-[11px] font-bold">Ambient Synth Track.mp3</div>\n    <div class="flex space-x-0.5 items-center h-4 mt-1">\n      <span class="bg-indigo-500 h-2 w-0.5 rounded-full"></span>\n      <span class="bg-indigo-500 h-3 w-0.5 rounded-full"></span>\n      <span class="bg-indigo-400 h-1 w-0.5 rounded-full"></span>\n      <span class="bg-indigo-500 h-4 w-0.5 rounded-full"></span>\n      <span class="bg-indigo-500 h-2 w-0.5 rounded-full"></span>\n    </div>\n  </div>\n</div>`,
    css: ``,
    description: 'Mini audio visualizer toolbar.'
  },

  // --- DATA VIZ (4) ---
  {
    id: 'viz-chart',
    name: 'Interactive Chart Mock',
    category: 'Utilities',
    icon: 'LineChart',
    html: `<div class="p-4 bg-slate-900 border border-slate-800 rounded-3xl max-w-xs shadow-xl text-white font-sans">\n  <div class="flex justify-between items-center mb-4">\n    <div>\n      <span class="text-[10px] text-slate-400 uppercase tracking-widest">Growth Curve</span>\n      <h5 class="text-lg font-bold font-sans">$14,204.50</h5>\n    </div>\n    <span class="text-xs text-emerald-400">+12.4%</span>\n  </div>\n  <div class="flex items-end h-20 space-x-2 pb-2 border-b border-slate-800">\n    <div class="bg-slate-800 hover:bg-indigo-500 h-[30%] w-full rounded-md transition-all"></div>\n    <div class="bg-slate-800 hover:bg-indigo-500 h-[45%] w-full rounded-md transition-all"></div>\n    <div class="bg-slate-800 hover:bg-indigo-500 h-[65%] w-full rounded-md transition-all"></div>\n    <div class="bg-indigo-600 h-[90%] w-full rounded-md transition-all"></div>\n  </div>\n  <div class="flex justify-between text-[8px] text-slate-500 mt-2 font-mono">\n    <span>MON</span><span>WED</span><span>FRI</span><span>SUN</span>\n  </div>\n</div>`,
    css: ``,
    description: 'Mock grid and visual bar chart helper.'
  },
  {
    id: 'viz-kpi',
    name: 'Metrics KPI Card',
    category: 'Utilities',
    icon: 'TrendingUp',
    html: `<div class="p-5 bg-white border border-slate-100 rounded-3xl max-w-xs shadow-sm flex items-center justify-between">\n  <div>\n    <h6 class="text-xs text-slate-400 font-semibold uppercase">Daily Visits</h6>\n    <p class="text-2xl font-bold text-slate-900 mt-1">45,102</p>\n  </div>\n  <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">▲</div>\n</div>`,
    css: ``,
    description: 'Visually high-impact statistic indicator.'
  },
  {
    id: 'viz-ring',
    name: 'SVG Progress Ring',
    category: 'Utilities',
    icon: 'Loader',
    html: `<div class="p-4 bg-white border border-slate-100 rounded-3xl max-w-[150px] flex flex-col items-center justify-center">\n  <div class="relative w-16 h-16">\n    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">\n      <path class="text-slate-100" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />\n      <path class="text-indigo-600" stroke-dasharray="75, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />\n    </svg>\n    <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800">75%</span>\n  </div>\n  <span class="text-[10px] font-semibold text-slate-400 mt-2">Conversion</span>\n</div>`,
    css: ``,
    description: 'Perfect SVG percentage indicator circle.'
  },
  {
    id: 'viz-rating',
    name: 'Review Rating Star Group',
    category: 'Utilities',
    icon: 'Sparkles',
    html: `<div class="flex items-center space-x-1 py-1.5 px-3 bg-amber-50 rounded-full max-w-xs inline-flex text-amber-500 font-sans text-xs font-semibold">\n  <span>★★★★★</span>\n  <span class="text-amber-900 ml-1.5">5.0 Star Feedback</span>\n</div>`,
    css: ``,
    description: 'Star reviews and ratings group.'
  }
];
