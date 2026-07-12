import { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Settings, 
  Bell, 
  User, 
  Share2, 
  Maximize, 
  Play, 
  Layers, 
  SlidersHorizontal,
  FolderOpen,
  Plus,
  Compass,
  ArrowRightLeft,
  Moon,
  Sun,
  Laptop,
  LogOut
} from 'lucide-react';
import { User as FirebaseUser } from '../firebase';

interface NavbarProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenCommandPalette: () => void;
  onSelectQuickTool: (toolId: string) => void;
  onOpenProjectDialog: () => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  notificationsCount: number;
  onToggleNotifications: () => void;
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  theme: 'light' | 'dark' | 'auto';
  onChangeTheme: (theme: 'light' | 'dark' | 'auto') => void;
  onTogglePreviewMode: () => void;
}

export default function Navbar({
  projectName,
  onRenameProject,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenCommandPalette,
  onSelectQuickTool,
  onOpenProjectDialog,
  onNewProject,
  onOpenSettings,
  onOpenShare,
  notificationsCount,
  onToggleNotifications,
  user,
  onSignIn,
  onSignOut,
  theme,
  onChangeTheme,
  onTogglePreviewMode
}: NavbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onRenameProject(tempName);
    }
    setIsEditingName(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 5 Quick Tools highlighted directly on the navbar
  const QUICK_TOOLS = [
    { id: 'shape-rect', label: 'Rectangle', icon: '■' },
    { id: 'shape-circle', label: 'Circle', icon: '●' },
    { id: 'comp-btn', label: 'Button', icon: '⧇' },
    { id: 'layout-grid', label: 'Bento Grid', icon: '⊞' },
    { id: 'media-codeblock', label: 'Code Block', icon: '‹›' }
  ];

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#27272a] bg-[#18181b] px-4 shadow-sm select-none z-40 relative overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none">
      {/* Brand & Project Info */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {/* Logo & Log Out stacked */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-sm shadow-md shadow-indigo-500/20">
              P
            </div>
            <span className="hidden lg:inline-block font-sans font-bold text-[#e4e4e7] tracking-tight text-sm">
              PenPicture
            </span>
          </div>
          <button
            onClick={onSignOut}
            className="mt-0.5 px-1.5 py-0.5 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 hover:border-red-900/50 rounded text-[8px] text-red-400 hover:text-red-300 transition cursor-pointer font-bold leading-none flex items-center justify-center space-x-0.5"
            title="Sign Out / Exit Workspace"
          >
            <LogOut className="w-2 h-2" />
            <span>Log Out</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-[#27272a]" />

        {/* Project Name Rename */}
        <div className="flex items-center space-x-1.5">
          <FolderOpen className="w-4 h-4 text-slate-400" />
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
              className="text-sm font-semibold px-2 py-0.5 border border-indigo-500 rounded-lg focus:outline-none bg-[#09090b] text-[#e4e4e7]"
            />
          ) : (
            <span
              onClick={() => {
                setTempName(projectName);
                setIsEditingName(true);
              }}
              className="text-sm font-semibold text-zinc-200 hover:bg-zinc-800 px-2 py-1 rounded-lg cursor-pointer transition truncate max-w-[150px]"
              title="Click to rename project"
            >
              {projectName}
            </span>
          )}
        </div>

        <button 
          onClick={onOpenProjectDialog}
          className="p-1 hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-slate-300 transition"
          title="Open Recent Projects"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Tools & Actions */}
      <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center border border-[#27272a] rounded-lg p-0.5 bg-[#09090b]">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition ${
              canUndo 
                ? 'text-zinc-200 hover:bg-zinc-800 cursor-pointer' 
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition ${
              canRedo 
                ? 'text-zinc-200 hover:bg-zinc-800 cursor-pointer' 
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Quick Search Box */}
        <div 
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1.5 border border-[#27272a] rounded-lg text-xs text-zinc-400 bg-[#09090b] hover:bg-zinc-800 cursor-pointer w-40 transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left truncate">Search tools...</span>
          <span className="text-[9px] font-mono border border-[#27272a] px-1 py-0.2 rounded bg-[#18181b]">⌘K</span>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center space-x-1 pl-2">
          {QUICK_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectQuickTool(tool.id)}
              className="flex items-center space-x-1 px-2 py-1 text-zinc-300 hover:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              title={`Quick Add ${tool.label}`}
            >
              <span className="text-sm">{tool.icon}</span>
              <span className="hidden lg:inline">{tool.label}</span>
            </button>
          ))}

          {/* More Tools dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-950/40 text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-900/40 border border-indigo-900/40 transition cursor-pointer"
            >
              <span>More Tools</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isToolsOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-[#27272a] bg-[#18181b] p-2 shadow-xl z-50 text-xs text-[#e4e4e7]">
                <div className="p-2 font-bold text-zinc-500 uppercase tracking-widest text-[9px] border-b border-[#27272a] mb-1">
                  Add Objects By Category
                </div>
                <button
                  onClick={() => { onSelectQuickTool('shape-star'); setIsToolsOpen(false); }}
                  className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg flex items-center space-x-2"
                >
                  <span>⭐</span> <span>Star & Polygon Shapes</span>
                </button>
                <button
                  onClick={() => { onSelectQuickTool('typo-serif'); setIsToolsOpen(false); }}
                  className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg flex items-center space-x-2"
                >
                  <span>✍</span> <span>Editorial Typography</span>
                </button>
                <button
                  onClick={() => { onSelectQuickTool('comp-pricing'); setIsToolsOpen(false); }}
                  className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg flex items-center space-x-2"
                >
                  <span>💳</span> <span>Premium Bento Pricing</span>
                </button>
                <button
                  onClick={() => { onSelectQuickTool('media-qr'); setIsToolsOpen(false); }}
                  className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg flex items-center space-x-2"
                >
                  <span>🖾</span> <span>SVG QR Codes</span>
                </button>
                <button
                  onClick={() => { onSelectQuickTool('viz-ring'); setIsToolsOpen(false); }}
                  className="w-full text-left p-2 hover:bg-zinc-800 rounded-lg flex items-center space-x-2"
                >
                  <span>🗠</span> <span>Progress Rings & Metrics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Utility Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Toggle Theme */}
        <div className="flex items-center border border-[#27272a] rounded-lg p-0.5 bg-[#09090b]">
          <button
            onClick={() => onChangeTheme('light')}
            className={`p-1 rounded-md transition ${theme === 'light' ? 'bg-zinc-800 text-amber-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeTheme('dark')}
            className={`p-1 rounded-md transition ${theme === 'dark' ? 'bg-zinc-800 text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeTheme('auto')}
            className={`p-1 rounded-md transition ${theme === 'auto' ? 'bg-zinc-800 text-zinc-300 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Auto System Mode"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Run / Live Preview mode trigger */}
        <button
          onClick={onTogglePreviewMode}
          className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
          title="Toggle Full Preview Frame"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* AI (Coming Soon) Button */}
        <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-[#18181b] border border-[#27272a] text-violet-400 text-xs font-bold rounded-lg">
          <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
          <span>AI</span>
          <span className="text-[8px] bg-violet-600 text-white px-1 rounded-full scale-90">SOON</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onToggleNotifications}
          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-300 relative transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border border-[#27272a] rounded-full animate-bounce" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-300 transition cursor-pointer"
          title="Editor settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="p-2 hover:bg-zinc-800 rounded-lg text-indigo-400 transition cursor-pointer"
          title="Share Project"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="hidden sm:inline-block p-2 hover:bg-zinc-800 rounded-lg text-zinc-300 transition cursor-pointer"
          title="Fullscreen app"
        >
          <Maximize className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#27272a]" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-1 p-1 hover:bg-zinc-800 rounded-full transition cursor-pointer"
          >
            {user ? (
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email || 'PP'}`}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                <User className="w-4 h-4" />
              </div>
            )}
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#27272a] bg-[#18181b] p-3 shadow-xl z-50 text-xs text-[#e4e4e7]">
              {user ? (
                <div>
                  <div className="flex items-center space-x-2.5 pb-2 border-b border-[#27272a] mb-2">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email || 'PP'}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="truncate">
                      <p className="font-bold text-zinc-100 truncate">{user.displayName || 'Developer'}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="py-1 text-[10px] text-emerald-500 font-bold flex items-center space-x-1 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>Real-time Sync Active</span>
                  </div>
                  <button
                    onClick={() => { onSignOut(); setIsProfileDropdownOpen(false); }}
                    className="w-full text-center py-2 bg-zinc-800 hover:bg-zinc-700 text-[#e4e4e7] rounded-lg font-bold transition cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-[#e4e4e7] mb-1">Access Cloud Workspace</p>
                  <p className="text-[10px] text-zinc-450 mb-3">Sync layouts to your persistent Firestore and configure multi-user previews.</p>
                  <button
                    onClick={() => { onSignIn(); setIsProfileDropdownOpen(false); }}
                    className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
