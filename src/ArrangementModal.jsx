import React, { useState, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';

const ArrangementModal = ({ onClose, onSave, initialOrder }) => {
  const [sectionOrder, setSectionOrder] = useState(initialOrder || [
    { id: 1, name: 'Personal Informations' },
    { id: 2, name: 'Payment Informations' },
    { id: 3, name: 'Employment Informations' },
    { id: 4, name: 'Contract Informations' }
  ]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Section drag and drop
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newOrder = [...sectionOrder];
    const draggedItemContent = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setSectionOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSave = () => {
    onSave && onSave(sectionOrder);
    onClose && onClose();
  };

  // Modal dragging
  const handleModalMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDraggingModal(true);
      setDragStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
      });
    }
  };

  const handleModalMouseMove = (e) => {
    if (isDraggingModal) {
      setModalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleModalMouseUp = () => {
    setIsDraggingModal(false);
  };

  useEffect(() => {
    if (isDraggingModal) {
      window.addEventListener('mousemove', handleModalMouseMove);
      window.addEventListener('mouseup', handleModalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleModalMouseMove);
        window.removeEventListener('mouseup', handleModalMouseUp);
      };
    }
  }, [isDraggingModal, dragStart]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm"
        style={{
          transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
          cursor: isDraggingModal ? 'move' : 'default'
        }}
        onMouseDown={handleModalMouseDown}
      >
        {/* Header - Draggable */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between drag-handle cursor-move bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900">Settings-Arrangement</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Arrangement Order</h3>
          
          <div className="space-y-2 mb-4">
            {sectionOrder.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 bg-blue-900 text-white rounded-lg cursor-move transition-all hover:bg-blue-800 ${
                  draggedItem === index ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                <span className="text-sm font-medium flex-1">{section.name}</span>
                <GripVertical className="w-5 h-5 text-white/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrangementModal;
