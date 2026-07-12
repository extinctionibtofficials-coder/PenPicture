import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Palette, 
  FileCode, 
  FolderOpen, 
  Search, 
  Type, 
  Video, 
  Music,
  Plus
} from 'lucide-react';
import { Asset } from '../types';

interface AssetManagerProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onSelectAsset: (asset: Asset) => void;
}

export default function AssetManager({
  assets,
  onAddAsset,
  onSelectAsset
}: AssetManagerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined assets (SVGs, Palettes, Gradients)
  const PRESET_ASSETS: Asset[] = [
    {
      id: 'palette-indigo-sky',
      name: 'Indigo Twilight',
      type: 'color-palette',
      content: JSON.stringify(['#6366f1', '#38bdf8', '#0284c7', '#0f172a']),
      category: 'Color Palettes',
      createdAt: Date.now()
    },
    {
      id: 'palette-emerald-forest',
      name: 'Emerald Forest',
      type: 'color-palette',
      content: JSON.stringify(['#10b981', '#34d399', '#065f46', '#f0fdf4']),
      category: 'Color Palettes',
      createdAt: Date.now()
    },
    {
      id: 'gradient-sunset',
      name: 'Cosmic Sunset',
      type: 'gradient',
      content: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
      category: 'Gradients',
      createdAt: Date.now()
    },
    {
      id: 'svg-logo',
      name: 'Abstract Crown Vector',
      type: 'svg',
      content: `<svg class="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      category: 'Illustrations',
      createdAt: Date.now()
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const generateRandomID = () => {
    return 'asset_fbase_' + Math.random().toString(36).substring(2, 10);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      createAssetFromFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      createAssetFromFile(e.target.files[0]);
    }
  };

  const createAssetFromFile = (file: File) => {
    const reader = new FileReader();
    
    // Determine type
    let type: Asset['type'] = 'image';
    if (file.type.includes('svg')) type = 'svg';
    else if (file.type.includes('audio')) type = 'audio';
    else if (file.type.includes('video')) type = 'video';
    else if (file.type.includes('json')) type = 'json';

    reader.onload = (event) => {
      if (event.target?.result) {
        const newAsset: Asset = {
          id: generateRandomID(),
          name: file.name,
          type: type,
          content: event.target.result as string,
          createdAt: Date.now()
        };
        onAddAsset(newAsset);
      }
    };

    if (type === 'json' || type === 'svg') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const allVisibleAssets = [...PRESET_ASSETS, ...assets];

  const filteredAssets = allVisibleAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || asset.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-[#111113] select-none text-[#e4e4e7]">
      
      {/* Drag & Drop Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`m-3 p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-indigo-600 bg-indigo-950/20 text-indigo-400' 
            : 'border-[#27272a] hover:border-indigo-500 text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <UploadCloud className="w-8 h-8 mb-2 text-indigo-400" />
        <span className="text-xs font-bold block mb-1">Drag assets here or click</span>
        <span className="text-[10px] text-zinc-500">Supports SVG, PNG, JPG, JSON & Fonts</span>
        <input 
          ref={fileInputRef}
          type="file" 
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*,video/*,audio/*,application/json,.svg"
        />
      </div>

      {/* Search & Filter Header */}
      <div className="px-3 pb-2 border-b border-[#27272a] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search asset files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111113] text-[#e4e4e7] text-[11px] pl-8 pr-3 py-2 rounded-xl border border-[#27272a] focus:outline-none"
          />
        </div>

        {/* Categories Pill slider */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-rounded">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'svg', label: 'Vectors / Icons' },
            { id: 'color-palette', label: 'Palettes' },
            { id: 'gradient', label: 'Gradients' },
            { id: 'image', label: 'Photos' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg shrink-0 transition ${
                activeCategory === cat.id 
                  ? 'bg-zinc-800 text-white' 
                  : 'bg-[#18181b] text-zinc-400 hover:text-zinc-300 border border-[#27272a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Library List */}
      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 gap-3.5">
        {filteredAssets.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-slate-400 text-xs flex flex-col items-center">
            <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
            <span>No assets match search or category</span>
          </div>
        ) : (
          filteredAssets.map(asset => (
            <div 
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="group border border-[#27272a] hover:border-indigo-500/50 bg-[#18181b]/50 p-2.5 rounded-2xl flex flex-col items-center justify-between transition cursor-pointer relative h-32"
            >
              {/* Asset content preview representation */}
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden mb-1">
                {asset.type === 'color-palette' && (
                  <div className="flex h-5 w-full rounded-md overflow-hidden border border-[#27272a]">
                    {JSON.parse(asset.content).map((c: string, idx: number) => (
                      <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}

                {asset.type === 'gradient' && (
                  <div className="w-full h-10 rounded-md border border-[#27272a]" style={{ background: asset.content }} />
                )}

                {asset.type === 'svg' && (
                  <div className="scale-75 origin-center text-center" dangerouslySetInnerHTML={{ __html: asset.content }} />
                )}

                {asset.type === 'image' && (
                  <img src={asset.content} alt={asset.name} className="max-h-16 max-w-full rounded-lg object-contain shadow-sm" />
                )}

                {(asset.type === 'audio' || asset.type === 'video' || asset.type === 'json') && (
                  <div className="w-10 h-10 bg-indigo-950/40 text-indigo-400 rounded-xl flex items-center justify-center text-xs border border-indigo-900/30">
                    {asset.type === 'audio' ? <Music className="w-5 h-5" /> : asset.type === 'video' ? <Video className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
                  </div>
                )}
              </div>

              {/* Asset Name Label */}
              <div className="w-full text-left truncate">
                <span className="text-[10px] font-bold text-zinc-250 truncate block">{asset.name}</span>
                <span className="text-[8px] font-mono text-indigo-400 tracking-tight block uppercase">{asset.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
