import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ModalContextValue, ModalStackItem, ModalConfig } from './types';

/**
 * React context for the modal stack manager.
 */
const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Hook to access the modal stack context.
 * Must be used within a ModalProvider.
 *
 * @throws Error if used outside of ModalProvider
 */
export function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      '[ModalManager] useModalContext must be used within a <ModalProvider>. ' +
        'Wrap your application (or the relevant subtree) with <ModalProvider>.'
    );
  }
  return context;
}

/**
 * Props for the ModalProvider component.
 */
interface ModalProviderProps {
  /** The application tree */
  children: React.ReactNode;
  /** Maximum number of modals allowed in the stack (default: 10) */
  maxStack?: number;
}

/**
 * ModalProvider manages a stack of modal dialogs. It provides context
 * for opening, closing, and managing multiple overlapping modals.
 *
 * Place this component near the root of your application.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <MyApp />
 *     </ModalProvider>
 *   );
 * }
 * ```
 */
export function ModalProvider({ children, maxStack = 10 }: ModalProviderProps) {
  const [stack, setStack] = useState<ModalStackItem[]>([]);

  /**
   * Push a new modal onto the stack.
   */
  const pushModal = useCallback(
    (id: string, element: React.ReactNode, config?: Partial<ModalConfig>) => {
      setStack((prev) => {
        // Prevent duplicate IDs
        if (prev.some((item) => item.id === id)) {
          console.warn(
            `[ModalManager] Modal with id "${id}" is already in the stack. Ignoring.`
          );
          return prev;
        }

        // Enforce max stack depth
        if (prev.length >= maxStack) {
          console.warn(
            `[ModalManager] Maximum modal stack depth (${maxStack}) reached. Ignoring.`
          );
          return prev;
        }

        const fullConfig: ModalConfig = {
          id,
          closeOnBackdrop: true,
          closeOnEscape: true,
          lockScroll: true,
          trapFocus: true,
          animationDuration: 200,
          ...config,
        };

        const newItem: ModalStackItem = {
          id,
          element,
          config: fullConfig,
        };

        // Notify onOpen callback
        if (fullConfig.onOpen) {
          fullConfig.onOpen();
        }

        return [...prev, newItem];
      });
    },
    [maxStack]
  );

  /**
   * Pop the topmost modal from the stack.
   */
  const popModal = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;

      const removed = prev[prev.length - 1];
      if (removed.config.onClose) {
        removed.config.onClose();
      }

      return prev.slice(0, -1);
    });
  }, []);

  /**
   * Close a specific modal by its ID.
   */
  const closeModal = useCallback((id: string) => {
    setStack((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item?.config.onClose) {
        item.config.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  /**
   * Close all modals in the stack.
   */
  const closeAll = useCallback(() => {
    setStack((prev) => {
      // Notify all onClose callbacks
      for (const item of prev) {
        if (item.config.onClose) {
          item.config.onClose();
        }
      }
      return [];
    });
  }, []);

  /**
   * The ID of the topmost modal, or null if the stack is empty.
   */
  const activeModalId = useMemo(
    () => (stack.length > 0 ? stack[stack.length - 1].id : null),
    [stack]
  );

  /**
   * Check if a specific modal is currently open.
   */
  const isOpen = useCallback(
    (id: string) => stack.some((item) => item.id === id),
    [stack]
  );

  const contextValue: ModalContextValue = useMemo(
    () => ({
      pushModal,
      popModal,
      closeModal,
      closeAll,
      stack,
      activeModalId,
      isOpen,
    }),
    [pushModal, popModal, closeModal, closeAll, stack, activeModalId, isOpen]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Render the modal stack */}
      {stack.map((item) => (
        <React.Fragment key={item.id}>{item.element}</React.Fragment>
      ))}
    </ModalContext.Provider>
  );
}
