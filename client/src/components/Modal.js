import React from 'react';
import ModalPanel from 'react-modal';

const customStyles = {
  content : {
    top                   : '0',
    left                  : '0',
    right                 : '0',
    bottom                : '0',
    marginRight           : '0',
  }
};

ModalPanel.setAppElement('#root');

export const Modal = ({children, isOpen, onClose, onAfterOpen}) => {

  return (
    <ModalPanel
      isOpen={isOpen}
      // onAfterOpen={() => console.log('on after open')}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
      closeTimeoutMS={600}
      className="app-modal"
      bodyOpenClassName={'body--modal-open'}
    >
      { children }
    </ModalPanel>
  );
};
