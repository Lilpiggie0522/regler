export interface ModalProps {
    onClose: () => void;
    // errorMessage: string | null;
}

export interface ErrorModalProps extends ModalProps {
    errorMessage: string | null;
}

export interface StudentVerificationModalProps extends ModalProps {
    onVerificationSuccess: () => void;
}

  