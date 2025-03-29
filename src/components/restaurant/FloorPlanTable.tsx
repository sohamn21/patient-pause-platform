
import React, { useState, useRef } from "react";
import { FloorItem, TableType } from "./types";

interface FloorPlanTableProps {
  item: FloorItem;
  isSelected: boolean;
  tableTypes: TableType[];
  onClick: (e: React.MouseEvent) => void;
  onChange: (updatedItem: FloorItem) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function FloorPlanTable({
  item,
  isSelected,
  tableTypes,
  onClick,
  onChange,
  onDragStart,
  onDragEnd,
}: FloorPlanTableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    onDragStart();
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: item.x, y: item.y });
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    
    const updatedItem = {
      ...item,
      x: initialPos.x + dx,
      y: initialPos.y + dy,
    };
    
    onChange(updatedItem);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    onDragEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Determine styles based on item type
  let shapeClass = '';
  let backgroundColor = '';
  let borderColor = '';
  let content = null;
  
  if (item.type === 'table') {
    // Apply status-based colors
    if (item.status === 'occupied') {
      backgroundColor = 'bg-red-200';
      borderColor = 'border-red-500';
    } else if (item.status === 'reserved') {
      backgroundColor = 'bg-amber-200';
      borderColor = 'border-amber-500';
    } else {
      backgroundColor = 'bg-primary/20';
      borderColor = 'border-primary/70';
    }
    
    if (item.shape === 'circle') {
      shapeClass = 'rounded-full';
    } else {
      shapeClass = 'rounded-md';
    }
    
    content = (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs font-bold">{item.number}</span>
        {item.capacity && (
          <span className="text-[10px] text-muted-foreground">{item.capacity} seats</span>
        )}
      </div>
    );
  } else if (item.type === 'wall') {
    backgroundColor = 'bg-gray-400';
    borderColor = 'border-gray-600';
  } else if (item.type === 'door') {
    backgroundColor = 'bg-yellow-300';
    borderColor = 'border-yellow-600';
  } else if (item.type === 'decoration') {
    backgroundColor = 'bg-blue-200';
    borderColor = 'border-blue-400';
    shapeClass = 'rounded-md';
  }
  
  return (
    <div
      ref={dragRef}
      className={`absolute cursor-move border-2 ${backgroundColor} ${borderColor} ${shapeClass} ${
        isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
        transition: isDragging ? 'none' : 'transform 0.1s',
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      {content}
      {item.label && (
        <div className="absolute -bottom-6 left-0 w-full text-center text-xs truncate pointer-events-none">
          {item.label}
        </div>
      )}
    </div>
  );
}
