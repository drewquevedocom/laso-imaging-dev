import { useState } from "react";
import { Minimize2, Maximize2, X, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimecardFloatingPanelProps {
  children: React.ReactNode;
  minimizedContent?: React.ReactNode;
  onClose?: () => void;
}

const TimecardFloatingPanel = ({ children, minimizedContent, onClose }: TimecardFloatingPanelProps) => {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: Math.max(0, e.clientX - dragOffset.x),
      y: Math.max(0, e.clientY - dragOffset.y),
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className="fixed z-[9999]"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={cn(
          "rounded-xl border border-slate-700/80 bg-[#0F172A] shadow-2xl shadow-black/50 transition-all duration-300 overflow-hidden",
          minimized ? "w-[320px]" : "w-[90vw] max-w-4xl"
        )}
      >
        {/* Drag handle + controls */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700/50 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <GripHorizontal className="h-4 w-4" />
            <span className="font-medium">Staff Timecard</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              {minimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {minimized ? (
          <div className="p-3">{minimizedContent}</div>
        ) : (
          <div className="max-h-[85vh] overflow-y-auto">{children}</div>
        )}
      </div>
    </div>
  );
};

export default TimecardFloatingPanel;
