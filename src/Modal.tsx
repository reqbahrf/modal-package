// src/Modal.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import type { ModalInstance } from './types';

type Props = Omit<ModalInstance, 'content' | 'id' | 'closeId'> & {
  id: string;
  onClose: (id?: string) => void;
  children: React.ReactNode;
  isTopModal: boolean;
  style?: React.CSSProperties;
};

const Modal: React.FC<Props> = ({
  id,
  title,
  size = 'md',
  headerColor,
  bodyColor,
  triggerRef,
  onClose,
  children,
  isTopModal,
  style,
  disableBackdropClose,
  disableEscapeClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Set transform origin (so scale animation originates from trigger)
  useEffect(() => {
    if (!modalRef.current) return;
    try {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        modalRef.current.style.transformOrigin = `${centerX}px ${centerY}px`;
      } else {
        // default center
        modalRef.current.style.transformOrigin = `50% 50%`;
      }
    } catch {
      // ignore measurement errors (SSR guard)
    }
  }, [triggerRef]);

  // ESC key close (unless disabled)
  useEffect(() => {
    if (disableEscapeClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [id, onClose, disableEscapeClose]);

  const handleBackdropClick = () => {
    console.log('Backdrop clicked');
    if (disableBackdropClose) return;
    onClose(id);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(id);
    console.log('run close modal');
  };

  const getSizeClass = (s: Props['size']) => {
    switch (s) {
      case 'sm':
        return 'ram-modal-size-sm';
      case 'md':
        return 'ram-modal-size-md';
      case 'full':
        return 'ram-modal-size-full';
      case 'responsive':
        return 'ram-modal-size-responsive';
      case 'md-f-h':
        return 'ram-modal-size-md-f-h';
      default:
        return 'ram-modal-size-md';
    }
  };

  const sizeClass = getSizeClass(size);

  return (
    <div
      className='ram-modal-overlay'
      style={style}
      ref={modalRef}
    >
      <div
        className={`ram-modal-backdrop ${
          isTopModal ? 'ram-active-backdrop' : 'ram-inactive-backdrop'
        }`}
        onClick={handleBackdropClick}
        aria-hidden='true'
      />
      <div
        role='dialog'
        aria-modal='true'
        className={`ram-modal-content ${sizeClass} ram-modal-enter ${
          isTopModal ? '' : 'inactive'
        } ${bodyColor || 'ram-default-body-content-color'}`}
      >
        <div
          className={`ram-modal-header ${
            headerColor || 'ram-default-header-color'
          }`}
        >
          <h2 className='ram-modal-title'>{title}</h2>
          <button
            type='button'
            className='ram-modal-close-button'
            aria-label='Close'
            onClick={handleCloseClick}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='22'
              height='22'
              fill='currentColor'
            >
              <path d='M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z' />
            </svg>
          </button>
        </div>
        <div className='ram-modal-body'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
