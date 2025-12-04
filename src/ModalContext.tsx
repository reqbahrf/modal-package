'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useModal from './useModal';
import type { OpenModalProps } from './types';

interface ModalContextType {
  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modal, openModal, closeModal } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {mounted && modal ? createPortal(modal, document.body) : null}
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
