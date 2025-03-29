
import React from "react";

export function FloorPlanGrid({ 
  onClick,
  interactive = false 
}: { 
  onClick?: (x: number, y: number) => void
  interactive?: boolean 
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (!interactive || !onClick) return;
    
    // Get click coordinates relative to the grid
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20) * 20;
    const y = Math.floor((e.clientY - rect.top) / 20) * 20;
    
    onClick(x, y);
  };

  return (
    <>
      <div 
        className={`absolute inset-0 w-full h-full ${interactive ? 'cursor-crosshair' : ''}`}
        style={{
          backgroundImage: "linear-gradient(#55555510 1px, transparent 1px), linear-gradient(90deg, #55555510 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        onClick={handleClick}
      />
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "linear-gradient(#55555520 10px, transparent 10px), linear-gradient(90deg, #55555520 10px, transparent 10px)",
          backgroundSize: "100px 100px",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
