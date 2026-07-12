import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  FolderPlus, 
  Layers,
  FileCode
} from 'lucide-react';

interface LayersPanelProps {
  html: string;
  onUpdateHTML: (newHTML: string) => void;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
}

export default function LayersPanel({
  html,
  onUpdateHTML,
  selectedLayerId,
  onSelectLayer
}: LayersPanelProps) {
  const [layers, setLayers] = useState<{ id: string; name: string; tag: string; isHidden: boolean; isLocked: boolean; fullTag: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse HTML elements dynamically into visual layers
  useEffect(() => {
    const elementRegex = /<([a-zA-Z0-9:-]+)\s+class="([^"]+)"[^>]*>/g;
    const parsedLayers: typeof layers = [];
    let match;
    let idx = 0;

    while ((match = elementRegex.exec(html)) !== null) {
      const tag = match[1];
      const classes = match[2];
      const primaryClass = classes.split(' ').find(c => c.startsWith('pen-')) || classes.split(' ')[0] || 'element';
      
      parsedLayers.push({
        id: primaryClass + '-' + idx,
        name: primaryClass.replace('pen-', '').toUpperCase(),
        tag: tag,
        isHidden: classes.includes('hidden'),
        isLocked: html.includes(`pointer-events: none`) && html.includes(primaryClass),
        fullTag: match[0]
      });
      idx++;
    }

    // Default mock additions if empty
    if (parsedLayers.length === 0) {
      setLayers([
        { id: 'rect-0', name: 'RECTANGLE', tag: 'div', isHidden: false, isLocked: false, fullTag: 'div class="pen-rect"' },
        { id: 'circle-1', name: 'CIRCLE', tag: 'div', isHidden: false, isLocked: false, fullTag: 'div class="pen-circle"' }
      ]);
    } else {
      setLayers(parsedLayers);
    }
  }, [html]);

  // Hide or Show a layer by adding 'hidden' utility to HTML class
  const toggleVisibility = (layer: typeof layers[0]) => {
    let updatedHTML = html;
    if (layer.isHidden) {
      // Remove hidden class
      updatedHTML = html.replace(layer.fullTag, layer.fullTag.replace(' hidden', '').replace('hidden ', ''));
    } else {
      // Add hidden class
      if (layer.fullTag.includes('class="')) {
        updatedHTML = html.replace(layer.fullTag, layer.fullTag.replace('class="', 'class="hidden '));
      }
    }
    onUpdateHTML(updatedHTML);
  };

  // Lock or unlock layer
  const toggleLock = (layer: typeof layers[0]) => {
    let updatedHTML = html;
    if (layer.isLocked) {
      updatedHTML = html.replace('style="pointer-events: none;"', '').replace('style="pointer-events:none;"', '');
    } else {
      if (layer.fullTag.includes('class="')) {
        updatedHTML = html.replace(layer.fullTag, layer.fullTag.replace('class="', 'style="pointer-events: none;" class="'));
      }
    }
    onUpdateHTML(updatedHTML);
  };

  // Duplicate the selected element
  const duplicateLayer = (layer: typeof layers[0]) => {
    // Basic duplication: finding the element tag and cloning it inside HTML
    const index = html.indexOf(layer.fullTag);
    if (index !== -1) {
      const endTagIndex = html.indexOf('</div>', index);
      if (endTagIndex !== -1) {
        const fullElementMarkup = html.slice(index, endTagIndex + 6);
        const updatedHTML = html.slice(0, endTagIndex + 6) + '\n  ' + fullElementMarkup + html.slice(endTagIndex + 6);
        onUpdateHTML(updatedHTML);
      }
    }
  };

  // Delete element
  const deleteLayer = (layer: typeof layers[0]) => {
    const index = html.indexOf(layer.fullTag);
    if (index !== -1) {
      const endTagIndex = html.indexOf('</div>', index);
      if (endTagIndex !== -1) {
        const updatedHTML = html.replace(html.slice(index, endTagIndex + 6), '');
        onUpdateHTML(updatedHTML);
      }
    }
  };

  // Filter layers by search
  const filteredLayers = layers.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-[#111113] select-none text-[#e4e4e7]">
      {/* Search Bar header */}
      <div className="p-3 bg-[#18181b] border-b border-[#27272a] flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search active layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111113] text-[#e4e4e7] text-[11px] pl-8 pr-3 py-1.5 rounded-lg border border-[#27272a] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Layer Stacking List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredLayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-[11px] space-y-1">
            <Layers className="w-8 h-8 opacity-40 mb-1" />
            <span>No vector layers detected.</span>
            <span>Add tools from the top navbar.</span>
          </div>
        ) : (
          filteredLayers.map((layer) => {
            const isSelected = selectedLayerId === layer.id;
            return (
              <div 
                key={layer.id}
                onClick={() => onSelectLayer(isSelected ? null : layer.id)}
                className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer group text-xs ${
                  isSelected 
                    ? 'bg-indigo-950/40 text-indigo-400 font-bold border border-indigo-900/50' 
                    : 'hover:bg-[#18181b] text-zinc-300 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tracking-tight">{layer.name}</span>
                  <span className="text-[9px] font-bold text-slate-400 lowercase font-sans">({layer.tag})</span>
                </div>

                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Lock Toggle */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLock(layer); }}
                    className="p-1 hover:bg-[#27272a] rounded text-slate-400 hover:text-white transition"
                    title={layer.isLocked ? "Unlock Layer" : "Lock Layer"}
                  >
                    {layer.isLocked ? <Lock className="w-3.5 h-3.5 text-indigo-500" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Eye Visibility */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleVisibility(layer); }}
                    className="p-1 hover:bg-[#27272a] rounded text-slate-400 hover:text-white transition"
                    title={layer.isHidden ? "Show Layer" : "Hide Layer"}
                  >
                    {layer.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {/* Duplicate */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); duplicateLayer(layer); }}
                    className="p-1 hover:bg-[#27272a] rounded text-slate-400 hover:text-indigo-400 transition"
                    title="Duplicate Layer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteLayer(layer); }}
                    className="p-1 hover:bg-[#27272a] rounded text-slate-400 hover:text-rose-500 transition"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Layer Stacking Order Actions */}
      <div className="p-3 bg-[#18181b] border-t border-[#27272a] flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        <span>Stacking Depth:</span>
        <div className="flex space-x-1.5">
          <button 
            onClick={() => {
              if (selectedLayerId) {
                // Prepend helper: bring to front
                onUpdateHTML('\n  <!-- Staging front line -->\n  ' + html);
              }
            }}
            disabled={!selectedLayerId}
            className="flex items-center space-x-1 px-2 py-1 bg-[#111113] text-zinc-300 hover:text-indigo-400 border border-[#27272a] rounded-lg shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Bring Front</span>
          </button>

          <button 
            onClick={() => {
              if (selectedLayerId) {
                // Append helper: send to back
                onUpdateHTML(html + '\n  <!-- Staging back line -->\n  ');
              }
            }}
            disabled={!selectedLayerId}
            className="flex items-center space-x-1 px-2 py-1 bg-[#111113] text-zinc-300 hover:text-indigo-400 border border-[#27272a] rounded-lg shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Send Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
