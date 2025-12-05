'use client';
import { useEffect, useRef, useState, useCallback, ReactElement } from 'react';
import Modal from './Modal';
import type { OpenModalProps, ModalInstance, NoticeType } from './types';

let nextId = 1;
const generateId = () => {
  return String(nextId++);
};

interface UseModalReturn {
  modalStack: ReactElement[];
  openModal: (props: OpenModalProps) => void;
  closeModal: (id?: string) => void;
}

const useModal = (): UseModalReturn => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  const _forceCloseModal = useCallback((id: string) => {
    setModalStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;

      const instanceToClose = prevStack.find((m) => m.closeId === id);
      if (instanceToClose?.onCloseCallback) {
        instanceToClose.onCloseCallback();
      }
      return prevStack.filter((m) => m.closeId !== id);
    });
  }, []);

  const openModalRef = useRef<((props: OpenModalProps) => void) | null>(null);
  const closeModalRef = useRef<((id?: string) => void) | null>(null);

  const createConfirmationModal = useCallback(
    (
      originalModalId: string,
      originalBgColor: string,
      noticeType: NoticeType,
      textContent: string
    ) => {
      const getColors = (type: NoticeType) => {
        switch (type) {
          case 'warn':
            return 'ram-color-header-warn';
          case 'notify':
          default:
            return 'ram-color-header-notify';
        }
      };

      const header = getColors(noticeType);
      const handleConfirm = () => {
        if (closeModalRef.current) {
          closeModalRef.current();
        }
        _forceCloseModal(originalModalId);
      };

      const handleCancel = () => {
        if (closeModalRef.current) {
          closeModalRef.current();
        }
      };

      const ConfirmationContent = (
        <div className='ram-confirmation-content-wrapper'>
          <p className='ram-confirmation-text'>{textContent}</p>
          <div className='ram-confirmation-actions'>
            <button onClick={handleCancel}>Cancel</button>
            <button
              onClick={handleConfirm}
              className={`ram-confirmation-button-base ${header}`}
            >
              Confirm Close
            </button>
          </div>
        </div>
      );

      if (openModalRef.current) {
        openModalRef.current({
          content: ConfirmationContent,
          title: 'Confirm Action',
          size: 'sm',
          headerColor: header,
          bodyColor: originalBgColor,
        });
      }
    },
    [_forceCloseModal]
  );
  const closeModal = useCallback(
    (id?: string) => {
      let instanceToClose: ModalInstance | undefined;
      let closeId: string | undefined;

      setModalStack((prevStack) => {
        if (prevStack.length === 0) return prevStack;

        closeId = id || prevStack[prevStack.length - 1].closeId;
        instanceToClose = prevStack.find((m) => m.closeId === closeId);

        if (!instanceToClose) return prevStack;

        if (instanceToClose.onBeforeClosing) {
          return prevStack;
        }
        if (instanceToClose.onCloseCallback) {
          instanceToClose.onCloseCallback();
        }

        return prevStack.filter((m) => m.closeId !== closeId);
      });

      if (instanceToClose?.onBeforeClosing && closeId) {
        createConfirmationModal(
          closeId,
          instanceToClose.bodyColor,
          instanceToClose.onBeforeClosing.noticeType,
          instanceToClose.onBeforeClosing.textContent
        );
      }
    },
    [createConfirmationModal]
  );

  const openModal = useCallback(
    ({
      content,
      size,
      title,
      headerColor,
      bodyColor,
      onClose,
      triggerRef,
      onBeforeClosing,
    }: OpenModalProps) => {
      const newId = generateId();

      const newModalInstance: ModalInstance = {
        id: newId,
        content: content,
        title: title,
        triggerRef: triggerRef,
        headerColor: headerColor || '',
        bodyColor: bodyColor || '',
        size: size || 'md',
        closeId: newId,
        onCloseCallback: () => {
          if (onClose) {
            onClose();
          }
        },
        onBeforeClosing: onBeforeClosing,
      };

      setModalStack((prevStack) => [...prevStack, newModalInstance]);
    },
    []
  );

  useEffect(() => {
    openModalRef.current = openModal;
    closeModalRef.current = closeModal;
  }, [openModal, closeModal]);

  const renderedModals = modalStack.map((instance, index) => {
    const isTopModal = index === modalStack.length - 1;
    const zIndex = 100 + index * 10;

    return (
      <Modal
        key={instance.id}
        id={instance.id}
        size={instance.size}
        title={instance.title}
        headerColor={instance.headerColor}
        bodyColor={instance.bodyColor}
        onClose={closeModal}
        triggerRef={instance.triggerRef}
        isTopModal={isTopModal}
        style={{ zIndex }}
      >
        {instance.content}
      </Modal>
    );
  });

  return { modalStack: renderedModals, openModal, closeModal };
};

export default useModal;
