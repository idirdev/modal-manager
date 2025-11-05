import { useState, useCallback, useMemo } from 'react';

/**
 * Return type for the useModal hook.
 */
export interface UseModalReturn {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Open the modal */
  open: () => void;
  /** Close the modal */
  close: () => void;
  /** Toggle the modal open/closed */
  toggle: () => void;
  /** Props to spread on a Modal component: { isOpen, onClose } */
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  /** Props to spread on a trigger button: { onClick } */
  triggerProps: {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
  };
}

/**
 * Options for the useModal hook.
 */
export interface UseModalOptions {
  /** Initial open state (default: false) */
  defaultOpen?: boolean;
  /** Callback when the modal is opened */
  onOpen?: () => void;
  /** Callback when the modal is closed */
  onClose?: () => void;
}

/**
 * Simple hook for managing a single modal's open/close state.
 *
 * Returns convenience props that can be spread directly on
 * the Modal component and trigger button.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const modal = useModal({
 *     onOpen: () => console.log('opened'),
 *     onClose: () => console.log('closed'),
 *   });
 *
 *   return (
 *     <>
 *       <button {...modal.triggerProps}>Open Modal</button>
 *       <Modal {...modal.modalProps} title="Hello">
 *         <p>Modal content</p>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const { defaultOpen = false, onOpen, onClose } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    if (onOpen) onOpen();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && onOpen) onOpen();
      if (!next && onClose) onClose();
      return next;
    });
  }, [onOpen, onClose]);

  const modalProps = useMemo(
    () => ({
      isOpen,
      onClose: close,
    }),
    [isOpen, close]
  );

  const triggerProps = useMemo(
    () => ({
      onClick: open,
      'aria-expanded': isOpen as boolean,
      'aria-haspopup': 'dialog' as const,
    }),
    [open, isOpen]
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps,
    triggerProps,
  };
}
