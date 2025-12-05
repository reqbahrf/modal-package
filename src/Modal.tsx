'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ModalProps } from './types';

const Modal = ({
  id,
  title,
  size,
  headerColor,
  bodyColor,
  triggerRef,
  onClose,
  children,
  isTopModal,
  style,
}: ModalProps) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const getSizeClass = (size: ModalProps['size']): string => {
    switch (size) {
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
        return 'ram-modal-size-md'; // Default to md if size is undefined or unhandled
    }
  };
  const sizeClass = getSizeClass(size);

  useEffect(() => {
    if (modalRef.current) {
      let ReferenceCenterX: number;
      let ReferenceCenterY: number;

      if (triggerRef?.current) {
        const buttonRect = triggerRef.current.getBoundingClientRect();
        ReferenceCenterX = buttonRect.left + buttonRect.width / 2;
        ReferenceCenterY = buttonRect.top + buttonRect.height / 2;
      } else {
        ReferenceCenterX = window.innerWidth / 2;
        ReferenceCenterY = window.innerHeight / 2;
      }

      modalRef.current.style.transformOrigin = `${ReferenceCenterX}px ${ReferenceCenterY}px`;
      const animation = modalRef.current.animate(
        [
          { transform: 'scale(0)', opacity: 0, borderRadius: '40px' },
          { transform: 'scale(1)', opacity: 1, borderRadius: '0px' },
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.55, 0.09, 0.68, 0.53)',
        }
      );

      animation.onfinish = () => {
        setIsAnimationComplete(true);
      };

      return () => {
        animation?.cancel();
      };
    }
  }, [triggerRef]);

  return (
    <div
      ref={modalRef}
      style={style}
      className='ram-modal-overlay'
    >
      <div
        className={`ram-modal-backdrop ${
          isAnimationComplete
            ? isTopModal
              ? 'ram-active-backdrop'
              : 'ram-inactive-backdrop'
            : 'ram-animationNotComplete'
        }`}
      />
      <div
        className={`ram-modal-content ${sizeClass} ${
          bodyColor || 'bg-gray-800 text-white'
        }`}
      >
        <div
          className={`ram-modal-header ${
            headerColor || 'bg-blue-500 text-white'
          }`}
        >
          <h2 className='ram-modal-title'>{title}</h2>
          <button
            onClick={() => onClose(id)}
            className='ram-modal-close-button'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='32'
              height='32'
              fill='currentColor'
            >
              <path d='M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z'></path>
            </svg>
          </button>
        </div>
        <div className={`ram-modal-body`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
