export interface ModalProps {
    onClose: () => void;
    // errorMessage: string | null;
}

export interface ErrorModalProps extends ModalProps {
    errorMessage: string;
}

export interface StudentVerificationModalProps extends ModalProps {
    onVerificationSuccess: () => void;
    zID: string;
    courseCode: string;
    term: string;
}

export interface StaffVerificationModalProps extends ModalProps {
    onVerificationSuccess: () => void;
    email: string;
}

export interface AssessmentModalProps extends ModalProps {
    courseId: string | null;
}
export interface QuestionModalProps extends ModalProps {
    courseId: string | null;
}

export interface ConfirmModalProps extends ModalProps{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}