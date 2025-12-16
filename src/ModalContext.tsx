'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useModal from './useModal';
import type { OpenModalProps, CloseModalProps } from './types';

interface ModalContextType {
  openModal: (props: OpenModalProps) => void;
  closeModal: (props?: CloseModalProps) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modalStack, openModal, closeModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (modalStack.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalStack]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {mounted &&
        modalStack.map((modalElement) =>
          createPortal(modalElement, document.body)
        )}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
