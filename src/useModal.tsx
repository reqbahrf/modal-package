'use client';
import { useCallback, useMemo, useState, useRef } from 'react';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import type { OpenModalProps, ModalInstance, NoticeType } from './types';

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
    try {
      return (crypto as any).randomUUID();
    } catch {}
  }
  // fallback:
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

const useModal = () => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  // Force-close helper used by confirmation flow
  const _forceCloseModal = useCallback((id: string) => {
    setModalStack((prev) => {
      const instanceToClose = prev.find((m) => m.closeId === id);
      if (instanceToClose?.onCloseCallback) {
        instanceToClose.onCloseCallback();
      }
      return prev.filter((m) => m.closeId !== id);
    });
  }, []);

  // create confirmation modal (opens a tiny modal asking user to confirm)
  const createConfirmationModal = useCallback(
    (
      originalModalId: string,
      originalBgColor: string,
      noticeType: NoticeType,
      textContent: string
    ) => {
      const headerClass =
        noticeType === 'warn'
          ? 'ram-color-header-warn'
          : 'ram-color-header-notify';

      const handleConfirm = () => {
        setModalStack((prev) => {
          const newPrev = prev.slice(0, -1);
          return newPrev;
        });
        _forceCloseModal(originalModalId);
      };

      const handleCancel = () => {
        setModalStack((prev) => prev.slice(0, -1));
      };

      const confirmationContent = (
        <ConfirmationModal
          text={textContent}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          headerClass={headerClass}
        />
      );

      const newId = generateId();
      const newModalInstance: ModalInstance = {
        id: newId,
        content: confirmationContent,
        title: 'Confirm Action',
        headerColor: headerClass,
        bodyColor: originalBgColor,
        size: 'sm',
        closeId: newId,
      };

      return newModalInstance;
    },
    [_forceCloseModal]
  );

  const closeModal = useCallback(
    (id?: string) => {
      setModalStack((prevStack) => {
        if (prevStack.length === 0) return prevStack;
        const closeId = id || prevStack[prevStack.length - 1].closeId;
        const instanceToClose = prevStack.find((m) => m.closeId === closeId);
        if (!instanceToClose) return prevStack;

        if (instanceToClose.onBeforeClosing) {
          const top = prevStack[prevStack.length - 1];
          const confirmationAlreadyTop = top && top.title === 'Confirm Action';

          if (!confirmationAlreadyTop) {
            const newConfirmationInstance = createConfirmationModal(
              closeId,
              instanceToClose.bodyColor || '',
              instanceToClose.onBeforeClosing.noticeType,
              instanceToClose.onBeforeClosing.textContent
            );
            return [...prevStack, newConfirmationInstance];
          }
          return prevStack;
        }

        if (instanceToClose.onCloseCallback) {
          instanceToClose.onCloseCallback();
        }

        return prevStack.filter((m) => m.closeId !== closeId);
      });
    },
    [createConfirmationModal]
  );

  const openModal = useCallback((props: OpenModalProps) => {
    const newId = generateId();
    const newModalInstance: ModalInstance = {
      id: newId,
      content: props.content,
      title: props.title,
      triggerRef: props.triggerRef,
      headerColor: props.headerColor,
      bodyColor: props.bodyColor,
      size: props.size || 'md',
      closeId: newId,
      onCloseCallback: props.onClose ? () => props.onClose() : undefined,
      onBeforeClosing: props.onBeforeClosing || null,
      disableBackdropClose: props.disableBackdropClose,
      disableEscapeClose: props.disableEscapeClose,
    };

    setModalStack((prev) => [...prev, newModalInstance]);
  }, []);

  // Memoize rendered modals to avoid re-creating elements every render
  const renderedModals = useMemo(() => {
    return modalStack.map((instance, index) => {
      const isTopModal = index === modalStack.length - 1;
      const zIndex = 100 + index * 10;

      return (
        <Modal
          key={instance.closeId}
          id={instance.closeId}
          size={instance.size}
          title={instance.title}
          headerColor={instance.headerColor}
          bodyColor={instance.bodyColor}
          onClose={closeModal}
          triggerRef={instance.triggerRef}
          isTopModal={isTopModal}
          disableBackdropClose={instance.disableBackdropClose}
          disableEscapeClose={instance.disableEscapeClose}
          style={{ zIndex }}
        >
          {instance.content}
        </Modal>
      );
    });
  }, [modalStack, closeModal]);

  return { modalStack: renderedModals, openModal, closeModal };
};

export default useModal;
