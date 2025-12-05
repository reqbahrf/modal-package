'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { ModalProps } from './types';

const Modal = ({
  title,
  size,
  headerColor,
  bodyColor,
  triggerRef,
  onClose,
  children,
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
      className={`ram-modal-overlay ${
        isAnimationComplete ? 'animationCompleted' : 'animationNotComplete'
      }`}
    >
      <div className={`ram-modal-content ${sizeClass}`}>
        <div
          className={`ram-modal-header ${
            headerColor || 'bg-white dark:bg-gray-800'
          }`}
        >
          <h2 className='ram-modal-title'>{title}</h2>
          <button
            onClick={onClose}
            className='ram-modal-close-button'
          >
            &times;
          </button>
        </div>
        <div className='ram-modal-body'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
