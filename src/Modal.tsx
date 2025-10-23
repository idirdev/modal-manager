import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from './types';
import { createFocusTrap, lockBodyScroll } from './utils';

/**
 * Base Modal component that renders in a portal with backdrop,
 * focus trapping, scroll locking, and keyboard interactions.
 *
 * Supports open/close animations with configurable duration.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="My Modal"
 * >
 *   <p>Modal content goes here.</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  trapFocus = true,
  lockScroll = true,
  width = '480px',
  className,
  zIndex = 9000,
  animationDuration = 200,
  showCloseButton = true,
  footer,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const focusTrapCleanupRef = useRef<(() => void) | null>(null);
  const scrollLockCleanupRef = useRef<(() => void) | null>(null);

  // Handle open/close transitions
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Trigger enter animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      // Trigger exit animation
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible, animationDuration]);

  // Focus trap
  useEffect(() => {
    if (isOpen && trapFocus && contentRef.current) {
      focusTrapCleanupRef.current = createFocusTrap(contentRef.current);
    }

    return () => {
      if (focusTrapCleanupRef.current) {
        focusTrapCleanupRef.current();
        focusTrapCleanupRef.current = null;
      }
    };
  }, [isOpen, trapFocus]);

  // Scroll lock
  useEffect(() => {
    if (isOpen && lockScroll) {
      scrollLockCleanupRef.current = lockBodyScroll();
    }

    return () => {
      if (scrollLockCleanupRef.current) {
        scrollLockCleanupRef.current();
        scrollLockCleanupRef.current = null;
      }
    };
  }, [isOpen, lockScroll]);

  // Escape key handler
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

  // Backdrop click handler
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!isVisible) return null;

  const transitionStyle = `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isAnimating ? 1 : 0,
          transition: `opacity ${animationDuration}ms ease`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={className}
        style={{
          position: 'relative',
          width,
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(8px)',
          transition: transitionStyle,
        }}
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
                id="modal-title"
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
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
                  fontSize: '20px',
                  lineHeight: 1,
                  transition: 'background-color 0.15s, color 0.15s',
                  marginLeft: 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
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
            padding: '20px',
            overflow: 'auto',
            flex: 1,
            fontSize: '14px',
            color: '#374151',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
