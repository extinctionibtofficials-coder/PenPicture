import { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Smartphone, 
  Tablet, 
  Tv, 
  RotateCw, 
  Maximize, 
  Terminal, 
  CheckCircle, 
  AlertTriangle,
  FileCode,
  XCircle
} from 'lucide-react';
import { PreviewDevice, PreviewOrientation } from '../types';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  onJumpToLine: (line: number) => void;
  externalErrors: { line: number; text: string }[];
}

export default function LivePreview({
  html,
  css,
  js,
  onJumpToLine,
  externalErrors = []
}: LivePreviewProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [device, setDevice] = useState<PreviewDevice>('responsive');
  const [orientation, setOrientation] = useState<PreviewOrientation>('landscape');
  const [consoleErrors, setConsoleErrors] = useState<{ id: string; text: string; line?: number }[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Available Zoom presets
  const ZOOM_PRESETS = [10, 25, 50, 75, 100, 125, 150, 200, 300, 500, 800];

  // Map device dimensions
  const getDeviceDimensions = () => {
    if (device === 'desktop') return { width: '100%', height: '100%' };
    if (device === 'laptop') return { width: '1280px', height: '800px' };
    
    if (device === 'tablet') {
      return orientation === 'portrait' 
        ? { width: '768px', height: '1024px' } 
        : { width: '1024px', height: '768px' };
    }
    if (device === 'phone') {
      return orientation === 'portrait' 
        ? { width: '375px', height: '812px' } 
        : { width: '812px', height: '375px' };
    }
    return { width: '100%', height: '100%' }; // responsive
  };

  // Static HTML parsing for unmatched elements
  const checkStaticErrors = () => {
    const list: { id: string; text: string; line?: number }[] = [];
    
    // Check missing closing braces in CSS
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      list.push({ id: 'css-brace', text: `Missing CSS closing brace '}' (${openBraces - closeBraces} missing)` });
    } else if (closeBraces > openBraces) {
      list.push({ id: 'css-brace', text: `Unexpected extra CSS brace '}'` });
    }

    // Check simple HTML tag matching (div, section)
    const openDivs = (html.match(/<div/g) || []).length;
    const closeDivs = (html.match(/<\/div>/g) || []).length;
    if (openDivs > closeDivs) {
      list.push({ id: 'html-div', text: `Missing closing tag </div> (${openDivs - closeDivs} missing)` });
    }

    // Capture standard known CSS properties
    const commonProperties = ['color', 'background', 'width', 'height', 'margin', 'padding', 'font', 'border', 'display', 'position', 'opacity', 'shadow', 'radius', 'transition', 'animation', 'flex', 'grid', 'transform'];
    const cssLines = css.split('\n');
    cssLines.forEach((line, index) => {
      if (line.includes(':') && !line.includes('http') && !line.includes('var(')) {
        const prop = line.split(':')[0].trim();
        // Simple filter for typo properties (excluding selectors)
        if (prop.length > 2 && !prop.startsWith('@') && !prop.startsWith('-') && !prop.startsWith('/*') && !prop.includes('{') && !prop.includes('}') && !prop.includes(';') && !prop.includes('class')) {
          const match = commonProperties.some(p => prop.toLowerCase().includes(p) || p.includes(prop.toLowerCase()));
          if (!match && prop.split(' ').length === 1) {
            list.push({ id: `css-prop-${index}`, text: `Unknown CSS property "${prop}" at line ${index + 1}`, line: index + 1 });
          }
        }
      }
    });

    return list;
  };

  // Compile active sandboxed document
  const getSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Include Tailwind via play CDN if styling requests it -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            margin: 0;
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          /* Custom User CSS */
          ${css}
        </style>
      </head>
      <body>
        <!-- Custom User HTML -->
        <div id="design-canvas" class="w-full h-full flex flex-col items-center justify-center">
          ${html}
        </div>

        <!-- Capture Frame Errors -->
        <script>
          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({
              type: 'PREVIEW_ERROR',
              message: message,
              line: lineno
            }, '*');
          };

          // Also capture console logs and warnings
          const _log = console.log;
          console.log = function(...args) {
            _log.apply(console, args);
            window.parent.postMessage({
              type: 'PREVIEW_LOG',
              message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
            }, '*');
          };
        </script>

        <!-- Custom User JS -->
        <script>
          try {
            ${js}
          } catch(err) {
            window.parent.postMessage({
              type: 'PREVIEW_ERROR',
              message: err.message,
              line: 1
            }, '*');
          }
        </script>
      </body>
      </html>
    `;
  };

  // Listen to frame events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_ERROR') {
        const errorText = `${event.data.message} (Line ${event.data.line})`;
        setConsoleErrors(prev => {
          // Prevent duplicates
          if (prev.some(e => e.text === errorText)) return prev;
          return [...prev, { id: Math.random().toString(), text: errorText, line: event.data.line }];
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Sync static analysis & reset frame errors on compile
  useEffect(() => {
    const staticErrors = checkStaticErrors();
    const cleanExternal = externalErrors.map(e => ({
      id: Math.random().toString(),
      text: `Compiler error: ${e.text} at line ${e.line}`,
      line: e.line
    }));
    setConsoleErrors([...staticErrors, ...cleanExternal]);
  }, [html, css, js, externalErrors]);

  const { width, height } = getDeviceDimensions();

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#09090b] font-sans relative text-[#e4e4e7]">
      {/* Visual Workspace Menu / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#27272a] bg-[#18181b] shadow-sm text-xs text-zinc-300">
        {/* Device select */}
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={() => setDevice('responsive')}
            className={`p-1.5 rounded-lg font-medium transition ${device === 'responsive' ? 'bg-indigo-950/40 text-indigo-400 font-bold' : 'hover:bg-[#27272a]'}`}
            title="Responsive Fluid Preview"
          >
            Responsive
          </button>
          <button 
            onClick={() => setDevice('phone')}
            className={`p-1.5 rounded-lg transition ${device === 'phone' ? 'bg-indigo-950/40 text-indigo-400' : 'hover:bg-[#27272a]'}`}
            title="Mobile Phone Simulation"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg transition ${device === 'tablet' ? 'bg-indigo-950/40 text-indigo-400' : 'hover:bg-[#27272a]'}`}
            title="Tablet Simulation"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setDevice('laptop')}
            className={`p-1.5 rounded-lg transition ${device === 'laptop' ? 'bg-indigo-950/40 text-indigo-400' : 'hover:bg-[#27272a]'}`}
            title="Desktop / Laptop Canvas"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Orientation Rotate */}
          {(device === 'phone' || device === 'tablet') && (
            <button 
              onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
              className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-400 hover:text-indigo-400 transition"
              title="Rotate Screen Aspect"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Zoom selector */}
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={() => setZoom(prev => Math.max(10, prev - 25))}
            className="p-1 hover:bg-[#27272a] rounded-lg text-zinc-400 hover:text-indigo-450 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <select 
            value={zoom} 
            onChange={(e) => setZoom(Number(e.target.value))}
            className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded-md py-0.5 px-1 font-mono text-[10px] focus:outline-none"
          >
            {ZOOM_PRESETS.map(z => (
              <option key={z} value={z}>{z}%</option>
            ))}
          </select>
          <button 
            onClick={() => setZoom(prev => Math.min(800, prev + 25))}
            className="p-1 hover:bg-[#27272a] rounded-lg text-zinc-400 hover:text-indigo-450 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Visual Stage */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-0 relative">
        <div 
          className="relative shadow-2xl transition-all duration-300 border border-[#27272a] bg-[#111113] rounded-2xl overflow-hidden"
          style={{
            width: width,
            height: height,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            maxWidth: device === 'responsive' ? '100%' : undefined,
            maxHeight: device === 'responsive' ? '100%' : undefined
          }}
        >
          {/* Iframe element */}
          <iframe 
            ref={iframeRef}
            srcDoc={getSrcDoc()}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals"
            title="Design preview sandbox"
          />
        </div>
      </div>

      {/* Bottom Live Error Console */}
      <div 
        className={`border-t border-[#27272a] bg-[#18181b] transition-all duration-350 flex flex-col ${
          isConsoleOpen ? 'h-40' : 'h-8'
        }`}
      >
        {/* Console Header */}
        <div 
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className="flex items-center justify-between px-4 py-1.5 bg-[#111113]/50 cursor-pointer select-none border-b border-[#27272a]"
        >
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Console & Errors</span>
            {consoleErrors.length > 0 ? (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full animate-pulse">
                {consoleErrors.length}
              </span>
            ) : (
              <span className="text-[9px] text-emerald-450 font-bold flex items-center space-x-1">
                <CheckCircle className="w-2.5 h-2.5 inline" />
                <span>Ready & Clean</span>
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400">{isConsoleOpen ? 'Collapse' : 'Expand'}</span>
        </div>

        {/* Errors / Logs List */}
        {isConsoleOpen && (
          <div className="flex-1 overflow-auto p-3 font-mono text-[10px] bg-slate-950 text-slate-300 space-y-1.5 select-text">
            {consoleErrors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <span>✓ All markup syntax checks passed. No runtime errors caught.</span>
              </div>
            ) : (
              consoleErrors.map((err) => (
                <div 
                  key={err.id}
                  onClick={() => err.line && onJumpToLine(err.line)}
                  className={`flex items-start space-x-2 p-1.5 rounded-lg transition-colors ${
                    err.line ? 'hover:bg-slate-900 cursor-pointer text-rose-400' : 'text-amber-400'
                  }`}
                  title={err.line ? "Click to jump to line in editor" : undefined}
                >
                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-100">{err.text}</span>
                    {err.line && (
                      <span className="ml-2 text-[9px] bg-rose-950/60 text-rose-400 px-1 py-0.2 rounded border border-rose-900">
                        Line {err.line}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
