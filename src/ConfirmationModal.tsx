'use client';
import React from 'react';

interface Props {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  headerClass?: string;
}

const ConfirmationModal: React.FC<Props> = ({
  text,
  onConfirm,
  onCancel,
  headerClass,
}) => {
  return (
    <div className='ram-confirmation-content-wrapper'>
      <p className='ram-confirmation-text'>{text}</p>
      <div className='ram-confirmation-actions'>
        <button
          type='button'
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={onConfirm}
          className={`ram-confirmation-button-base ${headerClass || ''}`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
