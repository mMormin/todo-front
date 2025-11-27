import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  categoryName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 ">
            Category associated with a task
          </h2>
        </div>

        <div className="my-4 font-serif text-gray-700 text-sm tracking-wide">
          <p>
            Delete the category "
            <span className="font-semibold text-amber-800">{categoryName}</span>
            " will also delete <b>all associated tasks</b>.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium cursor-pointer"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
