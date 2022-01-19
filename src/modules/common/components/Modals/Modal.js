import { useState, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import useDetectedOutsideClick from './hooks';
import { IBaseElement } from '../BaseElement';
import * as S from './styled';
import { ThemeContext } from 'styled-components';

const modalRoot = document.getElementById('modal');

const Modal = ({
  children,
  title,
  size,
  isOpen = true,
  onClose,
  danger,
  customLayout = false,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  // const { colors } = useContext(ThemeContext);
  const modalRef = useRef(null);

  const handleOutsideClick = () => {
    if (isOpen && onClose && isActive) {
      onClose();
    }
  };

  useDetectedOutsideClick(modalRef, handleOutsideClick);

  const handleModalEntered = () => setIsActive(true);
  const handleModalExit = () => setIsActive(false);

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      mountOnEnter
      unmountOnExit
      classNames="modal"
      onEntered={handleModalEntered}
      onExit={handleModalExit}
    >
      <S.Background>
        {customLayout ? (
          children
        ) : (
          <S.Modal {...rest} ref={modalRef} className={size} danger={danger}>
            {title && <S.Heading>{title}</S.Heading>}
            {onClose && (
              <S.ExitButton onClick={onClose}>
                <svg width="25" height="24" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.8463 6L6.53857 18"
                    stroke={'#cacaca'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.53857 6L18.8463 18"
                    stroke={'#cacaca'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </S.ExitButton>
            )}
            <S.Content className={size}>{children}</S.Content>
          </S.Modal>
        )}
      </S.Background>
    </CSSTransition>);
};

export default Modal;
