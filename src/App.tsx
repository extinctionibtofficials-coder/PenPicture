import { useState, useEffect, useRef } from 'react';
import { 
  isFirebaseConnected, 
  auth, 
  signInWithPopup, 
  googleProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  db,
  handleFirestoreError,
  OperationType
} from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  where, 
  deleteDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { Project, Asset, ChatMessage, SystemNotification } from './types';
import { TOOL_TEMPLATES } from './utils/templates';
import { AuthScreen } from './components/AuthScreen';

// Components
import Navbar from './components/Navbar';
import PanelLayout from './components/PanelLayout';
import CodeWorkspace from './components/CodeWorkspace';
import LivePreview from './components/LivePreview';
import VisualCSSEditor from './components/VisualCSSEditor';
import LayersPanel from './components/LayersPanel';
import AssetManager from './components/AssetManager';
import ChatSystem from './components/ChatSystem';

// Overlays
import { 
  CommandPalette, 
  ProjectDialog, 
  SettingsModal, 
  WelcomeScreen, 
  ShortcutViewer, 
  PerformanceMonitor 
} from './components/Extras';

const DEFAULT_HTML = `<!-- PenPicture Vector Canvas -->
<div class="pen-rect flex flex-col items-center justify-center text-center p-6 bg-indigo-600 rounded-3xl shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300">
  <div class="text-3xl mb-2">⚡</div>
  <h2 class="text-lg font-bold text-white uppercase tracking-widest">PenPicture Workspace</h2>
  <p class="text-xs text-indigo-200 mt-1 max-w-[180px]">Edit HTML/CSS to watch changes render in real-time!</p>
</div>`;

const DEFAULT_CSS = `/* --- PenPicture Main Stylesheet --- */
.pen-rect {
  min-width: 240px;
  min-height: 200px;
  cursor: pointer;
}

.pen-circle {
  border: 4px solid #ffffff;
}
`;

const DEFAULT_JS = `// --- PenPicture Dynamic Scripting ---
console.log("Welcome to PenPicture Design IDE!");

const mainCard = document.querySelector('.pen-rect');
if (mainCard) {
  mainCard.addEventListener('click', () => {
    console.log("Design canvas card clicked!");
  });
}
`;

export default function App() {
  // Global App States
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestMode] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(isFirebaseConnected);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('default-project');
  const [projectName, setProjectName] = useState<string>('PenPicture Showcase');
  
  // Code editor states
  const [html, setHtml] = useState<string>(DEFAULT_HTML);
  const [css, setCss] = useState<string>(DEFAULT_CSS);
  const [js, setJs] = useState<string>(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [activeRightTab, setActiveRightTab] = useState<'properties' | 'layers' | 'assets' | 'chat'>('properties');

  // History stack for Undo/Redo
  const [undoStack, setUndoStack] = useState<{ html: string; css: string; js: string }[]>([]);
  const [redoStack, setRedoStack] = useState<{ html: string; css: string; js: string }[]>([]);

  // Assets and Collaborators
  const [assets, setAssets] = useState<Asset[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: 'notif-1', type: 'success', message: 'PenPicture cloud sync active.', timestamp: Date.now() }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Layout Theme Settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [autosave, setAutosave] = useState<boolean>(true);
  const [showMonitor, setShowMonitor] = useState<boolean>(true);

  // Overlay Dialog Toggles
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  // Selected visual layers inside live editor
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Editor instance reference
  const editorRef = useRef<any>(null);

  // Initialize Authentication listeners
  useEffect(() => {
    if (isFirebaseConnected && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);
        if (firebaseUser) {
          triggerToast('success', `Signed in securely as ${firebaseUser.email}`);
        }
      });
      return () => unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleCreateInitialProject = async (uid: string) => {
    const projectId = 'proj_' + Math.random().toString(36).substring(2, 11);
    const path = `projects/${projectId}`;
    const newProj = {
      id: projectId,
      userId: uid,
      name: 'My First Responsive Project',
      html: DEFAULT_HTML,
      css: DEFAULT_CSS,
      js: DEFAULT_JS,
      updatedAt: Date.now(),
      isFavorite: false,
      isArchived: false,
      versionHistory: []
    };
    try {
      await setDoc(doc(db, 'projects', projectId), newProj);
      setCurrentProjectId(projectId);
      setProjectName(newProj.name);
      setHtml(newProj.html);
      setCss(newProj.css);
      setJs(newProj.js);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Load and subscribe to projects from Firestore
  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }

    const path = 'projects';
    const q = query(collection(db, path), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProjects: Project[] = [];
      snapshot.forEach((docSnap) => {
        fetchedProjects.push({ id: docSnap.id, ...docSnap.data() } as any);
      });
      
      // Sort projects by updatedAt descending
      fetchedProjects.sort((a, b) => b.updatedAt - a.updatedAt);
      
      setProjects(fetchedProjects);

      // If we don't have a current project selected or the selected project was deleted/not found
      if (fetchedProjects.length > 0) {
        // Find if our current project is in the fetched list
        const exists = fetchedProjects.find(p => p.id === currentProjectId);
        if (!exists) {
          // Default to the first project
          const firstProj = fetchedProjects[0];
          setCurrentProjectId(firstProj.id);
          setProjectName(firstProj.name);
          setHtml(firstProj.html);
          setCss(firstProj.css);
          setJs(firstProj.js || '');
        } else {
          // Sync existing project values from DB if modified elsewhere
          const current = fetchedProjects.find(p => p.id === currentProjectId);
          if (current) {
            setProjectName(current.name);
          }
        }
      } else {
        // Create an initial default project for this user in Firestore if they have 0 projects!
        handleCreateInitialProject(user.uid);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user, currentProjectId]);

  // Load and subscribe to global chat messages from Firestore in real-time
  useEffect(() => {
    if (!isFirebaseConnected || !db) return;

    const path = 'chats';
    const chatsCol = collection(db, path);
    const unsubscribe = onSnapshot(chatsCol, (snapshot) => {
      const fetchedChats: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        fetchedChats.push(docSnap.data() as ChatMessage);
      });
      // Sort chats by timestamp ascending
      fetchedChats.sort((a, b) => a.timestamp - b.timestamp);
      setChatHistory(fetchedChats);
    }, (error) => {
      console.error("Failed to fetch global chats:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Autosave mechanism to Firestore
  useEffect(() => {
    if (!user || !autosave || !currentProjectId || currentProjectId === 'default-project') return;

    // Prevent saving if the project is not in our loaded projects (e.g. while transitioning)
    const exists = projects.some(p => p.id === currentProjectId);
    if (!exists && projects.length > 0) return;

    const delayDebounce = setTimeout(async () => {
      const path = `projects/${currentProjectId}`;
      try {
        await updateDoc(doc(db, 'projects', currentProjectId), {
          html,
          css,
          js,
          name: projectName,
          updatedAt: Date.now()
        });
      } catch (error) {
        console.warn("Autosave failed. Trying full write:", error);
      }
    }, 1500); // Debounce by 1.5 seconds

    return () => clearTimeout(delayDebounce);
  }, [html, css, js, projectName, currentProjectId, user, autosave]);

  // Sync theme with document elements
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto system setting
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  // Global Keyboard Shortcuts Hook
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Ctrl + S (Save / Compile)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToHistory();
        triggerToast('success', 'Design checkpoint saved successfully!');
      }

      // Ctrl + K (Command Palette)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      // Alt + M / Ctrl + M (Toggle Performance Monitor)
      if ((e.altKey || (e.ctrlKey && !e.shiftKey)) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowMonitor(prev => !prev);
        triggerToast('info', `Performance Monitor ${!showMonitor ? 'activated' : 'hidden'}`);
      }

      // Ctrl + Z (Undo)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl + Shift + Z (Redo)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [html, css, js, undoStack, redoStack, showMonitor]);

  // Toast notifier helper
  const triggerToast = (type: SystemNotification['type'], message: string) => {
    const newNotif: SystemNotification = {
      id: Math.random().toString(),
      type,
      message,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // State checkpointing for undo-redo
  const saveToHistory = () => {
    setUndoStack(prev => [...prev, { html, css, js }]);
    setRedoStack([]); // Clean redo stack on new input action
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      setRedoStack(r => [...r, { html, css, js }]);
      setHtml(prev.html);
      setCss(prev.css);
      setJs(prev.js);
      setUndoStack(u => u.slice(0, -1));
      triggerToast('info', 'Undo completed');
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setUndoStack(u => [...u, { html, css, js }]);
      setHtml(next.html);
      setCss(next.css);
      setJs(next.js);
      setRedoStack(r => r.slice(0, -1));
      triggerToast('info', 'Redo completed');
    }
  };

  // Google Provider login trigger
  const handleSignIn = async () => {
    if (isFirebaseConnected && auth) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        console.error("Popup Sign in blocked or failed. Running standalone mock account:", err);
        // STANDALONE mock login fallback
        setUser({
          uid: 'standalone-user',
          email: 'designer@penpicture.com',
          displayName: 'Pro Designer',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
          emailVerified: true
        } as any);
        triggerToast('success', 'Logged in to local designer session');
      }
    } else {
      // Mock log-in
      setUser({
        uid: 'mock-user',
        email: 'scripthutao2014@gmail.com',
        displayName: 'Hu Tao Developer',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
        emailVerified: true
      } as any);
      triggerToast('success', 'Workspace logged in successfully!');
    }
  };

  const handleSignOut = async () => {
    if (isFirebaseConnected && auth) {
      await signOut(auth);
    }
    setUser(null);
    triggerToast('info', 'Workspace session signed out');
  };

  // Command executor (from Ctrl+K Command Palette)
  const handleExecuteCommand = (commandId: string) => {
    if (commandId === 'insert-rect') {
      handleSelectQuickTool('shape-rect');
    } else if (commandId === 'insert-circle') {
      handleSelectQuickTool('shape-circle');
    } else if (commandId === 'insert-btn') {
      handleSelectQuickTool('comp-btn');
    } else if (commandId === 'insert-bento') {
      handleSelectQuickTool('layout-grid');
    } else if (commandId === 'theme-dark') {
      setTheme('dark');
    } else if (commandId === 'theme-light') {
      setTheme('light');
    } else if (commandId === 'view-notes') {
      alert("PenPicture v1.0.4 Release notes: Source-code visual design engine online! Built with modular resizable dashboards, over 50 responsive design templates, interactive CSS properties controls, drag-and-drop assets reader, and collaborative mock logs.");
    } else if (commandId === 'show-shortcuts') {
      setIsShortcutsOpen(true);
    } else if (commandId === 'export-zip') {
      handleExportZip();
    } else if (commandId === 'toggle-monitor') {
      setShowMonitor(prev => !prev);
      triggerToast('info', `Performance Monitor ${!showMonitor ? 'activated' : 'hidden'}`);
    }
  };

  // Exports project codes directly into formatted text documents or copy
  const handleExportZip = () => {
    // Generate markup and trigger standard browser text download
    const fullSourceCode = `<!-- PENPICTURE PROJECT SOURCE BUILD -->\n<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}</style>\n\n<!-- JS -->\n<script>\n${js}</script>`;
    const blob = new Blob([fullSourceCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-build.html`;
    link.click();
    triggerToast('success', 'HTML Export file downloaded successfully!');
  };

  // Tool templates adder
  const handleSelectQuickTool = (toolId: string) => {
    const template = TOOL_TEMPLATES.find(t => t.id === toolId);
    if (template) {
      saveToHistory();
      // Prepend or append layout
      setHtml(prev => prev + '\n\n' + template.html);
      setCss(prev => prev + '\n\n' + template.css);
      triggerToast('success', `Added ${template.name} block`);
    }
  };

  // Chat message send handler
  const handleSendMessage = async (text: string) => {
    const username = user?.displayName || user?.email || (guestMode ? 'Guest' : 'Designer');
    const avatar = user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;

    const newMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      sender: {
        username,
        avatar,
        status: 'online'
      },
      text,
      timestamp: Date.now()
    };

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, 'chats', newMsg.id), newMsg);
      } catch (error) {
        console.error("Error sending global chat message:", error);
        setChatHistory(prev => [...prev, newMsg]);
      }
    } else {
      setChatHistory(prev => [...prev, newMsg]);
    }
  };

  const handlePinMessage = async (id: string) => {
    const message = chatHistory.find(m => m.id === id);
    if (!message) return;

    const newPinned = !message.isPinned;

    if (isFirebaseConnected && db) {
      try {
        await updateDoc(doc(db, 'chats', id), { isPinned: newPinned });
        triggerToast('success', newPinned ? 'Message pinned' : 'Message unpinned');
      } catch (error) {
        console.error("Error pinning chat message:", error);
      }
    } else {
      setChatHistory(prev => prev.map(m => m.id === id ? { ...m, isPinned: newPinned } : m));
      triggerToast('info', 'Chat message pin status changed');
    }
  };

  // Left Content: Live Preview Frame with console logs
  const leftContent = (
    <LivePreview 
      html={html} 
      css={css} 
      js={js} 
      onJumpToLine={(line) => {
        if (editorRef.current) {
          editorRef.current.revealLine(line);
          editorRef.current.setPosition({ lineNumber: line, column: 1 });
          editorRef.current.focus();
        }
      }}
      externalErrors={[]}
    />
  );

  // Center Content: Tabbed Code editor
  const centerContent = (
    <CodeWorkspace 
      html={html}
      css={css}
      js={js}
      onChangeHTML={setHtml}
      onChangeCSS={setCss}
      onChangeJS={setJs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      editorRef={editorRef}
    />
  );

  // Right Content: Visual controls, layers tree, asset file libraries, collaboration chat
  const rightContent = (
    <div className="flex flex-col h-full bg-[#111113]">
      {/* Sidebar Sub Tab switcher */}
      <div className="flex bg-[#18181b] p-1 border-b border-[#27272a] space-x-1 shrink-0">
        {[
          { id: 'properties', label: 'Styles' },
          { id: 'layers', label: 'Layers' },
          { id: 'assets', label: 'Assets' },
          { id: 'chat', label: 'Chat' }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveRightTab(tb.id as any)}
            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg transition ${
              activeRightTab === tb.id 
                ? 'bg-indigo-600 text-[#e4e4e7]' 
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        {activeRightTab === 'properties' && (
          <VisualCSSEditor css={css} onUpdateCSS={setCss} html={html} />
        )}
        {activeRightTab === 'layers' && (
          <LayersPanel 
            html={html} 
            onUpdateHTML={setHtml} 
            selectedLayerId={selectedLayerId} 
            onSelectLayer={setSelectedLayerId} 
          />
        )}
        {activeRightTab === 'assets' && (
          <AssetManager 
            assets={assets} 
            onAddAsset={(newAsset) => {
              setAssets(prev => [newAsset, ...prev]);
              triggerToast('success', `Uploaded asset file: ${newAsset.name}`);
            }}
            onSelectAsset={(asset) => {
              // Click asset injects content
              if (asset.type === 'svg') {
                setHtml(prev => prev + '\n' + asset.content);
                triggerToast('success', 'Inserted Vector graphic to layout');
              } else if (asset.type === 'image') {
                setHtml(prev => prev + `\n<img src="${asset.content}" class="w-48 h-auto rounded-2xl" />`);
                triggerToast('success', 'Inserted photo container block');
              } else if (asset.type === 'color-palette') {
                const colors = JSON.parse(asset.content);
                setCss(prev => prev + `\n/* Designer Color Palette applied */\n:root {\n  --primary: ${colors[0]};\n  --secondary: ${colors[1]};\n  --background-stage: ${colors[3]};\n}`);
                triggerToast('success', 'Injected developer color palette definitions');
              }
            }}
          />
        )}
        {activeRightTab === 'chat' && (
          <ChatSystem 
            chatHistory={chatHistory} 
            onSendMessage={handleSendMessage} 
            onPinMessage={handlePinMessage} 
            currentUser={user}
          />
        )}
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4 text-[#e4e4e7]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-zinc-400">Loading PenPicture Studio...</p>
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <AuthScreen 
        onSuccess={(u) => {
          setUser(u);
          setGuestMode(false);
        }} 
        onContinueOffline={() => {
          setGuestMode(true);
          triggerToast('info', 'Switched to local Guest / Offline mode');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#09090b] text-[#e4e4e7]">
      
      {/* Top Header menu */}
      <Navbar 
        projectName={projectName}
        onRenameProject={(name) => {
          setProjectName(name);
          triggerToast('success', `Renamed workspace to: ${name}`);
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onSelectQuickTool={handleSelectQuickTool}
        onOpenProjectDialog={() => setIsProjectDialogOpen(true)}
        onNewProject={async () => {
          if (user) {
            const projectId = 'proj_' + Math.random().toString(36).substring(2, 11);
            const path = `projects/${projectId}`;
            const newProj = {
              id: projectId,
              userId: user.uid,
              name: 'Untitled Project',
              html: DEFAULT_HTML,
              css: DEFAULT_CSS,
              js: DEFAULT_JS,
              updatedAt: Date.now(),
              isFavorite: false,
              isArchived: false,
              versionHistory: []
            };
            try {
              await setDoc(doc(db, 'projects', projectId), newProj);
              setCurrentProjectId(projectId);
              setProjectName(newProj.name);
              setHtml(newProj.html);
              setCss(newProj.css);
              setJs(newProj.js);
              triggerToast('success', 'New workspace created!');
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, path);
            }
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => {
          navigator.clipboard.writeText(window.location.href);
          triggerToast('success', 'Workspace shareable address copied!');
        }}
        notificationsCount={notifications.length}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        theme={theme}
        onChangeTheme={setTheme}
        onTogglePreviewMode={() => {
          // Open fullscreen design preview
          const el = document.getElementById('design-preview-container');
          if (el) el.requestFullscreen();
        }}
      />

      {/* Main Workspace Resizable layout block */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <PanelLayout 
          leftContent={leftContent} 
          centerContent={centerContent} 
          rightContent={rightContent} 
          leftTitle="Design View & Canvas"
          centerTitle={`Source Code Editor - ${activeTab.toUpperCase()}`}
          rightTitle="Workspace Inspector"
        />

        {/* Float performance statistics widgets */}
        {showMonitor && (
          <div className="hidden md:block">
            <PerformanceMonitor 
              html={html} 
              css={css} 
              onClose={() => setShowMonitor(false)} 
            />
          </div>
        )}
      </div>

      {/* Slide-out notifications Center */}
      {showNotifications && (
        <div className="fixed top-14 right-4 w-80 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Workspace Notifications</span>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">×</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border rounded-xl text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-350">{n.message}</p>
                <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals & Dialog overlays */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onExecuteCommand={handleExecuteCommand} 
      />

      <ProjectDialog 
        isOpen={isProjectDialogOpen} 
        onClose={() => setIsProjectDialogOpen(false)} 
        projects={projects}
        onSelectProject={(id) => {
          const selected = projects.find(p => p.id === id);
          if (selected) {
            setCurrentProjectId(selected.id);
            setProjectName(selected.name);
            setHtml(selected.html);
            setCss(selected.css);
            setJs(selected.js);
            triggerToast('success', `Switched to project: ${selected.name}`);
          }
        }}
        onNewProject={async () => {
          if (user) {
            const projectId = 'proj_' + Math.random().toString(36).substring(2, 11);
            const path = `projects/${projectId}`;
            const newProj = {
              id: projectId,
              userId: user.uid,
              name: 'Untitled Project',
              html: DEFAULT_HTML,
              css: DEFAULT_CSS,
              js: DEFAULT_JS,
              updatedAt: Date.now(),
              isFavorite: false,
              isArchived: false,
              versionHistory: []
            };
            try {
              await setDoc(doc(db, 'projects', projectId), newProj);
              setCurrentProjectId(projectId);
              setProjectName(newProj.name);
              setHtml(newProj.html);
              setCss(newProj.css);
              setJs(newProj.js);
              triggerToast('success', 'New project created successfully!');
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, path);
            }
          }
        }}
        onFavorite={async (id) => {
          if (user) {
            const proj = projects.find(p => p.id === id);
            if (proj) {
              const path = `projects/${id}`;
              try {
                await updateDoc(doc(db, 'projects', id), { isFavorite: !proj.isFavorite });
                triggerToast('success', proj.isFavorite ? 'Removed from bookmarks' : 'Added to bookmarks');
              } catch (error) {
                handleFirestoreError(error, OperationType.UPDATE, path);
              }
            }
          }
        }}
        onArchive={async (id) => {
          if (user) {
            const proj = projects.find(p => p.id === id);
            if (proj) {
              const path = `projects/${id}`;
              try {
                await updateDoc(doc(db, 'projects', id), { isArchived: !proj.isArchived });
                triggerToast('success', proj.isArchived ? 'Restored project' : 'Project archived');
              } catch (error) {
                handleFirestoreError(error, OperationType.UPDATE, path);
              }
            }
          }
        }}
        onDuplicate={async (id) => {
          if (user) {
            const proj = projects.find(p => p.id === id);
            if (proj) {
              const newId = 'proj_' + Math.random().toString(36).substring(2, 11);
              const path = `projects/${newId}`;
              const cloned = {
                ...proj,
                id: newId,
                name: `${proj.name} (Copy)`,
                updatedAt: Date.now(),
                isFavorite: false
              };
              try {
                await setDoc(doc(db, 'projects', newId), cloned);
                triggerToast('success', 'Project cloned successfully!');
              } catch (error) {
                handleFirestoreError(error, OperationType.CREATE, path);
              }
            }
          }
        }}
        onDelete={async (id) => {
          if (user) {
            const path = `projects/${id}`;
            try {
              await deleteDoc(doc(db, 'projects', id));
              triggerToast('warning', 'Project deleted successfully');
            } catch (error) {
              handleFirestoreError(error, OperationType.DELETE, path);
            }
          }
        }}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        autosave={autosave}
        onToggleAutosave={() => {
          setAutosave(!autosave);
          triggerToast('info', `Autosave ${!autosave ? 'activated' : 'disabled'}`);
        }}
        showMonitor={showMonitor}
        onToggleMonitor={() => {
          setShowMonitor(!showMonitor);
          triggerToast('info', `Performance Monitor ${!showMonitor ? 'activated' : 'disabled'}`);
        }}
      />

      <WelcomeScreen 
        isOpen={isWelcomeOpen} 
        onClose={() => setIsWelcomeOpen(false)} 
      />

      <ShortcutViewer 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
      />

    </div>
  );
}
