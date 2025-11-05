import { useCallback, useMemo } from 'react';
import { useModalContext } from '../ModalProvider';
import type { ModalConfig, ModalStackItem } from '../types';

/**
 * Return type for the useModalStack hook.
 */
export interface UseModalStackReturn {
  /** Push a new modal onto the stack */
  push: (id: string, element: React.ReactNode, config?: Partial<ModalConfig>) => void;
  /** Pop the topmost modal off the stack */
  pop: () => void;
  /** Close a specific modal by ID */
  close: (id: string) => void;
  /** Close all modals in the stack */
  closeAll: () => void;
  /** The current modal stack */
  stack: ModalStackItem[];
  /** The number of modals currently open */
  count: number;
  /** The ID of the topmost (active) modal, or null */
  activeModalId: string | null;
  /** Check if a specific modal is open by ID */
  isOpen: (id: string) => boolean;
  /** Whether any modal is currently open */
  hasOpenModals: boolean;
  /** Check if a modal is the topmost in the stack */
  isTopmost: (id: string) => boolean;
  /** Get the stack index of a modal (-1 if not found) */
  indexOf: (id: string) => number;
}

/**
 * Hook for managing the modal stack within a ModalProvider context.
 *
 * Provides methods to push, pop, and close modals, as well as
 * information about the current stack state.
 *
 * Must be used within a `<ModalProvider>`.
 *
 * @example
 * ```tsx
 * function App() {
 *   const modalStack = useModalStack();
 *
 *   const openSettings = () => {
 *     modalStack.push('settings', (
 *       <Modal
 *         isOpen={true}
 *         onClose={() => modalStack.close('settings')}
 *         title="Settings"
 *       >
 *         <SettingsPanel />
 *       </Modal>
 *     ));
 *   };
 *
 *   const openNestedConfirm = () => {
 *     modalStack.push('confirm', (
 *       <ConfirmDialog
 *         isOpen={true}
 *         onClose={() => modalStack.close('confirm')}
 *         title="Are you sure?"
 *         message="This will discard your changes."
 *         onConfirm={() => {
 *           modalStack.closeAll();
 *         }}
 *       />
 *     ));
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={openSettings}>Settings</button>
 *       <p>Open modals: {modalStack.count}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModalStack(): UseModalStackReturn {
  const context = useModalContext();

  const { pushModal, popModal, closeModal, closeAll, stack, activeModalId, isOpen } =
    context;

  const count = stack.length;
  const hasOpenModals = count > 0;

  /**
   * Check if a modal is the topmost in the stack.
   */
  const isTopmost = useCallback(
    (id: string): boolean => {
      return activeModalId === id;
    },
    [activeModalId]
  );

  /**
   * Get the index of a modal in the stack (-1 if not found).
   */
  const indexOf = useCallback(
    (id: string): number => {
      return stack.findIndex((item) => item.id === id);
    },
    [stack]
  );

  return useMemo(
    () => ({
      push: pushModal,
      pop: popModal,
      close: closeModal,
      closeAll,
      stack,
      count,
      activeModalId,
      isOpen,
      hasOpenModals,
      isTopmost,
      indexOf,
    }),
    [
      pushModal,
      popModal,
      closeModal,
      closeAll,
      stack,
      count,
      activeModalId,
      isOpen,
      hasOpenModals,
      isTopmost,
      indexOf,
    ]
  );
}
