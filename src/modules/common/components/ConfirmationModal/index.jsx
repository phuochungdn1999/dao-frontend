import styled from 'styled-components';
import Button from '../Button/Button';
import Modal from '../Modals/Modal';
import BaseElement from '../BaseElement';

const Separator = styled(BaseElement)`
  width: 100%;
  height: 1px;
`;

const PrimaryInfo = styled.p`
  font-family: "Nunito Sans", Roboto;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin: 4px 0px;
  width: 100%;
  text-align: center;
`;

export const ConfirmationModal = ({
  heading,
  message,
  loading,
  onConfirm,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen || loading} onClose={onClose} title={heading}>
      <Separator spacing={{ mb: '24px', mt: '0' }} />
      <PrimaryInfo>{message}</PrimaryInfo>
      <Separator spacing={{ mt: '24px', mb: '12px' }} />
      <Button onClick={onConfirm} loading={loading} disabled={loading}>
        Confirm
      </Button>
    </Modal>
  );
};
