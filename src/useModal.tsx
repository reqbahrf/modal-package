'use client';
import React, { useState, useCallback, ReactElement } from 'react';
import Modal from './Modal';
import type { OpenModalProps, ModalSize } from './types';

interface UseModalReturn {
  modal: ReactElement | null;
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
}

const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    content: ReactElement | null;
    title: string;
    triggerRef: React.RefObject<HTMLButtonElement> | undefined;
    headerColor: string;
    bodyColor: string;
    size: ModalSize;
    onCloseCallback: (() => void) | undefined;
  }>({
    isOpen: false,
    content: null,
    title: '',
    triggerRef: undefined,
    headerColor: '',
    bodyColor: '',
    size: 'md',
    onCloseCallback: undefined,
  });

  const openModal = useCallback(
    ({
      children,
      size,
      title,
      headerColor,
      bodyColor,
      onClose,
      triggerRef,
    }: OpenModalProps) => {
      setModalState({
        isOpen: true,
        content: children,
        title,
        triggerRef,
        headerColor,
        bodyColor,
        size,
        onCloseCallback: () => {
          return () => {
            setIsOpen(false);
            if (onClose) {
              onClose();
            }
          };
        },
      });
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalState({
      isOpen: false,
      content: null,
      title: '',
      triggerRef: undefined,
      headerColor: '',
      bodyColor: '',
      size: 'md',
      onCloseCallback: undefined,
    });
  }, []);

  const modal = isOpen ? (
    <Modal
      size={modalState.size}
      title={modalState.title}
      headerColor={modalState.headerColor}
      bodyColor={modalState.bodyColor}
      onClose={modalState.onCloseCallback || closeModal}
      triggerRef={modalState.triggerRef}
    >
      {modalState.content!}
    </Modal>
  ) : null;

  return { modal, openModal, closeModal };
};

export default useModal;
