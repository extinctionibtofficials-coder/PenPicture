import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ChevronsLeft, 
  ChevronsRight, 
  RefreshCw, 
  ArrowLeftRight, 
  Expand,
  Eye,
  Code,
  Sliders
} from 'lucide-react';

interface PanelLayoutProps {
  leftContent: React.ReactNode;
  centerContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftTitle: string;
  centerTitle: string;
  rightTitle: string;
}

export default function PanelLayout({
  leftContent,
  centerContent,
  rightContent,
  leftTitle,
  centerTitle,
  rightTitle
}: PanelLayoutProps) {
  // Mobile check state
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState<'left' | 'center' | 'right'>('left');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Use lg threshold for comfortable three column layouts
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Panel state: left, center, right
  const [sizes, setSizes] = useState<{ left: number; center: number; right: number }>({
    left: 30,
    center: 45,
    right: 25
  });

  const [collapses, setCollapses] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false
  });

  // Panel orders to support position swapping (0, 1, 2)
  const [orders, setOrders] = useState<string[]>(['left', 'center', 'right']);
  
  // Maximize states
  const [maximizedPanel, setMaximizedPanel] = useState<string | null>(null);

  // Fullscreen container state
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef<'left' | 'right' | null>(null);

  const handleMouseDown = (divider: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = divider;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !isResizingRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // Position of mouse relative to container in percentage
    const mouseXPercent = ((e.clientX - containerRect.left) / containerWidth) * 100;

    setSizes(prev => {
      let left = prev.left;
      let center = prev.center;
      let right = prev.right;

      if (isResizingRef.current === 'left') {
        const delta = mouseXPercent - prev.left;
        left = Math.max(10, Math.min(60, mouseXPercent));
        center = Math.max(20, prev.center - delta);
      } else if (isResizingRef.current === 'right') {
        const currentRightBorder = 100 - prev.right;
        const delta = mouseXPercent - currentRightBorder;
        right = Math.max(10, Math.min(50, 100 - mouseXPercent));
        center = Math.max(20, prev.center + delta);
      }

      // Rebalance to sum up to 100
      const total = left + center + right;
      return {
        left: (left / total) * 100,
        center: (center / total) * 100,
        right: (right / total) * 100
      };
    });
  };

  const handleMouseUp = () => {
    isResizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetLayout = () => {
    setSizes({ left: 30, center: 45, right: 25 });
    setCollapses({ left: false, right: false });
    setOrders(['left', 'center', 'right']);
    setMaximizedPanel(null);
    setFullscreenPanel(null);
  };

  const swapPanels = () => {
    // Cycles order: left -> center -> right -> left
    setOrders(prev => [prev[1], prev[2], prev[0]]);
  };

  const handleHeaderDoubleClick = (panelId: string) => {
    setMaximizedPanel(prev => prev === panelId ? null : panelId);
  };

  // Render separate panel wrapper
  const renderPanel = (id: string, title: string, content: React.ReactNode) => {
    const isCollapsed = (id === 'left' && collapses.left) || (id === 'right' && collapses.right);
    if (isCollapsed && !isMobile) return null;

    return (
      <div 
        id={`panel-${id}`}
        className={`flex flex-col h-full bg-[#111113] border border-[#27272a] rounded-2xl shadow-sm transition-all overflow-hidden ${
          maximizedPanel === id ? 'fixed inset-4 z-50 bg-[#111113] shadow-2xl ring-1 ring-[#27272a]' : 'relative'
        }`}
        style={{
          flex: (maximizedPanel && !isMobile) ? (maximizedPanel === id ? '1 1 100%' : '0 0 0%') : undefined
        }}
      >
        {/* Panel Header */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b border-[#27272a] bg-[#18181b] cursor-pointer select-none"
          onDoubleClick={() => !isMobile && handleHeaderDoubleClick(id)}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${id === 'left' ? 'bg-indigo-500' : id === 'center' ? 'bg-violet-500' : 'bg-emerald-500'}`} />
            <span className="text-xs font-bold text-[#e4e4e7] uppercase tracking-wider">{title}</span>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
              {/* Collapse triggers */}
              {id === 'left' && (
                <button 
                  onClick={() => setCollapses(prev => ({ ...prev, left: true }))}
                  className="p-1 hover:bg-[#27272a] rounded-lg text-slate-400 hover:text-[#e4e4e7] transition"
                  title="Collapse Panel"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
              )}
              {id === 'right' && (
                <button 
                  onClick={() => setCollapses(prev => ({ ...prev, right: true }))}
                  className="p-1 hover:bg-[#27272a] rounded-lg text-slate-400 hover:text-[#e4e4e7] transition"
                  title="Collapse Panel"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Maximize toggle */}
              <button 
                onClick={() => handleHeaderDoubleClick(id)}
                className="p-1 hover:bg-[#27272a] rounded-lg text-slate-400 hover:text-white transition"
                title={maximizedPanel === id ? "Restore Size" : "Maximize Panel"}
              >
                {maximizedPanel === id ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Fullscreen browser API trigger */}
              <button 
                onClick={() => {
                  const el = document.getElementById(`panel-${id}`);
                  if (el) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                      setFullscreenPanel(null);
                    } else {
                      el.requestFullscreen();
                      setFullscreenPanel(id);
                    }
                  }
                }}
                className="p-1 hover:bg-[#27272a] rounded-lg text-slate-400 hover:text-white transition"
                title="Fullscreen"
              >
                <Expand className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-auto bg-[#111113]">
          {content}
        </div>
      </div>
    );
  };

  // Map panel keys to content elements
  const panelMap: { [key: string]: { title: string; content: React.ReactNode } } = {
    left: { title: leftTitle, content: leftContent },
    center: { title: centerTitle, content: centerContent },
    right: { title: rightTitle, content: rightContent }
  };

  // Mobile Layout
  if (isMobile) {
    const activeInfo = panelMap[activeMobilePanel];
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-[#09090b]">
        {/* Active Panel Body */}
        <div className="flex-1 p-2 pb-0 min-h-0 overflow-hidden relative">
          {renderPanel(activeMobilePanel, activeInfo.title, activeInfo.content)}
        </div>

        {/* Mobile Navigation Dock */}
        <div className="h-16 shrink-0 bg-[#18181b] border-t border-[#27272a] px-4 flex items-center justify-around select-none">
          {[
            { id: 'left', label: 'Preview', icon: Eye, color: 'text-indigo-400' },
            { id: 'center', label: 'Editor', icon: Code, color: 'text-violet-400' },
            { id: 'right', label: 'Inspector', icon: Sliders, color: 'text-emerald-400' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMobilePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMobilePanel(item.id as any)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold transition-all relative ${
                  isActive ? `${item.color} scale-105` : 'text-zinc-500 hover:text-zinc-350'
                }`}
              >
                <Icon className="w-5.5 h-5.5 mb-1" />
                <span>{item.label}</span>
                {isActive && (
                  <span className={`absolute bottom-1 w-5 h-0.5 rounded-full bg-current`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[#09090b]">
      {/* Workspace Controls Utility bar */}
      <div className="flex items-center justify-between px-6 py-1.5 bg-[#18181b] border-b border-[#27272a]">
        <div className="flex items-center space-x-2">
          {/* Quick collapsed indicators */}
          {collapses.left && (
            <button 
              onClick={() => setCollapses(prev => ({ ...prev, left: false }))}
              className="px-2.5 py-1 bg-indigo-950/40 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-900 border border-indigo-900/40 transition flex items-center space-x-1 uppercase"
            >
              <ChevronsRight className="w-3 h-3" />
              <span>Show Live Preview</span>
            </button>
          )}
          {collapses.right && (
            <button 
              onClick={() => setCollapses(prev => ({ ...prev, right: false }))}
              className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 text-[10px] font-bold rounded-lg hover:bg-emerald-900 border border-emerald-900/40 transition flex items-center space-x-1 uppercase"
            >
              <ChevronsLeft className="w-3 h-3" />
              <span>Show Properties</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={swapPanels}
            className="flex items-center space-x-1 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
            title="Swap Panels Layout Rotation"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Rotate Layout</span>
          </button>

          <button 
            onClick={resetLayout}
            className="flex items-center space-x-1 px-2.5 py-1 text-zinc-400 hover:text-zinc-100 text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
            title="Restore Original Workspace"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Layout</span>
          </button>
        </div>
      </div>

      {/* Main Resizable Layout Body */}
      <div 
        ref={containerRef}
        className="flex-1 flex p-3 gap-3 overflow-hidden h-full min-h-0 select-none relative"
      >
        {maximizedPanel ? (
          // Render ONLY the maximized panel
          <div className="flex-1 h-full min-h-0 relative">
            {renderPanel(maximizedPanel, panelMap[maximizedPanel].title, panelMap[maximizedPanel].content)}
          </div>
        ) : (
          // Render all panels in current layout order
          orders.map((id, index) => {
            const isLast = index === orders.length - 1;
            const isLeftCollapsed = collapses.left && id === 'left';
            const isRightCollapsed = collapses.right && id === 'right';

            if (isLeftCollapsed || isRightCollapsed) return null;

            // Calculate active panel widths
            let width = sizes[id as 'left' | 'center' | 'right'];
            if (id === 'left' && collapses.right) {
              width += sizes.right / 2;
            } else if (id === 'center') {
              if (collapses.left) width += sizes.left / 2;
              if (collapses.right) width += sizes.right / 2;
            } else if (id === 'right' && collapses.left) {
              width += sizes.left / 2;
            }

            return (
              <React.Fragment key={id}>
                <div 
                  className="h-full min-h-0 relative flex flex-col"
                  style={{ width: `${width}%` }}
                >
                  {renderPanel(id, panelMap[id].title, panelMap[id].content)}
                </div>

                {!isLast && (
                  <div 
                    className="w-1 hover:w-1.5 bg-transparent hover:bg-indigo-500/30 active:bg-indigo-600/50 cursor-col-resize h-full rounded transition-all self-stretch flex items-center justify-center relative group"
                    onMouseDown={(e) => handleMouseDown(id === 'left' ? 'left' : 'right', e)}
                  >
                    <div className="absolute w-2 h-8 bg-[#27272a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
