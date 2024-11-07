export interface ModalProps {
    onClose: () => void;
    // errorMessage: string | null;
}

export interface ErrorModalProps extends ModalProps {
    errorMessage: string | null;
}

export interface StudentVerificationModalProps extends ModalProps {
    onVerificationSuccess: () => void;
    zID: string;
    courseCode: string;
}

export interface StaffVerificationModalProps extends ModalProps {
    onVerificationSuccess: () => void;
    email: string;
}

export interface QuestionModalProps extends ModalProps {
    courseId: string | null;
}