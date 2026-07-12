import { useState, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { 
  FileCode, 
  Settings, 
  Sparkles, 
  Maximize2, 
  FolderOpen, 
  Pin, 
  Zap, 
  Trash2,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface CodeWorkspaceProps {
  html: string;
  css: string;
  js: string;
  onChangeHTML: (val: string) => void;
  onChangeCSS: (val: string) => void;
  onChangeJS: (val: string) => void;
  activeTab: 'html' | 'css' | 'js';
  onChangeTab: (tab: 'html' | 'css' | 'js') => void;
  editorRef: any;
}

export default function CodeWorkspace({
  html,
  css,
  js,
  onChangeHTML,
  onChangeCSS,
  onChangeJS,
  activeTab,
  onChangeTab,
  editorRef
}: CodeWorkspaceProps) {
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [isPinned, setIsPinned] = useState<{ html: boolean; css: boolean; js: boolean }>({
    html: false,
    css: false,
    js: false
  });
  const [isCopied, setIsCopied] = useState(false);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Add professional custom keyboard shortcuts inside Monaco Editor!
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Simulate build on Save
      const compileToast = document.getElementById('compile-toast');
      if (compileToast) {
        compileToast.classList.remove('opacity-0');
        setTimeout(() => compileToast.classList.add('opacity-0'), 1500);
      }
    });
  };

  // Basic Beautify/Formatting helper
  const handleFormatCode = () => {
    if (!editorRef.current) return;
    editorRef.current.getAction('editor.action.formatDocument').run();
  };

  // Minimal code minification utility
  const handleMinifyCode = () => {
    if (activeTab === 'html') {
      const minified = html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      onChangeHTML(minified);
    } else if (activeTab === 'css') {
      const minified = css.replace(/\s+/g, ' ').replace(/\{\s+/g, '{').replace(/\s+\}/g, '}').trim();
      onChangeCSS(minified);
    } else if (activeTab === 'js') {
      const minified = js.replace(/\s+/g, ' ').trim();
      onChangeJS(minified);
    }
  };

  const activeCodeValue = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const activeLanguage = activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCodeValue);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const togglePin = (tab: 'html' | 'css' | 'js') => {
    setIsPinned(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#111113] text-[#e4e4e7] select-none font-sans relative">
      
      {/* Tab bar header */}
      <div className="flex items-center justify-between bg-[#18181b] px-3 py-1.5 border-b border-[#27272a]">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {/* HTML Tab */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onChangeTab('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition ${
                activeTab === 'html' 
                  ? 'bg-[#111113] text-indigo-400 font-bold border-b-2 border-indigo-500' 
                  : 'text-zinc-400 hover:bg-[#111113]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-orange-500" />
              <span>index.html</span>
              {isPinned.html && <Pin className="w-2.5 h-2.5 text-amber-500 rotate-45" />}
            </button>
            <button onClick={() => togglePin('html')} className="p-0.5 hover:bg-[#27272a] rounded">
              <Pin className={`w-2.5 h-2.5 ${isPinned.html ? 'text-amber-500' : 'text-zinc-600'}`} />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#27272a]" />

          {/* CSS Tab */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onChangeTab('css')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition ${
                activeTab === 'css' 
                  ? 'bg-[#111113] text-indigo-400 font-bold border-b-2 border-indigo-500' 
                  : 'text-zinc-400 hover:bg-[#111113]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>styles.css</span>
              {isPinned.css && <Pin className="w-2.5 h-2.5 text-amber-500 rotate-45" />}
            </button>
            <button onClick={() => togglePin('css')} className="p-0.5 hover:bg-[#27272a] rounded">
              <Pin className={`w-2.5 h-2.5 ${isPinned.css ? 'text-amber-500' : 'text-zinc-600'}`} />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#27272a]" />

          {/* JS Tab */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onChangeTab('js')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition ${
                activeTab === 'js' 
                  ? 'bg-[#111113] text-indigo-400 font-bold border-b-2 border-indigo-500' 
                  : 'text-zinc-400 hover:bg-[#111113]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>app.js</span>
              {isPinned.js && <Pin className="w-2.5 h-2.5 text-amber-500 rotate-45" />}
            </button>
            <button onClick={() => togglePin('js')} className="p-0.5 hover:bg-[#27272a] rounded">
              <Pin className={`w-2.5 h-2.5 ${isPinned.js ? 'text-amber-500' : 'text-zinc-600'}`} />
            </button>
          </div>
        </div>

        {/* Theme select & Action helpers */}
        <div className="flex items-center space-x-2">
          {/* Format / Minify Actions */}
          <button
            onClick={handleFormatCode}
            className="px-2 py-1 hover:bg-[#111113] rounded text-[10px] font-bold text-slate-400 hover:text-white uppercase transition cursor-pointer"
            title="Beautify document spacing"
          >
            Format
          </button>
          <button
            onClick={handleMinifyCode}
            className="px-2 py-1 hover:bg-[#111113] rounded text-[10px] font-bold text-slate-400 hover:text-white uppercase transition cursor-pointer"
            title="Minify script footprint"
          >
            Minify
          </button>
          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-[#111113] hover:bg-zinc-800 text-[10px] font-bold text-indigo-400 rounded-lg flex items-center space-x-1 transition cursor-pointer"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Zap className="w-3 h-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          <select 
            value={editorTheme} 
            onChange={(e) => setEditorTheme(e.target.value as any)}
            className="bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded-md text-[10px] py-0.5 px-1 focus:outline-none"
          >
            <option value="vs-dark">Dark Theme</option>
            <option value="light">Light Theme</option>
          </select>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 min-h-0 select-text">
        <Editor
          height="100%"
          language={activeLanguage}
          theme={editorTheme}
          value={activeCodeValue}
          onMount={handleEditorDidMount}
          onChange={(val) => {
            const code = val || '';
            if (activeTab === 'html') onChangeHTML(code);
            else if (activeTab === 'css') onChangeCSS(code);
            else if (activeTab === 'js') onChangeJS(code);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            wordWrap: 'on',
            folding: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true }
          }}
        />
      </div>

      {/* Embedded Save Notification banner */}
      <div 
        id="compile-toast"
        className="absolute top-12 right-4 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-md opacity-0 pointer-events-none transition-opacity duration-300 flex items-center space-x-1 z-50"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span>Build Compiled Successfully!</span>
      </div>

    </div>
  );
}
