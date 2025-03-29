
import React from "react";

export function FloorPlanGrid() {
  return (
    <>
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "linear-gradient(#55555510 1px, transparent 1px), linear-gradient(90deg, #55555510 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
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
