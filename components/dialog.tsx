import React from "react";

interface DialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
    open,
    title,
    description,
    onClose,
    onConfirm,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    children,
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
                {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
                {description && <p className="mb-4">{description}</p>}
                {children}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    {onConfirm && (
                        <button
                            className="px-4 py-2 rounded bg-highlight text-white hover:bg-highlight/40"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dialog;