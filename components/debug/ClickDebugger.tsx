'use client';

import React, { useState, useEffect } from 'react';

interface ClickEvent {
  x: number;
  y: number;
  target: string;
  time: string;
}

export default function ClickDebugger() {
  const [isActive, setIsActive] = useState(false);
  const [clickEvents, setClickEvents] = useState([] as ClickEvent[]);
  const [hoveredElement, setHoveredElement] = useState(null as {
    tag: string;
    classes: string;
    zIndex: string;
    position: string;
  } | null);

  // Toggle the debugger on/off with Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setIsActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track click events when active
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const classes = target.className;
      const id = target.id;
      const text = target.textContent?.slice(0, 20) || '';

      const newEvent: ClickEvent = {
        x: e.clientX,
        y: e.clientY,
        target: `${tagName}${id ? `#${id}` : ''}${
          text ? ` "${text}${text.length > 20 ? '...' : ''}"` : ''
        }`,
        time: new Date().toLocaleTimeString(),
      };

      setClickEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isActive]);

  // Track mouse position and hovered element
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);

      setHoveredElement({
        tag: target.tagName.toLowerCase(),
        classes:
          target.className.toString().slice(0, 50) +
          (target.className.toString().length > 50 ? '...' : ''),
        zIndex: computedStyle.zIndex,
        position: computedStyle.position,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '300px',
        maxHeight: '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        zIndex: 10000,
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Click Debugger (Shift+D to toggle)
      </div>

      {/* Hovered element info */}
      <div
        style={{
          padding: '5px',
          marginBottom: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Hovered Element:</div>
        {hoveredElement ? (
          <>
            <div>Tag: {hoveredElement.tag}</div>
            <div>Classes: {hoveredElement.classes}</div>
            <div>
              Position: {hoveredElement.position}, z-index:{' '}
              {hoveredElement.zIndex}
            </div>
          </>
        ) : (
          <div>No element hovered</div>
        )}
      </div>

      {/* Click events */}
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        Recent Clicks:
      </div>
      {clickEvents.length === 0 ? (
        <div>No clicks recorded yet</div>
      ) : (
        clickEvents.map((event, index) => (
          <div
            key={index}
            style={{
              padding: '5px',
              marginBottom: '5px',
              backgroundColor:
                index === 0
                  ? 'rgba(0, 255, 0, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
            }}
          >
            <div>
              {event.time} - ({event.x}, {event.y})
            </div>
            <div>Target: {event.target}</div>
          </div>
        ))
      )}
    </div>
  );
}
