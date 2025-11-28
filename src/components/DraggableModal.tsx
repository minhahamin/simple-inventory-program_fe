import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  initialWidth?: number;
  initialHeight?: number;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  initialWidth = 800,
  initialHeight = 600,
}) => {
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [modalSize, setModalSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // 모달 열 때 중앙 위치로 초기화
  useEffect(() => {
    if (isOpen) {
      const centerX = (window.innerWidth - initialWidth) / 2;
      const centerY = (window.innerHeight - initialHeight) / 2;
      setModalPosition({ x: centerX, y: centerY });
      setModalSize({ width: initialWidth, height: initialHeight });
    }
  }, [isOpen, initialWidth, initialHeight]);

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target === resizeHandleRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  // 리사이즈 시작
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 마우스 이동 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        const maxX = window.innerWidth - modalSize.width;
        const maxY = window.innerHeight - modalSize.height;
        setModalPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const minWidth = 400;
        const minHeight = 300;
        const maxWidth = window.innerWidth - modalPosition.x;
        const maxHeight = window.innerHeight - modalPosition.y;
        setModalSize({
          width: Math.max(minWidth, Math.min(modalSize.width + deltaX, maxWidth)),
          height: Math.max(minHeight, Math.min(modalSize.height + deltaY, maxHeight)),
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, modalPosition, modalSize]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 animate-slideUp"
        style={{
          position: 'absolute',
          left: `${modalPosition.x}px`,
          top: `${modalPosition.y}px`,
          width: `${modalSize.width}px`,
          height: `${modalSize.height}px`,
          cursor: isDragging ? 'move' : 'default',
          animation: 'slideUp 0.3s ease-out',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className="sticky top-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-5 flex justify-between items-center cursor-move select-none shadow-md z-10"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-white/30 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 cursor-pointer group"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div 
          className="overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white" 
          style={{ height: `${modalSize.height - 80}px` }}
        >
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* 리사이즈 핸들 */}
        <div
          ref={resizeHandleRef}
          className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-200 rounded-tl-lg shadow-lg group"
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
          }}
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"></div>
        </div>
      </div>
      
      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default DraggableModal;

