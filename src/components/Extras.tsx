import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Terminal, 
  Settings, 
  BookOpen, 
  Cpu, 
  FileCode, 
  HelpCircle, 
  History, 
  Folder, 
  Star, 
  Copy, 
  Archive, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { Project } from '../types';

// ==========================================
// 1. COMMAND PALETTE (CTRL + K)
// ==========================================
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string) => void;
}

export function CommandPalette({ isOpen, onClose, onExecuteCommand }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { id: 'insert-rect', name: 'Insert Shape: Rectangle', category: 'Canvas' },
    { id: 'insert-circle', name: 'Insert Shape: Circle', category: 'Canvas' },
    { id: 'insert-btn', name: 'Insert Component: Custom Button', category: 'Canvas' },
    { id: 'insert-bento', name: 'Insert Layout: Bento Grid', category: 'Canvas' },
    { id: 'theme-dark', name: 'Switch Theme to Dark', category: 'Workspace' },
    { id: 'theme-light', name: 'Switch Theme to Light', category: 'Workspace' },
    { id: 'toggle-monitor', name: 'Toggle Performance Monitor', category: 'Workspace' },
    { id: 'export-zip', name: 'Export Project Package (ZIP)', category: 'Publishing' },
    { id: 'view-notes', name: 'View Release Notes', category: 'About' },
    { id: 'show-shortcuts', name: 'Show Keyboard Shortcut Guide', category: 'Help' }
  ];

  const filtered = COMMANDS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 z-50">
      <div className="w-full max-w-xl bg-[#18181b] rounded-2xl border border-[#27272a] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 text-[#e4e4e7]">
        {/* Search */}
        <div className="flex items-center space-x-2 px-4 py-3 border-b border-[#27272a] bg-[#111113]">
          <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[#e4e4e7] border-none text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-[#27272a] rounded">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-64 overflow-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs">No commands match your query.</div>
          ) : (
            filtered.map(cmd => (
              <div
                key={cmd.id}
                onClick={() => {
                  onExecuteCommand(cmd.id);
                  onClose();
                }}
                className="w-full text-left p-2.5 hover:bg-[#111113] hover:text-indigo-400 rounded-xl flex items-center justify-between cursor-pointer transition text-xs"
              >
                <span className="font-semibold text-zinc-200">{cmd.name}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#111113] px-2 py-0.5 rounded-md border border-[#27272a]">
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="bg-[#111113] border-t border-[#27272a] p-2 text-center text-[10px] text-zinc-500">
          Tip: Press <kbd className="bg-[#18181b] px-1.5 py-0.2 border border-[#27272a] rounded">ESC</kbd> to exit palette.
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. PROJECT DIALOG (LOAD / CREATE)
// ==========================================
interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectDialog({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onNewProject,
  onFavorite,
  onArchive,
  onDuplicate,
  onDelete
}: ProjectDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#18181b] border border-[#27272a] rounded-3xl shadow-2xl p-6 flex flex-col h-[450px] text-[#e4e4e7]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a] bg-[#111113] -mx-6 px-6 -mt-6 pt-6 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Workspace Project Center</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#27272a] rounded-lg">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-auto py-4 space-y-2.5">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 text-xs">No projects available. Create a new one!</div>
          ) : (
            projects.map(proj => (
              <div 
                key={proj.id}
                onClick={() => { onSelectProject(proj.id); onClose(); }}
                className="p-3 border border-[#27272a] hover:border-indigo-500 bg-[#111113]/50 hover:bg-[#111113] rounded-2xl flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-zinc-200">{proj.name}</span>
                    {proj.isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Updated {new Date(proj.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onFavorite(proj.id)}
                    className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-500 hover:text-amber-500 transition"
                    title="Favorite"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDuplicate(proj.id)}
                    className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-500 hover:text-indigo-400 transition"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onArchive(proj.id)}
                    className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-500 hover:text-amber-600 transition"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(proj.id)}
                    className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-500 hover:text-rose-500 transition"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#27272a] pt-4 flex justify-end">
          <button 
            onClick={() => { onNewProject(); onClose(); }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Folder className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. SETTINGS PANEL (AUTOSAVE, MAPS, FONTS)
// ==========================================
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autosave: boolean;
  onToggleAutosave: () => void;
  showMonitor?: boolean;
  onToggleMonitor?: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  autosave, 
  onToggleAutosave,
  showMonitor = true,
  onToggleMonitor
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-3xl shadow-2xl p-6 text-[#e4e4e7]">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4 bg-[#111113] -mx-6 px-6 -mt-6 pt-6 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">PenPicture Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#27272a] rounded-lg">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Autosave Toggle */}
          <div className="flex justify-between items-center p-3 bg-[#111113] border border-[#27272a] rounded-2xl">
            <div>
              <span className="text-xs font-bold text-white">Enable Real-Time Autosave</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Saves code updates into persistent local storage instantly.</p>
            </div>
            <button
              onClick={onToggleAutosave}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${autosave ? 'bg-indigo-600' : 'bg-zinc-800'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${autosave ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Performance Monitor Toggle */}
          {onToggleMonitor && (
            <div className="flex justify-between items-center p-3 bg-[#111113] border border-[#27272a] rounded-2xl">
              <div>
                <span className="text-xs font-bold text-white">Show Performance Monitor</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">Floating panel displaying FPS rating and file size metrics.</p>
              </div>
              <button
                onClick={onToggleMonitor}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${showMonitor ? 'bg-indigo-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${showMonitor ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          )}

          {/* Code Wrap Preference */}
          <div className="flex justify-between items-center p-3 bg-[#111113] border border-[#27272a] rounded-2xl">
            <div>
              <span className="text-xs font-bold text-white">Editor Word Wrap</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Toggle wrap-around for long source markup lines.</p>
            </div>
            <select className="bg-[#18181b] text-zinc-350 border border-[#27272a] rounded-lg p-1 text-xs focus:outline-none">
              <option>Wrap Enabled</option>
              <option>Disable Wrap</option>
            </select>
          </div>

          {/* Minimap Preference */}
          <div className="flex justify-between items-center p-3 bg-[#111113] border border-[#27272a] rounded-2xl">
            <div>
              <span className="text-xs font-bold text-white">Show Monaco Minimap</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Toggle right-hand sidebar visual miniature code overview.</p>
            </div>
            <select className="bg-[#18181b] text-zinc-350 border border-[#27272a] rounded-lg p-1 text-xs focus:outline-none">
              <option>Minimap Visible</option>
              <option>Minimap Hidden</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. WELCOME & TUTORIAL OVERLAY
// ==========================================
interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeScreen({ isOpen, onClose }: WelcomeScreenProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#18181b] border border-[#27272a] rounded-3xl shadow-2xl p-6 text-center text-[#e4e4e7]">
        <div className="w-14 h-14 bg-indigo-950 flex items-center justify-center rounded-2xl text-2xl mx-auto mb-4 animate-bounce border border-indigo-900/50 text-indigo-400">
          ✦
        </div>

        <h3 className="text-lg font-bold text-white">Welcome to PenPicture Studio!</h3>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
          Create professional responsive designs from markup and code instead of manual drawing. Pure code design power.
        </p>

        {/* Bullet guidelines */}
        <div className="text-left py-4 space-y-3.5 max-w-sm mx-auto">
          <div className="flex items-start space-x-2.5">
            <span className="p-1.5 bg-[#111113] border border-[#27272a] rounded-lg text-xs font-bold text-indigo-400 shrink-0">1</span>
            <div>
              <h5 className="text-xs font-bold text-white">Add Tool Objects</h5>
              <p className="text-[10px] text-zinc-500">Click Quick tools on the navbar to insert 50+ vector shapes or components.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5">
            <span className="p-1.5 bg-[#111113] border border-[#27272a] rounded-lg text-xs font-bold text-indigo-400 shrink-0">2</span>
            <div>
              <h5 className="text-xs font-bold text-white">Visual CSS Editing</h5>
              <p className="text-[10px] text-zinc-500">Move layout, gradients, or opacity sliders to update style blocks dynamically.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5">
            <span className="p-1.5 bg-[#111113] border border-[#27272a] rounded-lg text-xs font-bold text-indigo-400 shrink-0">3</span>
            <div>
              <h5 className="text-xs font-bold text-white">Export & Publish</h5>
              <p className="text-[10px] text-zinc-500">Download complete HTML, CSS, ZIP builds, or PDF layouts in 1-click.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
        >
          Enter Design Studio
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. KEYBOARD SHORTCUTS VIEW
// ==========================================
interface ShortcutViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutViewer({ isOpen, onClose }: ShortcutViewerProps) {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { keys: 'Ctrl + S', desc: 'Autosave / Build layout preview' },
    { keys: 'Ctrl + Z', desc: 'Undo last markup compilation' },
    { keys: 'Ctrl + Shift + Z', desc: 'Redo undone layout block' },
    { keys: 'Ctrl + K', desc: 'Open Command Palette' },
    { keys: 'Ctrl + /', desc: 'Line comment block toggles' },
    { keys: 'Alt + Drag', desc: 'Fine pixel guide snapping measurements' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-3xl shadow-2xl p-6 text-[#e4e4e7]">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4 bg-[#111113] -mx-6 px-6 -mt-6 pt-6 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Keyboard Shortcut Reference</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#27272a] rounded-lg">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SHORTCUTS.map(sc => (
            <div key={sc.keys} className="flex items-center justify-between p-2.5 bg-[#111113] border border-[#27272a] rounded-xl text-xs">
              <span className="text-zinc-350">{sc.desc}</span>
              <kbd className="px-2 py-0.5 bg-[#18181b] text-indigo-400 text-[10px] font-bold border border-[#27272a] shadow-sm rounded-md font-mono">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. PERFORMANCE & CODE STATS MONITOR
// ==========================================
interface PerformanceMonitorProps {
  html: string;
  css: string;
  onClose?: () => void;
}

export function PerformanceMonitor({ html, css, onClose }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60);
  const [position, setPosition] = useState({ x: 24, y: 400 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  // Load saved position on mount & fit window bounds
  useEffect(() => {
    try {
      const saved = localStorage.getItem('penpicture_monitor_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          // Keep within reasonable screen bounds
          const safeX = Math.max(4, Math.min(window.innerWidth - 220, parsed.x));
          const safeY = Math.max(4, Math.min(window.innerHeight - 250, parsed.y));
          setPosition({ x: safeX, y: safeY });
          return;
        }
      }
    } catch (e) {}

    // Dynamic laptop layout default
    const defaultY = Math.max(100, window.innerHeight - 220);
    setPosition({ x: 24, y: defaultY });
  }, []);

  // Simple simulator for frame render rates
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(prev => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        return Math.max(54, Math.min(60, prev + jitter));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // Ignore clicks on closing button

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    let newX = dragStartRef.current.posX + deltaX;
    let newY = dragStartRef.current.posY + deltaY;

    // Bounds boundaries constraint
    newX = Math.max(4, Math.min(window.innerWidth - 220, newX));
    newY = Math.max(4, Math.min(window.innerHeight - 250, newY));

    const newPos = { x: newX, y: newY };
    setPosition(newPos);
    try {
      localStorage.setItem('penpicture_monitor_pos', JSON.stringify(newPos));
    } catch (err) {}
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const totalLines = (html || '').split('\n').length + (css || '').split('\n').length;
  const characterSize = (html || '').length + (css || '').length;

  return (
    <div 
      className={`p-3 bg-[#111113]/95 backdrop-blur-md text-zinc-300 rounded-2xl font-mono text-[10px] space-y-2 border border-[#27272a] shadow-2xl max-w-[200px] absolute z-40 select-none transition-all duration-75 ${
        isDragging ? 'shadow-indigo-500/10 border-indigo-500/50 scale-[1.01]' : 'hover:border-[#3f3f46]'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div 
        className="flex items-center justify-between border-b border-[#27272a] pb-1.5 font-sans font-bold uppercase tracking-widest text-[9px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        title="Drag header to move panel"
      >
        <div className="flex items-center space-x-1">
          <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Monitor Panel</span>
        </div>
        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-0.5 hover:bg-[#27272a] rounded text-zinc-500 hover:text-white transition cursor-pointer"
            title="Sembunyikan Panel"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <span>FPS Rating:</span>
        <span className="font-bold text-emerald-400">{fps} Hz</span>
      </div>

      <div className="flex justify-between">
        <span>Total Lines:</span>
        <span className="font-bold text-slate-100">{totalLines}</span>
      </div>

      <div className="flex justify-between">
        <span>Code Weight:</span>
        <span className="font-bold text-slate-100">{(characterSize / 1024).toFixed(2)} KB</span>
      </div>

      <div className="flex justify-between">
        <span>Status Mode:</span>
        <span className="font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>STANDALONE</span>
        </span>
      </div>
    </div>
  );
}
