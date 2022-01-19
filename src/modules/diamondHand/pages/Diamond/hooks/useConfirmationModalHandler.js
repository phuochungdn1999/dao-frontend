import { useState } from 'react';

export const useConfirmModalHandler = () => {
  const [isConfirmModalVisible, setIsConfirmModalVisibility] = useState(false);

  const openConfirmModal = () => setIsConfirmModalVisibility(true);

  const closeConfirmModal = () => setIsConfirmModalVisibility(false);

  return {
    openConfirmModal,
    closeConfirmModal,
    isConfirmModalVisible,
  };
};
