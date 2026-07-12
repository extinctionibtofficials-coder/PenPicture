import { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Paintbrush, 
  Sliders, 
  Layout, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Variable, 
  Compass, 
  Grid 
} from 'lucide-react';

interface VisualCSSEditorProps {
  css: string;
  onUpdateCSS: (newCSS: string) => void;
  html: string;
}

export default function VisualCSSEditor({
  css,
  onUpdateCSS,
  html
}: VisualCSSEditorProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'design' | 'effects' | 'dynamics' | 'variables'>('layout');
  const [selectedSelector, setSelectedSelector] = useState<string>('.pen-rect');
  const [availableSelectors, setAvailableSelectors] = useState<string[]>(['.pen-rect', '.pen-circle', '.pen-btn', '.pen-feature-card', '.pen-h1']);

  // Sizing & Spacing state
  const [width, setWidth] = useState('192px');
  const [height, setHeight] = useState('128px');
  const [padding, setPadding] = useState('16px');
  const [margin, setMargin] = useState('0px');

  // Flexbox/Grid State
  const [display, setDisplay] = useState('block');
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');

  // Colors & Design
  const [bgColor, setBgColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(100);
  const [borderRadius, setBorderRadius] = useState('8px');
  const [clipPath, setClipPath] = useState('none');

  // Borders
  const [borderWidth, setBorderWidth] = useState('0px');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#e2e8f0');

  // Shadows & Filters
  const [shadowType, setShadowType] = useState('none'); // none, sm, md, lg, xl, glass
  const [blurFilter, setBlurFilter] = useState(0);

  // Dynamics (Transitions, Transforms, Animations)
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(100);
  const [transitionTime, setTransitionTime] = useState(200);
  const [animationName, setAnimationName] = useState('none');

  // CSS Variables
  const [cssVariables, setCssVariables] = useState<{ name: string; val: string }[]>([
    { name: '--primary', val: '#6366f1' },
    { name: '--secondary', val: '#10b981' },
    { name: '--radius-main', val: '12px' }
  ]);

  // Parse selectors from HTML classes dynamically!
  useEffect(() => {
    const classRegex = /class="([^"]+)"/g;
    const selectors = new Set<string>();
    let match;
    while ((match = classRegex.exec(html)) !== null) {
      match[1].split(' ').forEach(cls => {
        if (cls.startsWith('pen-')) {
          selectors.add(`.${cls}`);
        }
      });
    }
    if (selectors.size > 0) {
      setAvailableSelectors(Array.from(selectors));
    }
  }, [html]);

  // Handle visual changes and output compiled CSS block rules
  const applyCSSChanges = () => {
    // Generate class styling blocks
    let styleBlock = `${selectedSelector} {\n`;
    styleBlock += `  width: ${width};\n`;
    styleBlock += `  height: ${height};\n`;
    styleBlock += `  padding: ${padding};\n`;
    styleBlock += `  margin: ${margin};\n`;
    styleBlock += `  display: ${display};\n`;
    
    if (display === 'flex') {
      styleBlock += `  flex-direction: ${flexDirection};\n`;
      styleBlock += `  justify-content: ${justifyContent};\n`;
      styleBlock += `  align-items: ${alignItems};\n`;
    }

    styleBlock += `  background-color: ${bgColor};\n`;
    styleBlock += `  color: ${textColor};\n`;
    styleBlock += `  opacity: ${opacity / 100};\n`;
    styleBlock += `  border-radius: ${borderRadius};\n`;

    if (borderWidth !== '0px') {
      styleBlock += `  border: ${borderWidth} ${borderStyle} ${borderColor};\n`;
    }

    if (clipPath !== 'none') {
      styleBlock += `  clip-path: ${clipPath};\n`;
    }

    // Shadow types
    if (shadowType === 'sm') {
      styleBlock += `  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n`;
    } else if (shadowType === 'md') {
      styleBlock += `  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n`;
    } else if (shadowType === 'lg') {
      styleBlock += `  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n`;
    } else if (shadowType === 'glass') {
      styleBlock += `  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n`;
      styleBlock += `  backdrop-filter: blur(${blurFilter}px);\n`;
      styleBlock += `  border: 1px solid rgba(255, 255, 255, 0.18);\n`;
    }

    // Dynamics
    if (rotate !== 0 || scale !== 100) {
      styleBlock += `  transform: rotate(${rotate}deg) scale(${scale / 100});\n`;
    }

    if (transitionTime > 0) {
      styleBlock += `  transition: all ${transitionTime}ms cubic-bezier(0.4, 0, 0.2, 1);\n`;
    }

    if (animationName !== 'none') {
      styleBlock += `  animation: ${animationName} 2s infinite ease-in-out;\n`;
    }

    styleBlock += `}`;

    // Merge or replace rules in user's full CSS file
    let updatedCSS = '';
    const selectorEscaped = selectedSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rulePattern = new RegExp(`${selectorEscaped}\\s*\\{[^}]*\\}`, 'g');

    if (css.match(rulePattern)) {
      updatedCSS = css.replace(rulePattern, styleBlock);
    } else {
      // Append new rule at the top or bottom of variables
      let rootVariablesBlock = ':root {\n';
      cssVariables.forEach(v => {
        rootVariablesBlock += `  ${v.name}: ${v.val};\n`;
      });
      rootVariablesBlock += '}\n\n';

      if (!css.includes(':root')) {
        updatedCSS = rootVariablesBlock + css + '\n\n' + styleBlock;
      } else {
        updatedCSS = css + '\n\n' + styleBlock;
      }
    }

    onUpdateCSS(updatedCSS);
  };

  // Glass generator shortcut helper
  const applyGlassPreset = () => {
    setBgColor('rgba(255, 255, 255, 0.25)');
    setBorderRadius('16px');
    setShadowType('glass');
    setBlurFilter(12);
    setBorderWidth('1px');
    setBorderColor('rgba(255, 255, 255, 0.18)');
    applyCSSChanges();
  };

  return (
    <div className="flex flex-col h-full bg-[#111113] text-[#e4e4e7] select-none">
      {/* Selector highlight header */}
      <div className="p-3 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase">Target CSS Class:</span>
        <select 
          value={selectedSelector} 
          onChange={(e) => setSelectedSelector(e.target.value)}
          className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded-lg text-xs font-mono py-1 px-2.5 focus:outline-none"
        >
          {availableSelectors.map(sel => (
            <option key={sel} value={sel}>{sel}</option>
          ))}
        </select>
      </div>

      {/* Categories Tab navigation */}
      <div className="flex border-b border-[#27272a] p-1 space-x-1 bg-[#18181b]">
        {(['layout', 'design', 'effects', 'dynamics', 'variables'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
              activeTab === tab 
                ? 'bg-[#111113] text-indigo-400 font-bold border-b border-indigo-500' 
                : 'text-zinc-400 hover:bg-[#111113]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Subpanels Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 text-xs font-medium">
        
        {/* --- LAYOUT TAB --- */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Dimensions */}
            <div>
              <span className="text-zinc-500 block mb-2 font-semibold">Dimensions & Spacing</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-450">Width</label>
                  <input 
                    type="text" 
                    value={width} 
                    onChange={(e) => { setWidth(e.target.value); applyCSSChanges(); }}
                    className="w-full bg-[#18181b] text-[#e4e4e7] border border-[#27272a] px-2 py-1.5 rounded-lg text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-450">Height</label>
                  <input 
                    type="text" 
                    value={height} 
                    onChange={(e) => { setHeight(e.target.value); applyCSSChanges(); }}
                    className="w-full bg-[#18181b] text-[#e4e4e7] border border-[#27272a] px-2 py-1.5 rounded-lg text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-450">Padding</label>
                  <input 
                    type="text" 
                    value={padding} 
                    onChange={(e) => { setPadding(e.target.value); applyCSSChanges(); }}
                    className="w-full bg-[#18181b] text-[#e4e4e7] border border-[#27272a] px-2 py-1.5 rounded-lg text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-450">Margin</label>
                  <input 
                    type="text" 
                    value={margin} 
                    onChange={(e) => { setMargin(e.target.value); applyCSSChanges(); }}
                    className="w-full bg-[#18181b] text-[#e4e4e7] border border-[#27272a] px-2 py-1.5 rounded-lg text-xs focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Display / Flexbox / Grid */}
            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-zinc-500 block mb-2 font-semibold">Layout Display Engine</span>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Display Mode</span>
                  <select 
                    value={display} 
                    onChange={(e) => { setDisplay(e.target.value); applyCSSChanges(); }}
                    className="bg-[#18181b] text-[#e4e4e7] border border-[#27272a] rounded-lg py-1 px-2 focus:outline-none"
                  >
                    <option value="block">Block</option>
                    <option value="inline-block">Inline-Block</option>
                    <option value="flex">Flexbox</option>
                    <option value="grid">CSS Grid</option>
                    <option value="none">Hidden</option>
                  </select>
                </div>

                {display === 'flex' && (
                  <div className="p-3 bg-[#18181b]/50 rounded-xl space-y-2 border border-[#27272a]">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500">Direction</span>
                      <select 
                        value={flexDirection} 
                        onChange={(e) => { setFlexDirection(e.target.value); applyCSSChanges(); }}
                        className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                      >
                        <option value="row">Row</option>
                        <option value="column">Column</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500">Justify Content</span>
                      <select 
                        value={justifyContent} 
                        onChange={(e) => { setJustifyContent(e.target.value); applyCSSChanges(); }}
                        className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                      >
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="space-between">Space Between</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- DESIGN TAB --- */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {/* Color Palette selectors */}
            <div>
              <span className="text-zinc-500 block mb-2 font-semibold">Color Builder</span>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Background Color</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={bgColor.startsWith('rgba') ? '#6366f1' : bgColor} 
                      onChange={(e) => { setBgColor(e.target.value); applyCSSChanges(); }}
                      className="w-7 h-7 rounded border-none cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => { setBgColor(e.target.value); applyCSSChanges(); }}
                      className="bg-[#18181b] text-[#e4e4e7] text-center font-mono w-20 py-0.5 rounded border border-[#27272a] text-[10px] focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Text/Icon Color</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => { setTextColor(e.target.value); applyCSSChanges(); }}
                      className="w-7 h-7 rounded border-none cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={textColor} 
                      onChange={(e) => { setTextColor(e.target.value); applyCSSChanges(); }}
                      className="bg-[#18181b] text-[#e4e4e7] text-center font-mono w-20 py-0.5 rounded border border-[#27272a] text-[10px] focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Opacity slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Overall Opacity</span>
                    <span className="font-mono text-[10px]">{opacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={opacity} 
                    onChange={(e) => { setOpacity(Number(e.target.value)); applyCSSChanges(); }}
                    className="w-full accent-indigo-600" 
                  />
                </div>
              </div>
            </div>

            {/* Glass generator & presets */}
            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-zinc-500 block mb-2 font-semibold">Special Visual Presets</span>
              <button
                onClick={applyGlassPreset}
                className="w-full py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-indigo-900/40 rounded-xl text-indigo-400 font-bold text-center flex items-center justify-center space-x-1.5 transition active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Glassmorphism CSS</span>
              </button>
            </div>
          </div>
        )}

        {/* --- EFFECTS TAB --- */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div>
              <span className="text-zinc-500 block mb-2 font-semibold">Box Shadow Effects</span>
              <div className="grid grid-cols-2 gap-2">
                {['none', 'sm', 'md', 'lg', 'glass'].map(sh => (
                  <button
                    key={sh}
                    onClick={() => { setShadowType(sh); applyCSSChanges(); }}
                    className={`py-2 rounded-xl text-[10px] border font-bold uppercase transition ${
                      shadowType === sh 
                        ? 'bg-[#18181b] text-indigo-400 border-indigo-500' 
                        : 'border-[#27272a] hover:bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    {sh} shadow
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-zinc-500 block mb-2 font-semibold">Clipped Shape Paths</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'None', val: 'none' },
                  { name: 'Hexagon', val: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
                  { name: 'Triangle', val: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
                  { name: 'Circle', val: 'circle(50% at 50% 50%)' }
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setClipPath(p.val); applyCSSChanges(); }}
                    className={`py-2 rounded-xl text-[10px] border font-bold transition ${
                      clipPath === p.val 
                        ? 'bg-indigo-600 text-[#e4e4e7] border-transparent' 
                        : 'border-[#27272a] hover:bg-[#27272a] text-zinc-400'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- DYNAMICS TAB --- */}
        {activeTab === 'dynamics' && (
          <div className="space-y-4">
            <div>
              <span className="text-zinc-500 block mb-2 font-semibold">Transform Properties</span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Rotation</span>
                    <span className="font-mono text-[10px]">{rotate}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    value={rotate} 
                    onChange={(e) => { setRotate(Number(e.target.value)); applyCSSChanges(); }}
                    className="w-full accent-indigo-600" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Scale Size</span>
                    <span className="font-mono text-[10px]">{scale}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={scale} 
                    onChange={(e) => { setScale(Number(e.target.value)); applyCSSChanges(); }}
                    className="w-full accent-indigo-600" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-zinc-500 block mb-2 font-semibold">Animation Loops</span>
              <select 
                value={animationName} 
                onChange={(e) => { setAnimationName(e.target.value); applyCSSChanges(); }}
                className="w-full bg-[#18181b] text-[#e4e4e7] border border-[#27272a] rounded-lg p-2 focus:outline-none"
              >
                <option value="none">No Animation</option>
                <option value="pulse">Pulse (Breathe)</option>
                <option value="bounce">Bounce Up & Down</option>
                <option value="spin">Spin Circle Rotation</option>
              </select>
            </div>
          </div>
        )}

        {/* --- VARIABLES TAB --- */}
        {activeTab === 'variables' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold">CSS Variables Manager</span>
              <button 
                onClick={() => {
                  const name = prompt('Variable name (e.g. --brand-color):');
                  const val = prompt('Value (e.g. #3b82f6):');
                  if (name && val) {
                    setCssVariables(prev => [...prev, { name, val }]);
                    applyCSSChanges();
                  }
                }}
                className="p-1 bg-indigo-950/40 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-900 border border-indigo-900/40 transition"
              >
                + Variable
              </button>
            </div>

            <div className="space-y-2.5">
              {cssVariables.map((v, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 bg-[#18181b]/50 rounded-xl border border-[#27272a]">
                  <span className="font-mono text-[10px] text-indigo-400 flex-1 truncate">{v.name}</span>
                  <input 
                    type="text" 
                    value={v.val} 
                    onChange={(e) => {
                      const updated = [...cssVariables];
                      updated[idx].val = e.target.value;
                      setCssVariables(updated);
                      applyCSSChanges();
                    }}
                    className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] font-mono text-[10px] w-20 px-1 py-0.5 rounded text-center focus:outline-none" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
