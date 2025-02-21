import { useState } from "react";

export function useModal() {
  const [currentModal, setCurrentModal] = useState(null);

  const openModal = (modalName) => setCurrentModal(modalName);
  const closeModal = () => setCurrentModal(null);

  return { currentModal, openModal, closeModal };
}
