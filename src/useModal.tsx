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
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [triggerRef, setTriggerRef] = useState<
    React.RefObject<HTMLButtonElement> | undefined
  >(undefined);
  const [modalHeaderColor, setModalHeaderColor] = useState('');
  const [size, setSize] = useState<ModalSize>('md');
  const [onCloseCallback, setOnCloseCallback] = useState<
    (() => void) | undefined
  >(undefined);

  const openModal = useCallback(
    ({
      children,
      size,
      title,
      headerColor,
      onClose,
      triggerRef,
    }: OpenModalProps) => {
      setSize(size);
      setModalContent(children);
      setModalTitle(title);
      setModalHeaderColor(headerColor || 'bg-white dark:bg-gray-950');
      setTriggerRef(triggerRef);
      setOnCloseCallback(() => {
        return () => {
          setIsOpen(false);
          if (onClose) {
            onClose();
          }
        };
      });
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
    setTriggerRef(undefined);
    setModalTitle('');
    setModalHeaderColor('');
    setOnCloseCallback(undefined);
  }, []);

  const modal = isOpen ? (
    <Modal
      size={size}
      title={modalTitle}
      headerColor={modalHeaderColor}
      onClose={onCloseCallback || closeModal}
      triggerRef={triggerRef}
    >
      {modalContent!}
    </Modal>
  ) : null;

  return { modal, openModal, closeModal };
};

export default useModal;
