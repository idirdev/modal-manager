import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { DrawerProps } from './types';
import { createFocusTrap, lockBodyScroll, getDrawerSize } from './utils';

/**
 * Returns the CSS transform for the drawer based on position and open state.
 */
function getTransform(position: string, isOpen: boolean): string {
  if (isOpen) return 'translate(0, 0)';

  switch (position) {
    case 'left':
      return 'translateX(-100%)';
    case 'right':
      return 'translateX(100%)';
    case 'top':
      return 'translateY(-100%)';
    case 'bottom':
      return 'translateY(100%)';
    default:
      return 'translateX(100%)';
  }
}

/**
 * Returns positioning styles for the drawer panel based on its position prop.
 */
function getPositionStyles(
  position: string,
  size: string
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: '#ffffff',
    boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  switch (position) {
    case 'left':
      return { ...base, top: 0, left: 0, bottom: 0, width: size, maxWidth: '100vw' };
    case 'right':
      return { ...base, top: 0, right: 0, bottom: 0, width: size, maxWidth: '100vw' };
    case 'top':
      return { ...base, top: 0, left: 0, right: 0, height: size, maxHeight: '100vh' };
    case 'bottom':
      return { ...base, bottom: 0, left: 0, right: 0, height: size, maxHeight: '100vh' };
    default:
      return { ...base, top: 0, right: 0, bottom: 0, width: size, maxWidth: '100vw' };
  }
}

/**
 * A slide-in drawer/panel component that appears from any edge of the screen.
 *
 * Supports left, right, top, and bottom positions with multiple size presets.
 * Includes backdrop, focus trapping, scroll locking, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Drawer
 *   isOpen={drawerOpen}
 *   onClose={() => setDrawerOpen(false)}
 *   position="right"
 *   size="md"
 *   title="Settings"
 * >
 *   <p>Drawer content here.</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  customSize,
  title,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className,
  animationDuration = 300,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const focusTrapCleanupRef = useRef<(() => void) | null>(null);
  const scrollLockCleanupRef = useRef<(() => void) | null>(null);

  const resolvedSize = customSize || getDrawerSize(size, position);

  // Handle open/close transitions
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible, animationDuration]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      focusTrapCleanupRef.current = createFocusTrap(panelRef.current);
    }
    return () => {
      if (focusTrapCleanupRef.current) {
        focusTrapCleanupRef.current();
        focusTrapCleanupRef.current = null;
      }
    };
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      scrollLockCleanupRef.current = lockBodyScroll();
    }
    return () => {
      if (scrollLockCleanupRef.current) {
        scrollLockCleanupRef.current();
        scrollLockCleanupRef.current = null;
      }
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!isVisible) return null;

  const panelStyles: React.CSSProperties = {
    ...getPositionStyles(position, resolvedSize),
    transform: getTransform(position, isAnimating),
    transition: `transform ${animationDuration}ms cubic-bezier(0.32, 0.72, 0, 1)`,
    zIndex: 9010,
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          opacity: isAnimating ? 1 : 0,
          transition: `opacity ${animationDuration}ms ease`,
        }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
        className={className}
        style={panelStyles}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
            fontSize: '14px',
            color: '#374151',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
