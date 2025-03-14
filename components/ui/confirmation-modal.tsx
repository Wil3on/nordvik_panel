import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button 
} from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger" | "warning" | "success";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  isLoading = false
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          {confirmColor === "danger" && <AlertTriangle className="w-5 h-5 text-danger" />}
          {title}
        </ModalHeader>
        <ModalBody>
          {typeof description === "string" ? (
            <p>{description}</p>
          ) : (
            description
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={onClose}
            isDisabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            color={confirmColor} 
            onPress={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
