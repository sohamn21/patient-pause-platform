
import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.tagName === 'INPUT' || 
          target.tagName === 'SELECT' || 
          target.tagName === 'TEXTAREA' || 
          target.closest('[role="button"]') || 
          target.closest('[role="link"]')) {
        setLinkHovered(true);
      } else {
        setLinkHovered(false);
      }
    };

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        className={`transition-transform duration-100 ${clicked ? 'scale-90' : linkHovered ? 'scale-150' : 'scale-100'}`}
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          transform: `translate(${position.x - 12}px, ${position.y - 12}px)`,
          borderRadius: '50%',
          transition: 'transform 0.15s ease-out',
          opacity: hidden ? 0 : 1,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r={linkHovered ? "6" : "3"} fill="#82F9FF" fillOpacity="0.8"/>
          <circle cx="12" cy="12" r="11.5" stroke="white" strokeOpacity={linkHovered ? "0.4" : "0.2"}/>
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;

