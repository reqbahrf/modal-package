'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useModal from './useModal';
import type { OpenModalProps } from './types';

interface ModalContextType {
  openModal: (props: OpenModalProps) => void;
  closeModal: (id?: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // modalStack is now an array of ReactElements
  const { modalStack, openModal, closeModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
