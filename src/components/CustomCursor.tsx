
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
          width: '40px',
          height: '40px',
          transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          borderRadius: '50%',
          transition: 'transform 0.15s ease-out',
          opacity: hidden ? 0 : 1,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r={linkHovered ? "10" : "6"} fill="#1EAEDB" fillOpacity="0.9"/>
          <circle cx="20" cy="20" r="19" stroke="#FFFFFF" strokeWidth="2" strokeOpacity={linkHovered ? "0.7" : "0.5"}/>
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;
