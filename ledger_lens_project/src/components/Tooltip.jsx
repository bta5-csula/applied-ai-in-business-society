import React, { useState, useRef, useLayoutEffect } from 'react';

export default function Tooltip({ text, children, isPrinting }) {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    if (isHovered && tooltipRef.current && !isPrinting) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 12; // safety margin from screen edge
      let nudge = 0;

      if (tooltipRect.left < padding) {
        nudge = padding - tooltipRect.left;
      } else if (tooltipRect.right > window.innerWidth - padding) {
        nudge = (window.innerWidth - padding) - tooltipRect.right;
      }

      tooltipRef.current.style.setProperty('--tooltip-offset', `${nudge}px`);
    }
  }, [isHovered, isPrinting]);

  return (
    <span 
      ref={triggerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => !isPrinting && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ borderBottom: '1px dotted var(--text-dim)', cursor: 'help', color: 'inherit' }}>
        {children}
      </span>
      {isHovered && !isPrinting && (
        <div 
          ref={tooltipRef}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 'calc(50% + var(--tooltip-offset, 0px))',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            background: 'var(--bg-card-dark)',
            color: 'var(--text-dim)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'normal',
            width: 'max-content',
            maxWidth: 'min(300px, 85vw)',
            textAlign: 'center',
            lineHeight: '1.5',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-main)',
            pointerEvents: 'none',
          }}
        >
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 'calc(50% - var(--tooltip-offset, 0px))',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: 'var(--border-main) transparent transparent transparent'
          }} />
        </div>
      )}
    </span>
  );
}
