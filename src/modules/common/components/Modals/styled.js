import styled from 'styled-components';
import BaseElement from '../BaseElement';

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(29, 47, 59, 0.5);
  transition: opacity 0.5s;
  z-index:2;

  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
  }

  &.modal-enter {
    opacity: 0;
  }

  &.modal-enter-active {
    opacity: 1;
  }

  &.modal-exit {
    opacity: 1;
  }

  &.modal-exit-active {
    opacity: 0;
  }
`;

export const Modal = styled(BaseElement)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0px;
  transform: translate(-50%, -50%);
  width: 50%;
  max-height: 95vh;
  max-width: 400px;
  color: grey;
  border-radius: 20px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid 


  @media (max-width: 350px) {
    width: calc(100% - 24px);
  }

  &.medium {
    max-width: 550px;
  }

  &.large {
    max-width: 800px;
  }
  
  &.extra-large {
    max-width: 40%;

    @media (max-width: 768px){
      max-width: unset;
    }
  }
`;

export const Heading = styled.h1`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0;
  padding: 16px 32px;
  width: 400px;
  height: 84px;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 30px 30px 30px;
  width: 100%;
  min-height: 100px;
  border-radius: 0px 0px 20px 20px;
  overflow-y: auto;
`;

export const ExitButton = styled.button`
  position: absolute;
  top: 31px;
  right: 35px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: 0.2s ease-out;

 
  &:hover {
    transform: scale(1.3);
  }
`;
